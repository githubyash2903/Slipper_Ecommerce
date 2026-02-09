import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext'; 
import { useToast } from '@/hooks/use-toast';    

interface ProductCardProps {
  product: any;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // 1. Context Hooks
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // 2. State Check
  const inWishlist = isInWishlist(product.id);

  // 3. Data Normalization
  const imageUrl = product.image_url || product.image || 'https://placehold.co/400';
  const price = Number(product.price);
  const salePercent = Number(product.salePercent || product.sale_percent || 0);
  const isSale = product.isSale || product.is_sale; // Boolean check
  const wholesalePrice = Number(product.wholesalePrice || product.wholesale_price || 0);
  const stock = Number(product.stock || 0);

  const displayPrice = isSale 
    ? price * (1 - salePercent / 100)
    : price;


  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id); 
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    const navigate = useNavigate();
    e.preventDefault();
    e.stopPropagation();

   
    navigate(`/products/${product.id}`)
  
  };

  return (
    <div className={cn("group relative", className)}>
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary mb-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/400?text=No+Image')}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="secondary" className="bg-blue-600 text-white border-none">New</Badge>}
            {isSale && <Badge variant="destructive">-{salePercent}%</Badge>}
            
            {/* Stock Badge */}
            {stock > 0 && stock < 10 && (
                 <Badge variant="outline" className="bg-white/90 text-amber-600 border-amber-600">
                    Only {stock} left
                 </Badge>
            )}
            {stock === 0 && (
                 <Badge variant="secondary" className="bg-gray-800 text-white">
                    Out of Stock
                 </Badge>
            )}
          </div>

          {/* Wishlist Button (Top Right) */}
          <div className="absolute top-3 right-3">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "rounded-full shadow-medium transition-all",
                inWishlist 
                  ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600" // Active State
                  : "opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700" // Inactive State
              )}
              onClick={handleWishlistClick}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>

          {/* Quick Add Button (Bottom Overlay) */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button 
              className="w-full text-sm py-3 h-auto shadow-lg" 
              disabled={stock === 0}
              onClick={handleAddToCart} 
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.gender} • {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">
            ₹{displayPrice.toFixed(2)} 
          </span>
          {isSale && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{price.toFixed(2)}
            </span>
          )}
        </div>
        
        {wholesalePrice > 0 && (
            <p className="text-xs text-muted-foreground">
            Wholesale from ${wholesalePrice.toFixed(2)}
            </p>
        )}
      </div>
    </div>
  );
}