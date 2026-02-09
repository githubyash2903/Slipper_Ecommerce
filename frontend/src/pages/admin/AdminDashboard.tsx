import { Link } from 'react-router-dom';
import {
  Package, Users, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight, Loader2
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

// ✅ MISSING IMPORT ADDED
import { fetchDashboardStats } from '@/api/admin/admin'; 
import { useProducts } from '@/hooks/useProducts';

// NOTE: useAdminUsers ki zaroorat nahi hai kyunki stats API count bhej rahi hai.

export default function AdminDashboard() {
  // Products fetch kar rahe hain Low Stock calculation ke liye (Ye theek hai)
  const { data: products, isLoading: productsLoading } = useProducts();
  
  // ✅ Fetch Real Dashboard Stats (Revenue, Orders, Users, Recent Orders)
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchDashboardStats,
  });

  // Calculations
  const totalProducts = products?.length || 0;
  
  // ✅ OPTIMIZATION: Backend se count le rahe hain instead of fetching 1000 users
  const totalCustomers = dashboardData?.totalCustomers || 0; 
  
  const lowStockProducts = products?.filter((p: any) => Number(p.stock) < 50) || []; // Alert threshold 50 se 10 kar diya (standard)

  const stats = [
  
    {
      title: 'Total Orders',
      value: statsLoading ? '...' : (dashboardData?.totalOrders || 0).toString(),
      change: '+12.5%', trend: 'up', icon: ShoppingCart,
    },
    {
      title: 'Products',
      value: productsLoading ? '...' : totalProducts.toString(),
      change: '+3', trend: 'up', icon: Package,
    },
    {
      title: 'Customers',
      // Ab ye statsLoading par depend karega, usersLoading par nahi
      value: statsLoading ? '...' : totalCustomers.toString(),
      change: '+8.2%', trend: 'up', icon: Users,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                   <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                   <span className="text-green-500">{stat.change}</span>
                   <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ Real Recent Orders from Backend */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
                ) : !dashboardData?.recentOrders || dashboardData.recentOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No orders yet</p>
                ) : (
                  dashboardData.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">#{order.id.substring(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{order.customer || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
                        <Badge variant="secondary" className="text-[10px] uppercase mt-1">
                            {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <Link to="/admin/products" className="text-sm text-primary hover:underline">Manage</Link>
            </CardHeader>
            <CardContent>
               {productsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
               ) : lowStockProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">All products are well stocked.</p>
               ) : (
                 <div className="space-y-4">
                    {lowStockProducts.slice(0, 5).map((product: any) => (
                       <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center gap-3">
                             {/* Fallback image agar image na ho */}
                             <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                )}
                             </div>
                             <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-destructive font-semibold">{product.stock} remaining</p>
                             </div>
                          </div>
                          <Link to={`/admin/products`}>
                             <Badge variant="outline" className="hover:bg-accent cursor-pointer">Restock</Badge>
                          </Link>
                       </div>
                    ))}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}