import { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
// Keep categories for filter buttons
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid2X2, Grid3X3, Loader2 } from 'lucide-react';
import { usePublicProducts } from '@/hooks/useProducts';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest' },
];

export default function WomenProducts() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('featured');
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(3);

  const { data: apiProducts, isLoading } = usePublicProducts();

  const filteredProducts = useMemo(() => {
    if (!apiProducts || !Array.isArray(apiProducts)) return [];

    let result = apiProducts.filter((p: any) => p.gender === 'women' || p.gender === 'unisex');
    
    // Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter((p: any) => p.category === categoryFilter);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a: any, b: any) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a: any, b: any) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [categoryFilter, sortBy, apiProducts]);

  return (
    <Layout>
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Women's Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elegant and stylish footwear for every occasion. Comfort meets fashion.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.slug}
                variant={categoryFilter === cat.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={gridSize === 2 ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setGridSize(2)}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === 3 ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setGridSize(3)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid with Loading State */}
        {isLoading ? (
             <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
             </div>
        ) : (
            <>
                <div className={`grid gap-6 ${
                  gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                  gridSize === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No women's products found in this category.</p>
                    <Button variant="link" onClick={() => setCategoryFilter('all')}>
                        Clear Filters
                    </Button>
                  </div>
                )}
            </>
        )}
      </div>
    </Layout>
  );
}