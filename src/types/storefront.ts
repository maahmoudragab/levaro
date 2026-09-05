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
  whatsappMessage: string;
}

export interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  number: string;
  category: string;
  season: string;
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
