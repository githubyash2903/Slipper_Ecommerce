import * as orderService from '../../service/order.service'; 

export const getAllOrdersAdmin = async (req: any, res: any) => {
    try {
        const orders = await orderService.getAllOrdersAdmin();
        res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
        console.error("Admin Get Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// 1. ADMIN: Update Status
export const updateOrderStatus = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await orderService.updateOrderStatus(id, status);
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Status updated", data: updatedOrder });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. ADMIN: Get Single Order Details
export const getOrderDetailsAdmin = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderDetailsAdmin(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching details" });
    }
};



