import pool from '../../database/db';

export const getDashboardStats = async () => {
  const [revenueRes, ordersRes, usersRes, recentRes] = await Promise.all([
    
    pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue 
      FROM orders 
      WHERE status != 'cancelled'
    `),

    pool.query(`SELECT COUNT(*)::int as count FROM orders`),

    pool.query(`SELECT COUNT(*)::int as count FROM users WHERE role = 'USER'`),

 
    pool.query(`
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at, 
        u.name as customer,
        u.email as customer_email,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id)::int as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `)
  ]);

  return {
    totalRevenue: revenueRes.rows[0].total_revenue, 
    totalOrders: ordersRes.rows[0].count,          
    totalCustomers: usersRes.rows[0].count,        
    recentOrders: recentRes.rows                    
  };
};