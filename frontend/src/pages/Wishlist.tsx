import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext'; // ✅ Hamara naya Context

export default function Wishlist() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist(); // Context se data liya
  const { addToCart } = useCart();
  const navigate = useNavigate();


  const handleAddToCart = (product: any) => {
    // Backend se sizes array agar nahi aaya to safe check
    // const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    // const color = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    
    // addToCart(product, 1, size, color);
    const productId = product.id;
    removeFromWishlist(productId)
       navigate(`/products/${productId}`)


  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by clicking the heart icon on products.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product: any) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img
                    // Backend se 'image_url' aata hai, lekin agar 'image' key ho to wo bhi chalega
                    src={product.image_url || product.image || 'https://placehold.co/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize mb-3">{product.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => removeFromWishlist(product.id)}
                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        className="h-9 w-9"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}