import type { Metadata } from "next";
import type { ProductItem } from "@/types/storefront";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://levaro.store";

export const siteConfig = {
  name: "LÉVARO | ليفارو",
  shortName: "LÉVARO",
  legalName: "LÉVARO Atelier",
  arabicName: "ليفارو",
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
  ],
  title: "LÉVARO | ليفارو — براند الأزياء الفاخرة والملابس العصرية في مصر",
  description:
    "براند ليفارو (LÉVARO) — العلامة التجارية المصرية الرائدة في الأزياء الفاخرة، التيشرتات الراقية (Oversized & Relaxed Fit)، الجواكت الأنيقة، ودينم السيلفدج الياباني. تسوق أحدث كولكشن من دار ليفارو مع شحن سريع لجميع محافظات مصر.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  telephone: "+201000000000",
  email: "curator@levaro.store",
  country: "Egypt",
  city: "Cairo",
  currency: "EGP",
  keywords: [
    // Brand Specific Keywords (Arabic)
    "ليفارو",
    "ليڤارو",
    "براند ليفارو",
    "ماركة ليفارو",
    "متجر ليفارو",
    "موقع ليفارو",
    "شوب ليفارو",
    "دار ليفارو",
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
  ],
};

/* -------------------------------------------------------------------------- */
/* Dynamic Product SEO Metadata Generator                                     */
/* -------------------------------------------------------------------------- */

export function generateProductSeoMetadata(product: ProductItem): Metadata {
  const isTshirt =
    product.name.toLowerCase().includes("tee") ||
    product.name.toLowerCase().includes("t-shirt") ||
    product.category.toLowerCase().includes("tee") ||
    product.category.toLowerCase().includes("shirt");

  const productCategoryAr = isTshirt
    ? "تيشرتات وملابس ليفارو"
    : product.category.toLowerCase().includes("outerwear") || product.category.toLowerCase().includes("jacket")
    ? "جواكت ومعاطف ليفارو"
    : product.category.toLowerCase().includes("trouser") || product.category.toLowerCase().includes("denim")
    ? "بناطيل ودينم ليفارو"
    : "ملابس وأزياء ليفارو";

  const cleanTitle = product.name.toUpperCase();

  const userProductDesc = (product.short_description || product.description || "").trim();
  const richDescription = userProductDesc
    ? `${userProductDesc} — تسوق ${product.name} الأصلي من دار ليفارو LÉVARO. متوفر الآن للشراء أونلاين مع شحن لجميع محافظات مصر.`.slice(0, 280)
    : `تسوق ${product.name} الأصلي (${product.code}) من دار ليفارو LÉVARO. مصمم بخامة ${product.material} الفاخرة وقصة ${product.fit}. متوفر الآن للشراء أونلاين مع شحن لجميع محافظات مصر.`.slice(0, 280);

  const primaryImage = product.images?.[0] || siteConfig.ogImage;
  const productUrl = `${SITE_URL}/shop/${product.slug}`;

  return {
    title: cleanTitle,
    description: richDescription,
    keywords: [
      product.name,
      `${product.name} ليفارو`,
      "تيشرتات ليفارو",
      "ملابس ليفارو",
      "براند ليفارو",
      product.code,
      product.category,
      product.department,
      "Lévaro",
      "Levaro",
      "Levaro Egypt",
      ...(product.tags || []),
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} — LÉVARO (ليفارو)`,
      description: richDescription,
      url: productUrl,
      siteName: siteConfig.name,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      type: "website",
      images: product.images.slice(0, 4).map((img, idx) => ({
        url: img,
        width: 1200,
        height: 1600,
        alt: `${product.name} - LÉVARO ليفارو صورة ${idx + 1}`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ليفارو — LÉVARO`,
      description: richDescription,
      images: [primaryImage],
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
  const cleanTitle = category.name.toUpperCase();
  const categoryUrl = `${SITE_URL}/shop/${category.slug}`;
  const userCatDesc = (category.description || "").trim();
  const arabicBadge = category.arabicName || `قسم ${category.name} — دار ليفارو`;
  const richDescription = userCatDesc
    ? `${userCatDesc} — تسوق تشكيلة ${category.name} الفاخرة من دار ليفارو LÉVARO في مصر مع توصيل سريع.`.slice(0, 280)
    : `تسوق كولكشن ${arabicBadge} (${category.name}) الفاخر من دار ليفارو LÉVARO. شحن لجميع محافظات مصر وتوصيل سريع.`;
  const primaryImage = category.image || siteConfig.ogImage;

  return {
    title: cleanTitle,
    description: richDescription,
    keywords: [
      category.name,
      arabicBadge,
      `${category.name} ليفارو`,
      `${arabicBadge} ليفارو`,
      "تيشرتات ليفارو",
      "ملابس ليفارو",
      "براند ليفارو",
      "دار ليفارو",
      "LEVARO",
      "Levaro Egypt",
      `Levaro ${category.slug}`,
    ],
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${category.name} | ${category.arabicName} — LÉVARO`,
      description: richDescription,
      url: categoryUrl,
      siteName: siteConfig.name,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      type: "website",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 800,
          alt: `${category.name} - ليفارو LÉVARO`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${category.arabicName} — LÉVARO`,
      description: richDescription,
      images: [primaryImage],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD Structured Data Builders (Schema.org)                              */
/* -------------------------------------------------------------------------- */

/**
 * Organization Schema: Establishes LÉVARO as an authoritative brand in both Arabic and English.
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
    logo: `${SITE_URL}/opengraph-image`,
    image: `${SITE_URL}/opengraph-image`,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    priceRange: "$$",
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash, Card, Digital Wallets",
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
    sameAs: [
      "https://www.instagram.com/levaro.official",
    ],
  };
}

/**
 * WebSite Schema: Enables Google Search Box and deep brand recognition.
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "LÉVARO",
    alternateName: ["ليفارو", "ليڤارو", "Levaro", "Lévaro Egypt"],
    url: SITE_URL,
    description: siteConfig.description,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: ["ar-EG", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Product Schema: Generates rich product snippets in Google Search with pricing, availability, and brand.
 */
export function generateProductJsonLd(product: ProductItem) {
  const currentPrice = product.sale_price || product.price;
  const isAvailable = product.stock && product.stock.length > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}#product`,
    name: product.name,
    alternateName: `${product.name} من ليفارو`,
    description: `${product.description} - تصميم حصري من دار ليفارو LÉVARO بمواد ${product.material} الفاخرة وقصة ${product.fit}.`,
    image: product.images,
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
        image: product.images?.[0] || undefined,
      })),
    },
  };
}

/**
 * AboutPage Schema: Defines the brand's architectural manifesto and heritage.
 */
export function generateAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    url: `${SITE_URL}/about`,
    name: "About LÉVARO Atelier | عن دار ليفارو للأزياء الفاخرة",
    description:
      "دار ليفارو (LÉVARO) — علامة أزياء مصرية رائدة تمزج بين القصات المعمارية الدقيقة وخامات النسيج الفاخرة مثل القطن الجيزة ودينم السيلفدج الياباني.",
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

