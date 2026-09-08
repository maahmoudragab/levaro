/**
 * Storefront Type Definitions for LÉVARO
 * Centralized interfaces for departments, collections, curated editions, and navigation.
 */

export interface DepartmentChapter {
  id: string;
  number: string;
  phase: string;
  title: string;
  tagline: string;
  edition: string;
  narrative: string;
  materialSpec: string;
  silhouette: string;
  href: string;
  image: string;
}

export interface FeaturedCollection {
  id: string;
  number: string;
  season: string;
  title: string;
  subtitle: string;
  href: string;
  imagePrimary: string;
  narrative?: string;
  materialFocus?: string;
}

export interface CuratedProduct {
  id: string;
  code: string;
  discipline: string;
  name: string;
  material: string;
  price: string;
  image: string;
  href: string;
  whatsappMessage?: string;
}

export interface MenuSubLink {
  code?: string;
  label: string;
  href: string;
  isAction?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  number: string;
  category: string;
  season: string;
  narrative?: string;
  specs?: { label: string; value: string }[];
  sublinks?: MenuSubLink[];
}

export interface ManifestoItem {
  text: string;
  highlight: boolean;
}

export interface SectionAction {
  label: string;
  href: string;
}

export interface SectionHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  theme?: "light" | "dark";
  action?: SectionAction;
  className?: string;
}

export interface SectionFooterNext {
  label: string;
  href: string;
}

export interface SectionFooterProps {
  theme?: "light" | "dark";
  nextSection?: SectionFooterNext;
  action?: SectionAction;
  showBackToTop?: boolean;
  className?: string;
}

export type DepartmentKey = "all" | "men" | "women" | "accessories" | (string & {});
export type CategoryKey = "all" | "outerwear" | "tailoring" | "trousers" | "tops" | "objects" | (string & {});
export type CollectionKey = "all" | "motion" | "shift" | (string & {});
export type SortOption = "curated" | "price-asc" | "price-desc" | "code";

export interface ProductItem {
  id: string;
  slug: string;
  code: string;
  name: string;
  department: "men" | "women" | "accessories" | (string & {});
  category: "outerwear" | "tailoring" | "trousers" | "tops" | "objects" | (string & {});
  collection?: "motion" | "shift" | (string & {});
  material: string;
  silhouette: string;
  price: number;
  priceFormatted: string;
  sale_price?: number | null;
  salePriceFormatted?: string | null;
  images: string[];
  sizes: string[];
  colors?: string[];
  description: string;
  short_description?: string | null;
  brand?: string | null;
  gender?: string | null;
  sku?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  fit?: string | null;
  country_of_origin?: string | null;
  tags?: string[] | null;
  product_type?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  category_parent_id?: string | null;
  category_parent_slug?: string | null;
  category_parent_name?: string | null;
  color?: string | null;
  stock?: { size: string; stock: number }[] | Record<string, number> | null;
  whatsappMessage?: string;
  relatedProductIds?: string[];
}
