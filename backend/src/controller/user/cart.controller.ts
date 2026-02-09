import * as cartService from '../../service/cart.service';

// 1. Get Cart
export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getUserCart(req.user.id);
        res.status(200).json({ 
            success: true, 
            data: cart 
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 2. Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { product_id, quantity, size, color } = req.body;
        
        if (!product_id || !quantity || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newItem = await cartService.addToCart(req.user.id, product_id, quantity, size, color);
        
        res.status(201).json({ 
            success: true, 
            message: "Item added successfully",
            data: newItem 
        });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not add item" });
    }
};

// 3. Update Item 
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params; 
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const updatedItem = await cartService.updateQuantity(req.user.id, id, quantity);
        
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Quantity updated",
            data: updatedItem 
        });
    } catch (error) {
        console.error("Update Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not update cart" });
    }
};

// 4. Remove Item
export const removeFromCart = async (req, res) => {
   
    try {
        const { id } = req.params;
      
        await cartService.removeItem(req.user.id, id);
        res.status(200).json({ success: true, message: "Item removed" });
    } catch (error) {
        console.error("Remove Item Error:", error);
        res.status(500).json({ success: false, message: "Could not remove item" });
    }
};

// 5. Clear Cart
export const clearCart = async (req, res) => {
    try {
        await cartService.clearUserCart(req.user.id);
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not clear cart" });
    }
};