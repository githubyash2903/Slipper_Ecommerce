import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Package, Loader2, User, MapPin, Calendar, CreditCard, ShoppingBag, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminOrders, updateOrderStatusAPI } from '@/api/admin/admin';


// --- HELPER 1: Status Colors ---
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    DELIVERED: 'bg-green-500/10 text-green-500 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[status?.toUpperCase()] || 'bg-gray-500/10 text-gray-500';
};

// --- HELPER 2: JSON Parser (Safe Parse) ---
const safeParse = (data: any) => {
  if (!data) return null;
  try {
    if (typeof data === 'string') {
      // Check if it looks like JSON
      if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
        return JSON.parse(data);
      }
      return data; 
    }
    return data; 
  } catch (e) {
    return data; 
  }
};

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { orderId: string, status: string }) => updateOrderStatusAPI(data.orderId, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] }); 
      toast({ title: 'Success', description: 'Status updated successfully' });
    },
    onError: (error: any) => {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  });

  const filteredOrders = orders.filter((order: any) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchLower) ||
      (order.user_name || '').toLowerCase().includes(searchLower) ||
      (order.email || '').toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search order ID, customer name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No orders found matching your criteria.
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders.map((order: any) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-medium">
                            #{order.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{order.user_name || 'Guest User'}</span>
                            <span className="text-xs text-muted-foreground">{order.email}</span>
                        </div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{Number(order.total_amount).toLocaleString()}</TableCell>
                        <TableCell>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setViewingOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* DETAILS MODAL */}
        <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl border-b pb-4">
                <Package className="h-5 w-5 text-primary" />
                Order Details
              </DialogTitle>
            </DialogHeader>
            
            {viewingOrder && (
              <div className="space-y-6">
                
                {/* Status Bar */}
                <div className="bg-secondary/20 p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">Current Status:</div>
                    <Badge className={`px-3 py-1 text-sm ${getStatusColor(viewingOrder.status)}`}>
                        {viewingOrder.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground">Update:</span>
                   <Select
  disabled={updateStatusMutation.isPending}
  value={viewingOrder.status ? viewingOrder.status.toUpperCase() : "PROCESSING"} 
  
  onValueChange={(val) => {
      setViewingOrder({...viewingOrder, status: val});
      updateStatusMutation.mutate({ orderId: viewingOrder.id, status: val });
  }}
>
  <SelectTrigger className="w-full sm:w-[160px] bg-background">
    <SelectValue placeholder="Select Status" /> 
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="PENDING">Pending</SelectItem>
    <SelectItem value="PROCESSING">Processing</SelectItem>
    <SelectItem value="SHIPPED">Shipped</SelectItem>
    <SelectItem value="DELIVERED">Delivered</SelectItem>
    <SelectItem value="CANCELLED">Cancelled</SelectItem>
  </SelectContent>
</Select>
                  </div>
                </div>

                {/* 🛒 NEW SECTION: ORDERED ITEMS */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                        <ShoppingBag className="h-4 w-4" /> Ordered Items
                    </h4>
                    <div className="border rounded-md divide-y">
                        {(() => {
                            // Ensure items is an array
                            const items = safeParse(viewingOrder.items) || [];
                            const itemsArray = Array.isArray(items) ? items : [items];

                            return itemsArray.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-muted/30 transition">
                                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
                                        {/* Fallback image logic */}
                                        <img 
                                            src={item.image || item.product_image || '/placeholder-shoe.png'} 
                                            alt={item.product_name || item.name} 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{item.product_name || item.name}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            {item.size && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                                    Size: {item.size}
                                                </Badge>
                                            )}
                                            {item.color && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 flex gap-1 items-center">
                                                    Color : {item.color}
                                                    
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">₹{Number(item.price).toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                        <User className="h-4 w-4" /> Customer Information
                    </h4>
                    <div className="space-y-3 pl-1 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-secondary rounded-full"><User className="h-4 w-4 text-muted-foreground" /></div>
                            <div>
                                <p className="font-medium">{viewingOrder.user_name}</p>
                                <p className="text-xs text-muted-foreground">Customer</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-secondary rounded-full"><Calendar className="h-4 w-4 text-muted-foreground" /></div>
                            <div className="pt-1">
                                <p className="font-medium">Date Placed</p>
                                <p className="text-xs text-muted-foreground">{new Date(viewingOrder.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                        <MapPin className="h-4 w-4" /> Shipping Details
                    </h4>
                    <div className="border rounded-md overflow-hidden bg-background text-sm">
                      <Table>
                        <TableBody>
                          {(() => {
                            const addr = safeParse(viewingOrder.shipping_address);
                            if (!addr || Object.keys(addr).length === 0) {
                                return (
                                <TableRow>
                                    <TableCell className="text-muted-foreground text-xs p-3">No address details available</TableCell>
                                </TableRow>
                                );
                            }
                            return (
                                <>
                                <TableRow>
                                    <TableCell className="w-[100px] bg-muted/40 font-medium text-xs p-2">Receiver</TableCell>
                                    <TableCell className="text-xs p-2">{addr.name || viewingOrder.user_name || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="bg-muted/40 font-medium text-xs p-2">Address</TableCell>
                                    <TableCell className="text-xs p-2 leading-relaxed">
                                    {addr.street || addr.address_line1 || addr.address || '-'} 
                                    {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                                    <br />
                                    {addr.city}, {addr.state} - <b>{addr.zipCode || addr.pincode}</b>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="bg-muted/40 font-medium text-xs p-2">Phone</TableCell>
                                    <TableCell className="text-xs p-2">{addr.phone || viewingOrder.phone_number || '-'}</TableCell>
                                </TableRow>
                                </>
                            );
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
                
                <hr className="border-dashed" />

                {/* 💳 UPDATED SECTION: Payment Summary */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-primary mb-3">
                        <CreditCard className="h-4 w-4" /> Payment Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Payment ID</p>
                            <p className="font-mono text-xs font-medium break-all">
                                {viewingOrder.payment_info?.razorpay_payment_id || viewingOrder.razorpay_payment_id || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Payment Status</p>
                            <Badge variant={viewingOrder.payment_status === 'success' || viewingOrder.status !== 'PENDING' ? 'default' : 'secondary'} className="mt-1">
                                {viewingOrder.payment_status || (viewingOrder.status === 'PENDING' ? 'Pending' : 'Paid')}
                            </Badge>
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">Order ID (Rzp)</p>
                            <p className="font-mono text-xs text-muted-foreground break-all">
                                {viewingOrder.razorpay_order_id || 'N/A'}
                            </p>
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">Method</p>
                            <p className="font-medium">
                                {viewingOrder.payment_method || 'Online / Razorpay'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                            ₹{Number(viewingOrder.total_amount).toLocaleString()}
                        </span>
                    </div>
                </div>

              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}