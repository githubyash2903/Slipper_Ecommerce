import pool from '../database/db'; // Ensure this path matches your DB config

// src/services/order.service.ts

export const placeOrder = async (
    userId: string, 
    shippingAddress: any, 
    paymentMethod: string, 
    paymentInfo: any 
) => {
    
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 

        let initialStatus = 'pending';
        if (paymentInfo && paymentInfo.paymentId) {
            initialStatus = 'processing';
        }

        const razorpayOrderId = paymentInfo ? paymentInfo.orderId : null;

        const cartQuery = `
            SELECT c.*, p.price, p.wholesale_price, p.bulk_threshold, p.stock, p.name
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = $1
        `;
        const cartResult = await client.query(cartQuery, [userId]);
        const cartItems = cartResult.rows;

        if (cartItems.length === 0) throw new Error("Cart is empty");

        let totalAmount = 0;
        cartItems.forEach(item => {
            const isWholesale = item.bulk_threshold > 0 && item.quantity >= item.bulk_threshold;
            const finalPrice = isWholesale ? Number(item.wholesale_price) : Number(item.price);
            totalAmount += finalPrice * item.quantity;
        });

        const orderQuery = `
            INSERT INTO orders (
                user_id, taxes, total_amount, payment_method, shipping_address, razorpay_order_id, status
            )
            VALUES ($1, $2, $3, $4, $5, $6 ,$7) 
            RETURNING id;
        `;
        const orderResult = await client.query(orderQuery, [
            userId, paymentInfo.taxes, paymentInfo.total_amount, paymentMethod, shippingAddress, razorpayOrderId, initialStatus
        ]);
        const orderId = orderResult.rows[0].id;

        if (razorpayOrderId && paymentInfo.paymentId) {
            const updatePaymentQuery = `
                UPDATE payments SET status = 'success', razorpay_payment_id = $1, razorpay_signature = $2
                WHERE razorpay_order_id = $3
            `;
            await client.query(updatePaymentQuery, [paymentInfo.paymentId, paymentInfo.signature, razorpayOrderId]);
        }

        for (const item of cartItems) {
            const isWholesale = item.bulk_threshold > 0 && item.quantity >= item.bulk_threshold;
            const finalPrice = isWholesale ? Number(item.wholesale_price) : Number(item.price);

      
            const updateStockQuery = `
                UPDATE products 
                SET stock = stock - $1 
                WHERE id = $2 AND stock >= $1
            `;
            const stockResult = await client.query(updateStockQuery, [item.quantity, item.product_id]);

            if (stockResult.rowCount === 0) {
                throw new Error(`Product '${item.name}' is out of stock or insufficient quantity.`);
            }

            const itemQuery = `
                INSERT INTO order_items (order_id, product_id, quantity, price,  size, color)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await client.query(itemQuery, [
                orderId, item.product_id, item.quantity, finalPrice,  item.size, item.color
            ]);
        }

        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT'); 
        return { orderId, totalAmount, message: "Order placed successfully" };

    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error;
    } finally {
        client.release();
    }
};

export const getUserOrders = async (userId: string) => {
    const query = `
        SELECT 
            o.id, 
            o.total_amount, 
            o.status, 
            o.created_at, 
            o.shipping_address, 
            o.payment_method,
            o.razorpay_order_id,
            
            -- Payment Info object
            json_build_object(
                'razorpay_payment_id', pay.razorpay_payment_id,
                'status', COALESCE(pay.status, 'pending')
            ) as payment_info,

            -- Items List (JSON Array)
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', p.id,
                        'name', p.name,
                        'image', p.images[1], -- Ensure images array exists
                        'quantity', oi.quantity,
                        'size', oi.size,
                        'color', oi.color,
                        'price', oi.price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL), 
                '[]'
            ) as items

        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN payments pay ON o.razorpay_order_id = pay.razorpay_order_id
        
        WHERE o.user_id = $1
        GROUP BY o.id, pay.id
        ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// export const getAllOrdersAdmin = async () => {
//     const query = `
//       SELECT 
//         o.id, 
//         o.total_amount, 
//         o.status, 
//         o.created_at, 
//         o.shipping_address, 
//         o.payment_method,
  
//         -- 1. User Details
//         u.name as user_name, 
//         u.email, 
//         u.phone_number,
  
//         -- 2. Payment Details (Linked via razorpay_order_id)
//         pay.razorpay_payment_id, 
//         pay.razorpay_order_id, 
//         COALESCE(pay.status, 'pending') as payment_status, 
//         pay.razorpay_signature,
  
//         -- 3. Items Aggregation (Product Details)
//         COALESCE(
//           json_agg(
//             json_build_object(
//               'product_id', p.id,
//               'name', p.name,
//               'image', p.images[1], 
//               'quantity', oi.quantity,
//               'size', oi.size,
//               'color', oi.color,
//               'price', oi.price
//             )
//           ) FILTER (WHERE oi.id IS NOT NULL), 
//           '[]'
//         ) as items
  
//       FROM orders o
      
//       LEFT JOIN users u ON o.user_id = u.id
      
//       -- Join using the new column
//       LEFT JOIN payments pay ON o.razorpay_order_id = pay.razorpay_order_id
      
//       LEFT JOIN order_items oi ON o.id = oi.order_id
//       LEFT JOIN products p ON oi.product_id = p.id
  
//       GROUP BY o.id, u.id, pay.id
//       ORDER BY o.created_at DESC;
//     `;
  
//     const { rows } = await pool.query(query);
//     return rows;
// };


export const updateOrderStatus = async (orderId: string, status: string) => {
    const normalizedStatus = status.toLowerCase();
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(normalizedStatus)) {
        throw new Error(`Invalid status. Allowed: ${validStatuses.join(', ')}`);
    }

    const sql = `
        UPDATE orders 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING *;
    `;
    const result = await pool.query(sql, [normalizedStatus, orderId]);
    return result.rows[0];
};


export const getAllOrdersAdmin = async () => {
    const query = `
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at, 
        o.shipping_address, 
        o.payment_method,
        o.razorpay_order_id, -- Added specifically for reference

        -- 1. User Details
        u.name as user_name, 
        u.email, 
        u.phone_number,
  
        -- 2. Payment Details (Constructed as a JSON Object for Frontend)
        json_build_object(
            'razorpay_payment_id', pay.razorpay_payment_id,
            'razorpay_order_id', pay.razorpay_order_id,
            'status', COALESCE(pay.status, 'pending'),
            'method', o.payment_method
        ) as payment_info,
        
        -- Fallback Flat columns (Just in case frontend checks these too)
        pay.razorpay_payment_id,
        COALESCE(pay.status, 'pending') as payment_status,

        -- 3. Items Aggregation
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', p.id,
              'name', p.name,
              'image', p.images[1], 
              'quantity', oi.quantity,
              'size', oi.size,
              'color', oi.color,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL), 
          '[]'
        ) as items
  
      FROM orders o
      
      LEFT JOIN users u ON o.user_id = u.id
      
      -- Join using razorpay_order_id to fetch Payment Table details
      LEFT JOIN payments pay ON o.razorpay_order_id = pay.razorpay_order_id
      
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
  
      GROUP BY o.id, u.id, pay.id
      ORDER BY o.created_at DESC;
    `;
  
    const { rows } = await pool.query(query);
    return rows;
};


export const getOrderDetailsAdmin = async (orderId: string) => {
    const query = `
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at, 
        o.shipping_address, 
        o.payment_method,
        o.razorpay_order_id,

        u.name as user_name, 
        u.email, 
        u.phone_number,
  
        -- JSON Object for Payment Info
        json_build_object(
            'razorpay_payment_id', pay.razorpay_payment_id,
            'razorpay_order_id', pay.razorpay_order_id,
            'status', COALESCE(pay.status, 'pending')
        ) as payment_info,

        -- Flat columns fallback
        pay.razorpay_payment_id,
        pay.razorpay_order_id, 
        COALESCE(pay.status, 'pending') as payment_status, 
  
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', p.id,
              'name', p.name,
              'image', p.images[1], 
              'quantity', oi.quantity,
              'size', oi.size,
              'color', oi.color,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL), 
          '[]'
        ) as items
  
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN payments pay ON o.razorpay_order_id = pay.razorpay_order_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
  
      WHERE o.id = $1
      GROUP BY o.id, u.id, pay.id;
    `;
  
    const { rows } = await pool.query(query, [orderId]);
    
    if (rows.length === 0) return null;
    return rows[0];
};