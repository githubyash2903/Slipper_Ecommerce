import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import dmvLogo from '../../assets/DMV-logo.png';
import companyLogoFooter from '../../assets/company-logo-footer.png';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
          <Link to="/" className="">
 <img 
    src={companyLogoFooter} 
    alt="Pehno Ji Logo" 
    className="h-[80px] ml-16 w-auto object-contain" 
  />
</Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Premium footwear for every step of your journey. Quality craftsmanship meets modern design.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/products" className="text-background/70 hover:text-primary transition-colors text-sm">
                All Products
              </Link>
              <Link to="/products?category=slippers" className="text-background/70 hover:text-primary transition-colors text-sm">
                Slippers
              </Link>
              <Link to="/products?category=flip-flops" className="text-background/70 hover:text-primary transition-colors text-sm">
                Flip Flops
              </Link>
             
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Service</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-background/70 hover:text-primary transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/shipping" className="text-background/70 hover:text-primary transition-colors text-sm">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-background/70 hover:text-primary transition-colors text-sm">
                Returns & Exchanges
              </Link>
              <Link to="/faq" className="text-background/70 hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@footwear.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Fashion Street<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} FootWear. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-16">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}