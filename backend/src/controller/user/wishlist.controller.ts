import { Request, Response } from 'express';
import * as wishlistService from '../../service/wishlist.service';

// 1. Get Wishlist
export const getWishlist = async (req: any, res: Response) => {
    try {
        const userId = req.user.id; 
        
        const wishlist = await wishlistService.getWishlist(userId);
        
        res.status(200).json({ 
            success: true, 
            data: wishlist 
        });
    } catch (error: any) {
        console.error("Get Wishlist Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 2. Add Item
export const addItem = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body; 
        
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        await wishlistService.addToWishlist(userId, productId);
        
        res.status(201).json({ 
            success: true, 
            message: "Item added to wishlist" 
        });
    } catch (error: any) {
        console.error("Add Wishlist Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 3. Remove Item
export const removeItem = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params; 

        await wishlistService.removeFromWishlist(userId, productId);
        
        res.status(200).json({ 
            success: true, 
            message: "Item removed from wishlist" 
        });
    } catch (error: any) {
        console.error("Remove Wishlist Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};