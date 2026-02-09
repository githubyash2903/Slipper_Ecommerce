import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Truck, ShieldCheck, X, Loader2, MapPin } from 'lucide-react';

import { placeOrderAPI, verifyPaymentAPI, createRazorpayOrderAPI } from '@/api/order'; 
import { fetchProfile, fetchAddresses } from '@/api/user'; 

declare var Razorpay: any;

export default function Checkout() {
  const { items, subtotal, removeFromCart, clearCart } = useCart(); 
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Calculations
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutofill = async () => {
    try {
      setIsAutofilling(true);
      const [profile, addresses] = await Promise.all([fetchProfile(), fetchAddresses()]);
      const userData = profile?.data || profile; 
      const addressList = addresses?.data || addresses;

      let selectedAddr = null;
      if (Array.isArray(addressList) && addressList.length > 0) {
        selectedAddr = addressList.find((addr: any) => addr.is_default) || addressList[0];
      }

      const fullName = userData?.name || '';
      const [fName, ...lNameParts] = fullName.split(' ');

      setFormData((prev) => ({
        ...prev,
        email: userData?.email || prev.email,
        phone: userData?.phone_number || prev.phone,
        firstName: fName || '',
        lastName: lNameParts.join(' ') || '',
        address: selectedAddr?.street || prev.address,
        city: selectedAddr?.city || prev.city,
        state: selectedAddr?.state || prev.state,
        zipCode: selectedAddr?.zip_code || prev.zipCode,
      }));
    } catch (error) {
      console.error("Autofill Error:", error);
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend 
      const orderData = await createRazorpayOrderAPI({ 
        amount: total, 
        currency: 'INR' 
      });

      const razorpayOrderId = orderData.order ? orderData.order.id : orderData.id;

      if (!razorpayOrderId) {
          throw new Error("Failed to get Order ID from backend");
      }


      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: Math.round(total * 100), 
        currency: "INR",
        name: "Footwear Store",
        description: `Order for ${formData.firstName}`,
        order_id: razorpayOrderId, 
        
        handler: async function (response: any) {

          try {
            // --- STEP 3: Verify Payment  ---
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            
            const verifyRes = await verifyPaymentAPI(verificationPayload);

            if (verifyRes.success) {
              //  PLACE FINAL ORDER IN DB ---
              
              const finalOrderPayload = {
                items: items, 
                totalAmount: total,
                paymentMethod: "Online", 
                
                paymentInfo: {
                    orderId: response.razorpay_order_id, 
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    status: 'paid',
                    taxes: tax,
                    total_amount : total,
                },

                shippingAddress: {
                  fullName: `${formData.firstName} ${formData.lastName}`,
                  street: formData.address,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                  phone: formData.phone,
                  email: formData.email
                }
              };


              await placeOrderAPI(finalOrderPayload);

              clearCart();
              toast({ title: 'Order Placed!', description: `Order #${razorpayOrderId} confirmed.` });
              navigate('/profile'); 
            }

          } catch (err) {
            console.error("Verification/Placement Error:", err);
            toast({ title: 'Order Failed', description: 'Payment successful but order placement failed.', variant: 'destructive' });
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#000000" }, 
      };

      const rzp = new Razorpay(options);
      
      // Handle Payment Failures
      rzp.on('payment.failed', function (response: any){
        toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
      });

      rzp.open();

    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Checkout Failed',
        description: 'Could not initialize payment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Button type="button" onClick={handleAutofill} variant="outline" className="gap-2" disabled={isAutofilling}>
            {isAutofilling ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            Use Saved Address
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <Card>
                <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label htmlFor="email">Email Address</Label><Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Shipping Address</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} /></div>
                  <div className="md:col-span-2"><Label htmlFor="address">Street Address</Label><Input id="address" name="address" required value={formData.address} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="city">City</Label><Input id="city" name="city" required value={formData.city} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="state">State</Label><Input id="state" name="state" required value={formData.state} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="zipCode">ZIP Code</Label><Input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} /></div>
                </CardContent>
              </Card>

              <div className="p-4 bg-secondary/20 rounded-lg flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">You will be redirected to Razorpay to securely complete your payment via UPI, Card, or Netbanking.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-secondary/30">
                        <img src={item.product.image} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} | {item.size}</p>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                  </div>
                  <Button type="submit" className="w-full mt-4" size="lg" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pay Now ₹${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}