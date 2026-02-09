import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useProduct } from '@/hooks/useProducts'; 
import { useWishlist } from '@/context/WishlistContext';


export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  
  
  const { data: product, isLoading, isError } = useProduct(id || '');

    // const inWishlist = isInWishlist(product.id);
     const inWishlist = isInWishlist(product?.id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // --- ERROR / NOT FOUND STATE ---
  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // --- DATA NORMALIZATION (Backend -> Frontend Mapping) ---
  const imageUrl = product.image_url || 'https://placehold.co/600';
  const productImages = product.images && product.images.length > 0 ? product.images : [imageUrl];
  
  // Convert Strings/Nulls to Numbers safely
  const price = Number(product.price);
  const wholesalePrice = Number(product.wholesale_price || product.wholesalePrice || 0);
  const bulkThreshold = Number(product.bulk_threshold || product.bulkThreshold || 0);
  const salePercent = Number(product.sale_percent || product.salePercent || 0);
  const stock = Number(product.stock || 0);
  
  const isSale = product.is_sale || product.isSale;
  const isNew = product.is_new || product.isNew;

  // Logic
  const isWholesaleQty = bulkThreshold > 0 && quantity >= bulkThreshold;
  const currentPrice = isWholesaleQty ? wholesalePrice : price;
  
  const displayPrice = isSale && !isWholesaleQty
    ? price * (1 - salePercent / 100)
    : currentPrice;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor && product.colors?.length > 0) {
      toast({ title: "Please select a color", variant: "destructive" });
      return;
    }

    const cartItem = {
        ...product,
        price: price, // Base price for cart logic
        image: imageUrl 
    };

    addToCart(cartItem, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };
   const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id); 
    }
  };


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
              <img
                 src={productImages[selectedImageIndex]}
                 alt={product.name}
                 className="w-full h-full object-cover transition-all duration-300"
                 onError={(e) => (e.currentTarget.src = 'https://placehold.co/600?text=Image+Error')}
              />
             {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isNew && <Badge className="bg-blue-600 hover:bg-blue-700">New Arrival</Badge>}
                {isSale && <Badge variant="destructive">-{salePercent}% Off</Badge>}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-foreground"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=No+Image')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Product Info */}
          <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {product.category}
                </p>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {product.gender === 'unisex' ? 'Unisex' : `${product.gender}'s`}
                </p>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-foreground">
                  ₹{displayPrice.toFixed(2)}
                </span>
                {isSale && !isWholesaleQty && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Wholesale Logic Display */}
              {wholesalePrice > 0 && bulkThreshold > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-primary text-primary">Wholesale</Badge>
                    <span className="text-sm text-muted-foreground">
                      ₹{wholesalePrice.toFixed(2)}/pair when ordering {bulkThreshold}+ pairs
                    </span>
                  </div>
              )}

              {isWholesaleQty && (
                <p className="text-sm text-green-600 font-medium animate-pulse">
                  ✅ Wholesale pricing applied!
                </p>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                <h3 className="font-semibold text-foreground mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: any) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(Number(size))}
                        className={cn(
                        "w-12 h-12 rounded-lg border-2 font-medium transition-all flex items-center justify-center",
                        selectedSize === Number(size)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-foreground text-foreground"
                        )}
                    >
                        {size}
                    </button>
                    ))}
                </div>
                </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
                <div>
                <h3 className="font-semibold text-foreground mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                        "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                        selectedColor === color
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-foreground text-foreground"
                        )}
                    >
                        {color}
                    </button>
                    ))}
                </div>
                </div>
            )}

            {/* Quantity & Stock */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= stock}
                    className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className={cn("text-sm font-medium", stock < 10 ? "text-amber-600" : "text-muted-foreground")}>
                  {stock > 0 ? `${stock} pairs available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleAddToCart} 
                disabled={stock === 0}
                className="flex-1 h-14 text-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full shadow-medium transition-all",
                inWishlist 
                  ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600" 
                  : " bg-white/80 hover:bg-white text-gray-700" 
              )}
              onClick={handleWishlistClick}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">30 Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}