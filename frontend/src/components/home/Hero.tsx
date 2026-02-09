import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/product-slides.jpg';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                New Collection 2025
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Step Into
              <br />
              <span className="text-primary">Style</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Discover premium footwear crafted for comfort and designed for those who dare to stand out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/wholesale">
                {/* <Button variant="heroOutline" size="xl">
                  Wholesale Inquiry
                </Button> */}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start pt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-foreground">200+</p>
                <p className="text-sm text-muted-foreground">Product Styles</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img
                src={heroImage}
                alt="Featured sneaker"
                className="relative w-[450px] h-[350px]  max-w-lg mx-auto animate-float rounded-3xl shadow-strong"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-8 bg-card rounded-2xl shadow-medium p-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-primary font-bold">4.9</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Top Rated</p>
                  <p className="text-sm text-muted-foreground">12K+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
