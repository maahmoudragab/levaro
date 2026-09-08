/**
 * Centralized Type Definitions for LÉVARO Admin Dashboard & Domain Models.
 */

export type StockItem = {
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  short_description: string | null;
  brand: string | null;
  material: string | null;
  gender: string | null;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  fit: string | null;
  country_of_origin: string | null;
  tags: string[] | null;
  product_type: string | null;
  category_id: string | null;
  color: string | null;
  stock: StockItem[] | null;
  image: string | null;
  images?: string[];
  category_name: string | null;
  category_slug?: string | null;
  category_parent_id?: string | null;
  created_at: string;
  updated_at: string | null;
};

export type CreateProductInput = Partial<Product> & {
  name: string;
  slug: string;
  price: number;
  tags?: string[] | string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  product_count?: number;
  total_stock?: number;
  collections?: CategoryItem[];
};

export type CategoryHierarchy = CategoryItem & {
  collections: CategoryItem[];
};

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  parent_id?: string | null;
  description?: string | null;
  image?: string | null;
  is_active?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
