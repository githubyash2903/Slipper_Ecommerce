import db from '../database/db'; 

// 1. Add Item to Wishlist
export const addToWishlist = async (userId: string, productId: string) => {
    const sql = `
        INSERT INTO wishlist (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING -- Agar duplicate hai to error nahi dega
        RETURNING *;
    `;
    const result = await db.query(sql, [userId, productId]);
    return result.rows[0];
};

// 2. Remove Item from Wishlist
export const removeFromWishlist = async (userId: string, productId: string) => {
    const sql = 'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2';
    await db.query(sql, [userId, productId]);
    return true;
};

// 3. Get Wishlist Items 
export const getWishlist = async (userId: string) => {
    const sql = `
        SELECT 
            p.id,
            p.name,
            p.price,
            p.image_url, 
            p.category,
            p.stock,
            p.is_sale,
            p.sale_percent,
            w.created_at as wishlist_date
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC;
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
};