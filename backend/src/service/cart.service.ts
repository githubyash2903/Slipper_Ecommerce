import db from '../database/db'; 

export const getUserCart = async (userId: string) => {
    const sql = `
        SELECT 
            c.id,              -- Frontend expects 'id' (not cart_item_id)
            c.quantity,
            c.size,
            c.color,
            json_build_object(
                'id', p.id,
                'name', p.name,
                'price', p.price,
                'image', p.image_url,              -- Frontend expects 'image'
                'stock', p.stock,
                'wholesalePrice', p.wholesale_price, -- CamelCase for frontend
                'bulkThreshold', p.bulk_threshold    -- CamelCase for frontend
            ) AS product
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC;
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
};

export const addToCart = async (userId: string, productId: string, quantity: number, size: string, color: string) => {
    const sql = `
        INSERT INTO cart_items (user_id, product_id, quantity, size, color)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, product_id, size, color) 
        DO UPDATE SET 
            quantity = cart_items.quantity + EXCLUDED.quantity,
            updated_at = NOW()
        RETURNING *;
    `;
    
    const result = await db.query(sql, [userId, productId, quantity, size, color]);
    return result.rows[0];
};

export const updateQuantity = async (userId: string, cartItemId: string, quantity: number) => {
    const sql = `
        UPDATE cart_items 
        SET quantity = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const result = await db.query(sql, [quantity, cartItemId, userId]);
    return result.rows[0];
};

export const removeItem = async (userId: string, cartItemId: string) => {
    const sql = `DELETE FROM cart_items WHERE id = $1 AND user_id = $2`;
    await db.query(sql, [cartItemId, userId]);
    return { message: "Item removed" };
};

export const clearUserCart = async (userId: string) => {
    const sql = `DELETE FROM cart_items WHERE user_id = $1`;
    await db.query(sql, [userId]);
    return { message: "Cart cleared" };
};