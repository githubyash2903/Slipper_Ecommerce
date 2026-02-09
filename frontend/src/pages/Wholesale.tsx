import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Package } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const benefits = [
  {
    icon: Package,
    title: 'Bulk Pricing',
    description: 'Up to 40% off on orders of 10+ pairs',
  },
  {
    icon: Building2,
    title: 'Dedicated Support',
    description: 'Personal account manager for your business',
  },
  {
    icon: MapPin,
    title: 'Fast Shipping',
    description: 'Priority shipping for all wholesale orders',
  },
];

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application submitted!",
      description: "We'll review your application and contact you within 2 business days.",
    });
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      message: '',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            For Business
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
            Wholesale Partnership
          </h1>
          <p className="text-background/70 text-lg max-w-2xl mx-auto">
            Partner with FootWear to bring premium footwear to your customers. 
            Enjoy exclusive pricing, priority support, and flexible ordering.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-card shadow-soft">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Apply for Wholesale Access
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and our team will contact you within 2 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="pl-12 h-12 rounded-xl"
                    required
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Contact Person Name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12 h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-12 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Business Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-12 h-12 rounded-xl"
                  required
                />
              </div>

              <Textarea
                placeholder="Tell us about your business and expected order volumes..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[120px] rounded-xl resize-none"
                required
              />

              <Button type="submit" variant="hero" size="xl" className="w-full">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
