import { Link } from 'react-router-dom';
import { Package, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: Package,
    title: 'Bulk Discounts',
    description: 'Up to 40% off on bulk orders',
  },
  {
    icon: TrendingUp,
    title: 'Exclusive Pricing',
    description: 'Special rates for wholesalers',
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: 'Dedicated account manager',
  },
];

export function WholesaleBanner() {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                For Business
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
                Wholesale Partnership
              </h2>
            </div>
            
            <p className="text-background/70 text-lg max-w-md">
              Join our wholesale program and get access to exclusive pricing, bulk discounts, and priority support for your business.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-background">{benefit.title}</h4>
                    <p className="text-background/60 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/wholesale">
              <Button variant="premium" className='mt-4' size="xl">
                Become a Partner
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-12 flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-8xl font-bold text-primary">40%</p>
                <p className="text-2xl font-semibold text-background mt-2">Off on Bulk Orders</p>
                <p className="text-background/60 mt-2">Minimum 10 pairs per style</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


