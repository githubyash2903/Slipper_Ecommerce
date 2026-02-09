import * as orderService from '../../service/order.service'; // Service import
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import pool from '../../database/db';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1 Place order
export const placeOrder = async (req: any, res: Response) => {
    try {
        const { 
            shippingAddress, 
            paymentMethod, 
            paymentInfo 
        } = req.body;
        
        const userId = req.user.id; 


        const result = await orderService.placeOrder(
            userId, 
            shippingAddress, 
            paymentMethod, 
            paymentInfo
        );

        res.status(201).json(result);
    } catch (error) {
          console.error("Place Order Error:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};
// 2. Get Orders History Controller
export const getUserOrders = async (req: any, res: any) => {
    try {
        const orders = await orderService.getUserOrders(req.user.id);
        res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};


//  step 1: Create Order
export const createOrder = async (req: any, res: any) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id; 

    const finalAmount = Math.round(parseFloat(amount) * 100);

    // 2. Razorpay Order Create karo
    const options = {
      amount: finalAmount, 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    await pool.query(
      `INSERT INTO payments (user_id, razorpay_order_id, amount, status) 
       VALUES ($1, $2, $3, 'pending')`,
      [userId, order.id, amount] 
    );

    res.json({
      success: true,
      order, 
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

//  Step 2: Verify Signature & Update DB
export const verifyPayment = async (req: any, res: any) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Signature Verify Logic
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");


    if (razorpay_signature === expectedSign) {
      
      await pool.query(
        `UPDATE payments 
         SET razorpay_payment_id = $1, razorpay_signature = $2, status = 'success'
         WHERE razorpay_order_id = $3`,
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      
      await pool.query(
        `UPDATE payments SET status = 'failed' WHERE razorpay_order_id = $1`,
        [razorpay_order_id]
      );
      
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};