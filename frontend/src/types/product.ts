export type ProductCategory = 'slippers' | 'casual wear' | 'flip-flops' | 'sandals slippers';
export type Gender = 'men' | 'women' | 'kids' | 'unisex';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gender: Gender; 
  price: number;
  wholesalePrice: number;
  bulkThreshold: number;
  stock: number;
  image: string;
  images: string[];
  description: string;
  sizes: number[];
  colors: string[];
  isNew?: boolean;
  isSale?: boolean;
  salePercent?: number;
}

export interface CartItem {
  id: string; // 
  product: Product;
  quantity: number;
  size: number;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}