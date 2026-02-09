import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'Casual Wear',
    name: 'Casual Wear',
    slug: 'Casual Wear',
    description: 'Street style & performance',
    image: 'https://images.meesho.com/images/products/461881412/zlelt_512.avif?width=512'
  },
  {
    id: 'formal',
    name: 'Formal',
    slug: 'formal',
    description: 'Elevate your professional look',
    image: 'https://egoss.in/cdn/shop/products/DSC_7105.jpg?v=1753878910&width=2000'
  },
  {
    id: 'Flip-Flops',
    name: 'Flip-Flops',
    slug: 'Flip-Flops',
    description: 'Comfort for your downtime',
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/8/v1WGwu5n_67de2b56c37a4149afa4fd380be38fb3.jpg'
  },
  {
    id: 'Sandal Slippers',
    name: 'Sandal Slippers',
    slug: 'Sandal Slippers', 
    description: 'Rugged durability for any terrain',
    image: 'https://m.media-amazon.com/images/I/71BgT0PmeSL._SY695_.jpg'
  }
];

export function Categories() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find the perfect pair for every occasion
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-background mb-1">
                      {category.name}
                    </h3>
                    <p className="text-background/70 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary">
                    <ArrowUpRight className="h-5 w-5 text-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}