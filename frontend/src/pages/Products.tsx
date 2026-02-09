import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePublicProducts } from '@/hooks/useProducts';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState('newest');
  const [isGridLarge, setIsGridLarge] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. FETCH REAL DATA ---
  const { data: apiProducts, isLoading } = usePublicProducts();

  // --- 2. DYNAMIC CATEGORY EXTRACTION ---
  const dynamicCategories = useMemo(() => {
    if (!apiProducts || !Array.isArray(apiProducts)) return [];

    // Extract all category strings
    const allCategories = apiProducts.map((p: any) => p.category);
    // Remove duplicates
    const uniqueCategories = Array.from(new Set(allCategories));

    // Format for display
    return uniqueCategories.map((cat: string) => ({
      slug: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
  }, [apiProducts]);

  // --- 3. FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    if (!apiProducts) return [];

    let filtered = [...apiProducts];
    
    // Filter by Category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p: any) => p.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [categoryFilter, sortBy, apiProducts]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const currentCategoryName = useMemo(() => {
    if (categoryFilter === 'all') return 'All Products';
    const found = dynamicCategories.find(c => c.slug === categoryFilter);
    return found ? found.name : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
  }, [categoryFilter, dynamicCategories]);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            {currentCategoryName}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse our complete collection of premium footwear
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
             
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={isGridLarge ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridLarge(true)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={!isGridLarge ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridLarge(false)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={cn(
              "w-64 shrink-0 space-y-6 transition-all duration-300",
              showFilters ? "block" : "hidden md:block"
            )}>
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors text-sm",
                      categoryFilter === 'all' 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    All Products
                  </button>
                  
                  {dynamicCategories.map(category => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg transition-colors text-sm",
                        categoryFilter === category.slug 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className={cn(
                    "grid gap-6",
                    isGridLarge 
                      ? "sm:grid-cols-2 lg:grid-cols-3" 
                      : "sm:grid-cols-2 lg:grid-cols-4"
                  )}>
                    {filteredProducts.map((product: any, index: number) => (
                      <div
                        key={product.id}
                        className="animate-fade-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground">No products found in this category.</p>
                      <Button variant="link" onClick={() => handleCategoryChange('all')}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}