import type { Metadata } from "next";
import type { ProductItem } from "@/types/storefront";

const resolveSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim()) {
    const raw = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return raw.startsWith("http") ? raw.replace(/\/+$/, "") : `https://${raw.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }
  return "https://levaro.store";
};

export const SITE_URL = resolveSiteUrl();

export const siteConfig = {
  name: "LÉVARO",
  shortName: "LÉVARO",
  legalName: "LÉVARO Atelier",
  arabicName: "ليفارو",
  founder: "Mahmoud Ragab",
  founderArabic: "محمود رجب",
  founderRole: "Founder & Creative Director",
  founderBio: "Founded in Cairo by Mahmoud Ragab, LÉVARO is a contemporary luxury fashion house exploring form, architectural silhouettes, and heavyweight material discipline.",
  telephone: "+201158480351",
  phoneDisplay: "01158480351",
  email: "maaahmoudragab@gmail.com",
  socialLinks: {
    github: "https://github.com/maahmoudragab",
    linkedin: "https://www.linkedin.com/in/maahmoudragab/",
    facebook: "https://www.facebook.com/share/1BnB3opvXz/",
    instagram: "https://www.instagram.com/maahmoudragab",
  },
  alternateNames: [
    "ليفارو",
    "ليڤارو",
    "Levaro",
    "Lévaro",
    "Lévaro Egypt",
    "براند ليفارو",
    "ماركة ليفارو",
    "متجر ليفارو",
    "دار ليفارو للأزياء",
    "تيشرتات ليفارو",
    "ملابس ليفارو",
    "شوب ليفارو",
  ],
  title: "LÉVARO — Contemporary Luxury Fashion Atelier",
  description:
    "LÉVARO — Contemporary Egyptian luxury fashion house and ready-to-wear atelier. Architectural oversized silhouettes, elevated tailoring, and raw denim crafted with material precision. Express delivery across Egypt.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/images/og-levaro.jpg`,
  country: "Egypt",
  city: "Cairo",
  currency: "EGP",
  keywords: [
    // Brand Specific Keywords (Arabic) — Ensuring Arabic search queries rank #1
    "ليفارو",
    "ليڤارو",
    "براند ليفارو",
    "ماركة ليفارو",
    "متجر ليفارو",
    "موقع ليفارو",
    "شوب ليفارو",
    "دار ليفارو",
    "دار ليفارو للأزياء",
    "ليفارو مصر",
    // Products Specific Keywords (Arabic)
    "تيشرتات ليفارو",
    "تيشيرت ليفارو",
    "تيشرتات اوفر سايز ليفارو",
    "هدوم ليفارو",
    "ملابس ليفارو",
    "بناطيل ليفارو",
    "جواكت ليفارو",
    "سويت شيرت ليفارو",
    "هوديز ليفارو",
    "كولكشن ليفارو",
    // Egyptian Market & Luxury Keywords (Arabic)
    "براندات ملابس مصرية فاخرة",
    "ماركات ملابس مصرية",
    "ملابس رجالي فاخرة مصر",
    "ملابس شبابي راقية",
    "أزياء كاجوال وفورمال راقية",
    "تصميم أزياء القاهرة",
    "ملابس مينيمال مصر",
    "تسوق أزياء أونلاين مصر",
    // Brand Specific Keywords (English)
    "LEVARO",
    "Lévaro",
    "Levaro",
    "Levaro Egypt",
    "Levaro fashion",
    "Levaro brand",
    "Levaro store",
    "Levaro shop",
    "Levaro official",
    // Products Specific Keywords (English)
    "Levaro t-shirts",
    "Levaro tees",
    "Levaro oversized t-shirts",
    "Levaro jackets",
    "Levaro hoodies",
    "Levaro trousers",
    "Levaro denim",
    "Levaro collection",
    // Market & Styling Keywords (English)
    "luxury streetwear egypt",
    "egyptian luxury fashion brand",
    "quiet luxury cairo",
    "architectural tailoring",
    "raw selvedge denim egypt",
    "minimal luxury clothing cairo",
    "contemporary ready-to-wear egypt",
    "menswear fashion egypt",
    // Founder
    "Mahmoud Ragab",
    "محمود رجب",
  ],
};

/* -------------------------------------------------------------------------- */
/* Dynamic Product SEO Metadata Generator                                     */
/* -------------------------------------------------------------------------- */

function toAbsoluteUrl(url?: string | null): string {
  if (!url) return `${SITE_URL}/images/og-levaro.jpg`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function generateProductSeoMetadata(product: ProductItem): Metadata {
  const cleanTitle = `${product.name.toUpperCase()} — LÉVARO`;

  const userProductDesc = (product.short_description || product.description || "").trim();
  const englishDescription = userProductDesc
    ? `${userProductDesc} — Official LÉVARO Atelier edition. Express delivery across Egypt.`.slice(0, 280)
    : `Shop the ${product.name} (${product.code}) by LÉVARO. Crafted from ${product.material} with a signature ${product.fit} silhouette. Express delivery across Egypt.`.slice(0, 280);

  const productImages = (product.images || []).filter(Boolean);
  const primaryImageUrl = toAbsoluteUrl(productImages[0] || siteConfig.ogImage);
  const productUrl = `${SITE_URL}/shop/${product.slug}`;

  const ogImages =
    productImages.length > 0
      ? productImages.slice(0, 4).map((img, idx) => ({
          url: toAbsoluteUrl(img),
          secureUrl: toAbsoluteUrl(img),
          width: 1200,
          height: 1600,
          alt: `${product.name} — LÉVARO Edition ${idx + 1}`,
        }))
      : [
          {
            url: `${SITE_URL}/images/og-levaro.jpg`,
            secureUrl: `${SITE_URL}/images/og-levaro.jpg`,
            width: 1200,
            height: 630,
            alt: `${product.name} — LÉVARO`,
            type: "image/jpeg",
          },
        ];

  return {
    title: cleanTitle,
    description: englishDescription,
    keywords: [
      // Product Names in both English and Arabic for high ranking
      product.name,
      `${product.name} ليفارو`,
      "تيشرتات ليفارو",
      "ملابس ليفارو",
      "براند ليفارو",
      "دار ليفارو",
      "ليفارو",
      product.code,
      product.category,
      product.department,
      "LÉVARO",
      "Lévaro",
      "Levaro",
      "Levaro Egypt",
      "Levaro t-shirts",
      ...(product.tags || []),
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: englishDescription,
      url: productUrl,
      siteName: "LÉVARO",
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: englishDescription,
      images: [primaryImageUrl],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Dynamic Category SEO Metadata Generator                                    */
/* -------------------------------------------------------------------------- */

export function generateCategorySeoMetadata(category: {
  slug: string;
  name: string;
  arabicName?: string;
  description?: string;
  image?: string;
}): Metadata {
  const cleanTitle = `${category.name.toUpperCase()} — LÉVARO`;
  const categoryUrl = `${SITE_URL}/shop/${category.slug}`;
  const userCatDesc = (category.description || "").trim();
  const englishDescription = userCatDesc
    ? `${userCatDesc} — Official LÉVARO collection. Express delivery across Egypt.`.slice(0, 280)
    : `Discover the ${category.name} collection by LÉVARO. Architectural silhouettes, elevated tailoring, and contemporary ready-to-wear with express delivery across Egypt.`.slice(0, 280);
  const primaryImageUrl = toAbsoluteUrl(category.image || siteConfig.ogImage);

  return {
    title: category.name.toUpperCase(),
    description: englishDescription,
    keywords: [
      category.name,
      category.arabicName || "",
      `${category.name} ليفارو`,
      `${category.arabicName || category.name} ليفارو`,
      "تيشرتات ليفارو",
      "ملابس ليفارو",
      "براند ليفارو",
      "دار ليفارو",
      "LEVARO",
      "Levaro",
      "Levaro Egypt",
      `Levaro ${category.slug}`,
    ].filter(Boolean),
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: englishDescription,
      url: categoryUrl,
      siteName: "LÉVARO",
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      type: "website",
      images: [
        {
          url: primaryImageUrl,
          secureUrl: primaryImageUrl,
          width: 1200,
          height: 800,
          alt: `${category.name} — LÉVARO`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: englishDescription,
      images: [primaryImageUrl],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD Structured Data Builders (Schema.org)                              */
/* -------------------------------------------------------------------------- */

/**
 * Organization Schema: Establishes LÉVARO as an authoritative luxury fashion brand
 * and formally links ownership to Mahmoud Ragab across all search graphs.
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE_URL}/#organization`,
    name: "LÉVARO",
    alternateName: siteConfig.alternateNames,
    legalName: siteConfig.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/og-levaro.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    priceRange: "$$",
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash, Card, Digital Wallets",
    knowsLanguage: ["en", "ar"],
    areaServed: [
      {
        "@type": "Country",
        name: "Egypt",
        alternateName: "مصر",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressRegion: "Cairo",
      addressCountry: "EG",
    },
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Mahmoud Ragab",
      alternateName: ["محمود رجب", "Mahmoud Ragab"],
      jobTitle: "Founder & Creative Director",
      email: "maaahmoudragab@gmail.com",
      telephone: "+201158480351",
      url: "https://www.linkedin.com/in/maahmoudragab/",
      sameAs: [
        "https://github.com/maahmoudragab",
        "https://www.linkedin.com/in/maahmoudragab/",
        "https://www.facebook.com/share/1BnB3opvXz/",
        "https://www.instagram.com/maahmoudragab",
      ],
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+201158480351",
        contactType: "customer support",
        email: "maaahmoudragab@gmail.com",
        availableLanguage: ["English", "Arabic"],
        areaServed: "EG",
      },
    ],
    sameAs: [
      "https://github.com/maahmoudragab",
      "https://www.linkedin.com/in/maahmoudragab/",
      "https://www.facebook.com/share/1BnB3opvXz/",
      "https://www.instagram.com/maahmoudragab",
    ],
  };
}

/**
 * WebSite Schema: Enables Google Search Box and dual-language brand recognition.
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "LÉVARO",
    alternateName: siteConfig.alternateNames,
    url: SITE_URL,
    description: siteConfig.description,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: ["en-US", "ar-EG"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Product Schema: Rich product snippets in Google Search with pricing, availability, and brand.
 */
export function generateProductJsonLd(product: ProductItem) {
  const currentPrice = product.sale_price || product.price;
  const isAvailable = product.stock && product.stock.length > 0;
  const productImages = (product.images || []).map(toAbsoluteUrl);
  const userProductDesc = (product.short_description || product.description || "").trim();
  const englishDescription = userProductDesc
    ? `${userProductDesc} — Official LÉVARO Atelier edition. Express delivery across Egypt.`
    : `Shop the ${product.name} (${product.code}) by LÉVARO. Crafted from ${product.material} with a signature ${product.fit} silhouette. Express delivery across Egypt.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}#product`,
    name: product.name,
    alternateName: [
      product.name,
      `${product.name} ليفارو`,
      `تيشيرت ${product.name} ليفارو`,
      "تيشرتات ليفارو",
      "ملابس ليفارو",
    ],
    description: englishDescription,
    image: productImages,
    sku: product.sku || product.code,
    mpn: product.code,
    brand: {
      "@type": "Brand",
      name: "LÉVARO",
      alternateName: "ليفارو",
    },
    color: product.color,
    material: product.material,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "EGP",
      price: currentPrice,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "LÉVARO",
        alternateName: "ليفارو",
      },
    },
  };
}

/**
 * BreadcrumbList Schema: Displays rich navigation hierarchy in Google search results.
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage Schema: Powers Google Accordion Rich Snippets directly in search results.
 */
export function generateFaqJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * CollectionPage Schema: Represents a curated category or collection catalog for Google.
 */
export function generateCategoryJsonLd(
  category: {
    slug: string;
    name: string;
    arabicName: string;
    description: string;
  },
  products: ProductItem[]
) {
  const categoryUrl = `${SITE_URL}/shop/${category.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#webpage`,
    url: categoryUrl,
    name: `${category.name} — LÉVARO Atelier`,
    alternateName: category.arabicName,
    description: category.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "LÉVARO",
    },
    about: {
      "@type": "Thing",
      name: category.name,
      alternateName: category.arabicName,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/shop/${product.slug}`,
        name: product.name,
        image: product.images?.[0] ? toAbsoluteUrl(product.images[0]) : undefined,
      })),
    },
  };
}

/**
 * AboutPage Schema: Defines the brand's architectural manifesto and founder heritage.
 */
export function generateAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    url: `${SITE_URL}/about`,
    name: "About LÉVARO Atelier",
    alternateName: "عن دار ليفارو للأزياء الفاخرة",
    description:
      "The House of LÉVARO: An architectural fashion atelier exploring form, weight, and silhouette. Founded in Cairo by Mahmoud Ragab, merging sartorial discipline with contemporary ready-to-wear.",
    publisher: {
      "@type": "ClothingStore",
      "@id": `${SITE_URL}/#organization`,
      name: "LÉVARO",
    },
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

