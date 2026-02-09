import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
// ✅ Import the hook to get real data
import { usePublicProducts } from '@/hooks/useProducts';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // 1. Fetch Real Products from Database
  const { data: apiProducts = [], isLoading } = usePublicProducts();

  // 2. Filter Logic (Dynamic)
  const results = useMemo(() => {
    if (!query || query.trim() === '') return [];
    
    // Safety check
    if (!Array.isArray(apiProducts)) return [];

    const lowerQuery = query.toLowerCase();

    return apiProducts.filter((product: any) => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    );
  }, [query, apiProducts]);

  const handleSelect = (productId: string) => {
    // This will now use the REAL UUID from the database
    navigate(`/products/${productId}`);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            className="border-0 focus-visible:ring-0 text-lg py-6 shadow-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-secondary rounded-full">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
             <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
               <Loader2 className="h-8 w-8 animate-spin mb-2" />
               <p>Loading products...</p>
             </div>
          ) : query.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Start typing to search products...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No products found for "{query}"</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((product: any, index: number) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors text-left",
                    index === 0 && "bg-secondary/50"
                  )}
                >
                  <img
                    src={product.image || product.image_url} // Handle both naming conventions
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                  </div>
                  <p className="font-semibold text-primary">₹{product.price}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}