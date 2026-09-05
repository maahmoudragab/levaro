import type {
  DepartmentChapter,
  FeaturedCollection,
  CuratedProduct,
  MenuItem,
  ManifestoItem,
} from "@/types/storefront";

/* =========================================================================
   1. DEPARTMENTS
   ========================================================================= */
export const DEPARTMENTS: DepartmentChapter[] = [
  {
    id: "men",
    number: "01",
    phase: "01 // MEN",
    title: "MEN",
    tagline: "Tailored outerwear, raw selvedge & relaxed forms.",
    edition: "18 EDITIONS",
    narrative: "Everyday jackets, raw selvedge denim, and easy oversized tailoring made for movement.",
    materialSpec: "RAW SELVEDGE & DENIM",
    silhouette: "OVERSIZED BOXY FIT",
    href: "/shop?department=men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop",
  },
  {
    id: "women",
    number: "02",
    phase: "02 // WOMEN",
    title: "WOMEN",
    tagline: "Structured silhouettes, clean drape & modern essentials.",
    edition: "24 EDITIONS",
    narrative: "Structured silhouettes, clean drape, and modern essentials designed to wear your own way.",
    materialSpec: "SCULPTED WOOL & POPLIN",
    silhouette: "RELAXED TAILORING",
    href: "/shop?department=women",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1400&auto=format&fit=crop",
  },
  {
    id: "accessories",
    number: "03",
    phase: "03 // ACCESSORIES",
    title: "ACCESSORIES",
    tagline: "Everyday acetate eyewear, leather goods & objects.",
    edition: "12 EDITIONS",
    narrative: "Everyday acetate eyewear, leather goods, and minimal objects to complete your look.",
    materialSpec: "CUSTOM ACETATE & LEATHER",
    silhouette: "MINIMAL OBJECTS",
    href: "/shop?department=accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=1400&auto=format&fit=crop",
  },
];

/* =========================================================================
   2. FEATURED COLLECTIONS
   ========================================================================= */
export const FEATURED_COLLECTIONS: FeaturedCollection[] = [
  {
    id: "motion",
    number: "01",
    season: "AUTUMN / WINTER 2026",
    title: "MOTION",
    subtitle: "RAW DENIM & CITY TAILORING",
    href: "/collections/motion",
    imagePrimary: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1400&auto=format&fit=crop",
  },
  {
    id: "shift",
    number: "02",
    season: "WINTER 2026",
    title: "SHIFT",
    subtitle: "VIRGIN WOOL & FLUID LAYERS",
    href: "/collections/shift",
    imagePrimary: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=85&w=1400&auto=format&fit=crop",
  },
];

/* =========================================================================
   3. CURATED EDITIONS
   ========================================================================= */
export const CURATED_EDITIONS: CuratedProduct[] = [
  {
    id: "01",
    code: "EDITION 01",
    discipline: "OUTERWEAR",
    name: "RAW SELVEDGE TRUCKER",
    material: "14.5 OZ JAPANESE DENIM",
    price: "EGP 4,800",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1000&auto=format&fit=crop",
    href: "/shop?edition=01",
    whatsappMessage: "Hello LÉVARO, I am inquiring about the Raw Selvedge Trucker Jacket (Edition 01).",
  },
  {
    id: "02",
    code: "EDITION 02",
    discipline: "TAILORING",
    name: "MONOLITH WOOL COAT",
    material: "100% SCULPTED VIRGIN WOOL",
    price: "EGP 7,600",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=85&w=1000&auto=format&fit=crop",
    href: "/shop?edition=02",
    whatsappMessage: "Hello LÉVARO, I am inquiring about the Monolith Wool Coat (Edition 02).",
  },
  {
    id: "03",
    code: "EDITION 03",
    discipline: "ESSENTIALS",
    name: "FLUID PLEATED TROUSER",
    material: "HEAVYWEIGHT DRAPED POPLIN",
    price: "EGP 3,900",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1000&auto=format&fit=crop",
    href: "/shop?edition=03",
    whatsappMessage: "Hello LÉVARO, I am inquiring about the Fluid Pleated Trouser (Edition 03).",
  },
  {
    id: "04",
    code: "EDITION 04",
    discipline: "OBJECTS",
    name: "SCULPTED ACETATE SHADE",
    material: "CUSTOM HAND-CUT ACETATE",
    price: "EGP 3,200",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=1000&auto=format&fit=crop",
    href: "/shop?edition=04",
    whatsappMessage: "Hello LÉVARO, I am inquiring about the Sculpted Acetate Shades (Edition 04).",
  },
];

/* =========================================================================
   4. NAVIGATION
   ========================================================================= */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: "departments",
    label: "DEPARTMENTS",
    subtitle: "MEN / WOMEN / ACCESSORIES",
    href: "/#departments",
    number: "01",
    category: "CORE DIVISION",
    season: "ALL SEASONS",
  },
  {
    id: "collections",
    label: "COLLECTIONS",
    subtitle: "MOTION & SHIFT EDITIONS",
    href: "/#collections",
    number: "02",
    category: "CAPSULE ARCHIVE",
    season: "WINTER '26",
  },
  {
    id: "about",
    label: "THE HOUSE",
    subtitle: "MANIFESTO & ATELIER PHILOSOPHY",
    href: "/about",
    number: "03",
    category: "MANIFESTO",
    season: "FOUNDATION",
  },
  {
    id: "editions",
    label: "CURATED PIECES",
    subtitle: "SELECTED SEASONAL RELEASES",
    href: "/#editions",
    number: "04",
    category: "ATELIER ARCHIVE",
    season: "AUTUMN '26",
  },
  {
    id: "shop",
    label: "ONLINE ARCHIVE",
    subtitle: "EXPLORE ALL EDITIONS & OBJECTS",
    href: "/shop",
    number: "05",
    category: "STOREFRONT",
    season: "ALL RELEASES",
  },
];

/* =========================================================================
   5. MANIFESTO
   ========================================================================= */
export const MANIFESTO_ITEMS: ManifestoItem[] = [
  { text: "WE DO NOT DESIGN FOR REPOSE", highlight: false },
  { text: "WE DESIGN FOR THE BODY IN TRANSIT", highlight: true },
  { text: "THE ARCHITECTURE OF MOVEMENT", highlight: false },
  { text: "FORM FOLLOWS KINETICS", highlight: true },
  { text: "LÉVARO ATELIER", highlight: false },
  { text: "VOLUMES IN MOTION", highlight: true },
];
