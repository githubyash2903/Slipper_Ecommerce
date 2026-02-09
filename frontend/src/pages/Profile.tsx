import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User, Package, MapPin, Settings, LogOut, Trash2, Loader2, Eye, ShoppingBag, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { 
  useProfile, 
  useUpdateProfile, 
  useAddresses, 
  useAddAddress, 
  useDeleteAddress, 
  useOrders 
} from '@/hooks/useUsers';
import { useQueryClient } from '@tanstack/react-query';

const getInitials = (name: string) => {
  return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
};

// Helper for Status Colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- 1. DATA FETCHING ---
  const { data: userData, isLoading: isUserLoading } = useProfile();
  const { data: addressesData, isLoading: isAddrLoading } = useAddresses();
  const { data: ordersResponse, isLoading: isOrdersLoading } = useOrders();

  const user = userData?.data || userData;
  const addresses = addressesData?.data || addressesData;
  const orders = ordersResponse?.data || ordersResponse || []; 

  // --- 2. MUTATIONS ---
  const updateProfileMutation = useUpdateProfile();
  const addAddressMutation = useAddAddress();
  const deleteAddressMutation = useDeleteAddress();

  // --- 3. LOCAL STATE ---
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', street: '', city: '', state: '', zipCode: '', isDefault: false
  });
  
  // NEW: State for selected order Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone_number || '' 
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(
      { name: profileForm.name, phone: profileForm.phone },
      { onSuccess: () => toast({ title: "Profile Updated" }) }
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate(addressForm, {
      onSuccess: () => {
        setIsAddingAddress(false);
        setAddressForm({ name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
        toast({ title: "Address Added" });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    queryClient.removeQueries(); 
    navigate('/auth');
    toast({ title: "Logged Out" });
  };

  if (isUserLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
               {user?.avatar_url ? (
                 <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <span className="text-primary text-2xl font-bold">{getInitials(user?.name || '')}</span>
               )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className="mt-1">{user?.role}</Badge>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
              <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" /><span className="hidden sm:inline">Orders</span></TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2"><MapPin className="h-4 w-4" /><span className="hidden sm:inline">Addresses</span></TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Settings</span></TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91..." />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders">
              <Card>
                <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
                <CardContent>
                  {isOrdersLoading ? (
                    <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>
                  ) : !Array.isArray(orders) || orders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No orders found.</div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 bg-card hover:bg-muted/10 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Order #{order.id.substring(0, 8)}</span>
                                <Badge className={getStatusColor(order.status)} variant="outline">{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleDateString()} 
                              <span className="text-xs">• {order.items?.length || 0} Items</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <span className="font-bold text-lg">${Number(order.total_amount).toLocaleString()}</span>
                            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" /> View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ADDRESSES TAB */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button size="sm" onClick={() => setIsAddingAddress(!isAddingAddress)}>
                    {isAddingAddress ? 'Cancel' : 'Add Address'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAddingAddress && (
                    <form onSubmit={handleAddAddress} className="mb-6 p-4 border rounded-lg bg-secondary/20 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Label (Home/Work)" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} required />
                            <Input placeholder="Street" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} required />
                            <Input placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                            <Input placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required />
                            <Input placeholder="Zip Code" value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} required />
                        </div>
                        <div className="flex justify-end"><Button type="submit" size="sm">Save Address</Button></div>
                    </form>
                  )}
                  
                  {isAddrLoading ? <div>Loading...</div> : (!addresses || addresses.length === 0) && !isAddingAddress ? (
                    <div className="text-center py-8 text-muted-foreground">No addresses saved.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(addresses) && addresses.map((address: any) => (
                        <div key={address.id} className="p-4 border rounded-lg space-y-2 group relative">
                          <div className="flex justify-between">
                            <span className="font-medium">{address.name}</span>
                            {address.is_default && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.city}, {address.state} - {address.zip_code}
                          </p>
                          <div className="flex justify-end pt-2">
                             <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => deleteAddressMutation.mutate(address.id)}>
                               <Trash2 className="h-4 w-4 mr-1"/> Delete
                             </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
               <div className="p-4 border border-destructive/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-destructive">Sign Out</p>
                    <p className="text-sm text-muted-foreground">Log out of your account</p>
                  </div>
                  <Button variant="destructive" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2"/> Sign Out</Button>
               </div>
            </TabsContent>
          </Tabs>


          <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between border-b pb-4">
                        <span className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Order Details
                        </span>
                        {selectedOrder && (
                            <span className="text-sm font-normal text-muted-foreground mr-8">
                                #{selectedOrder.id.substring(0,8)}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>
                
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* 1. Status & Meta */}
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge className={`mt-1 ${getStatusColor(selectedOrder.status)}`} variant="outline">
                                    {selectedOrder.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date Placed</p>
                                <p className="font-medium mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="font-medium mt-1 capitalize">{selectedOrder.payment_method || 'Online'}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Payment Status</p>
                                <p className="font-medium mt-1 capitalize text-green-600">
                                    {selectedOrder.payment_info?.status || 'Paid'}
                                </p>
                            </div>
                        </div>

                        {/* 2. Items List */}
                        <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                <ShoppingBag className="h-4 w-4" /> Ordered Items
                            </h4>
                            <div className="border rounded-md divide-y">
                                {selectedOrder.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-3 hover:bg-muted/20">
                                        <div className="h-16 w-16 bg-muted rounded-md border overflow-hidden flex-shrink-0">
                                            <img src={item.image || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">Size: {item.size}</Badge>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">Color: {item.color}</Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">${Number(item.price).toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Address & Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                    <MapPin className="h-4 w-4" /> Shipping Address
                                </h4>
                                <div className="text-sm border rounded-md p-3 bg-background space-y-1">
                                    {selectedOrder.shipping_address ? (
                                        <>
                                            <p className="font-medium">{selectedOrder.shipping_address.fullName}</p>
                                            <p className="text-muted-foreground">{selectedOrder.shipping_address.street}</p>
                                            <p className="text-muted-foreground">
                                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.zipCode}
                                            </p>
                                            <p className="text-muted-foreground text-xs mt-2">Phone: {selectedOrder.shipping_address.phone}</p>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground">Address details not available</p>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                    <CreditCard className="h-4 w-4" /> Payment Summary
                                </h4>
                                <div className="bg-muted/40 rounded-md p-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${Number(selectedOrder.total_amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                                        <span>Total Paid</span>
                                        <span>${Number(selectedOrder.total_amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </Layout>
  );
}