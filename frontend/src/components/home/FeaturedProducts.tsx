import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { usePublicProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const { data: products, isLoading } = usePublicProducts();


  const featured = (products || [])
    .filter((p: any) => p.is_new || p.is_sale || p.isNew || p.isSale)
    .slice(0, 4);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-md">
              Discover our handpicked selection of trending styles and best sellers
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
             <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.length > 0 ? (
              featured.map((products: any, index: number) => (
                <div
                  key={products.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={products} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No featured products found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}