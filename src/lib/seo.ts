import type { Metadata } from "next";
import type { ProductItem } from "@/types/storefront";

/**
 * LÉVARO SEO / Search configuration
 *
 * Public UI: English only.
 * Search/discovery: English + Arabic brand/product variants.
 *
 * Google does not use meta keywords as a ranking signal. The real SEO work
 * is done through useful page content, unique titles/descriptions, canonical
 * URLs, internal links, structured data, crawlable images, and sitemaps.
 *
 * Official canonical host:
 * https://www.levaroo.live
 */

const OFFICIAL_SITE_URL = "https://www.levaroo.live";

const resolveSiteUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) return OFFICIAL_SITE_URL;

  try {
    const candidate = new URL(
      configured.startsWith("http") ? configured : `https://${configured}`,
    );

    // Normalize both production variants to the preferred www host.
    if (
      candidate.hostname === "levaroo.live" ||
      candidate.hostname === "www.levaroo.live"
    ) {
      return OFFICIAL_SITE_URL;
    }

    // Never let the Vercel project URL become the SEO/canonical URL.
    if (candidate.hostname.endsWith(".vercel.app")) {
      return OFFICIAL_SITE_URL;
    }

    return candidate.toString().replace(/\/+$/, "");
  } catch {
    return OFFICIAL_SITE_URL;
  }
};

export const SITE_URL = resolveSiteUrl();

/**
 * Genuine Arabic brand/search-language variants.
 *
 * These support discovery and internal search integrations.
 * They are NOT a substitute for visible, useful page content.
 */
const BRAND_ARABIC_SEARCH_TERMS = [
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
];

const PRODUCT_ARABIC_SEARCH_TERMS = [
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
];

const BRAND_ENGLISH_SEARCH_TERMS = [
  "LEVARO",
  "LÉVARO",
  "Levaro",
  "Levaro Egypt",
  "Levaro fashion",
  "Levaro brand",
  "Levaro store",
  "Levaro shop",
  "Levaro official",
];

const MARKET_SEARCH_TERMS = [
  "luxury streetwear egypt",
  "egyptian luxury fashion brand",
  "minimal luxury clothing egypt",
  "contemporary ready-to-wear egypt",
  "menswear fashion egypt",
];

export const siteConfig = {
  name: "LÉVARO",
  shortName: "LÉVARO",
  legalName: "LÉVARO Atelier",
  arabicName: "ليفارو",
  founder: "Mahmoud Ragab",
  founderArabic: "محمود رجب",
  founderRole: "Founder & Creative Director",
  founderBio:
    "Founded in Cairo by Mahmoud Ragab, LÉVARO is a contemporary luxury fashion house exploring form, architectural silhouettes, and heavyweight material discipline.",
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
  ],

  title: "LÉVARO | Contemporary Luxury Fashion in Egypt",

  description:
    "LÉVARO is a contemporary Egyptian fashion house creating refined ready-to-wear, architectural silhouettes, elevated essentials, and distinctive pieces for modern wardrobes. Explore the latest LÉVARO collection online in Egypt.",

  url: SITE_URL,
  ogImage: `${SITE_URL}/images/og-levaro.jpg`,
  country: "Egypt",
  city: "Cairo",
  currency: "EGP",

  /**
   * Kept intentionally concise.
   *
   * Google Search does not use the meta keywords tag for ranking.
   * Keep these for metadata consumers / internal tooling, not as the main
   * ranking strategy.
   */
  keywords: [
    ...BRAND_ENGLISH_SEARCH_TERMS,
    ...BRAND_ARABIC_SEARCH_TERMS,
    ...MARKET_SEARCH_TERMS,
  ],
};

/**
 * Site-level Metadata.
 *
 * Use this in app/layout.tsx:
 *
 * export const metadata = defaultMetadata;
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: siteConfig.title,
    template: "%s | LÉVARO",
  },

  description: siteConfig.description,

  applicationName: "LÉVARO",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.founder,
      url: siteConfig.socialLinks.linkedin,
    },
  ],

  creator: siteConfig.founder,
  publisher: siteConfig.name,
  category: "fashion",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: SITE_URL,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "LÉVARO — Contemporary Luxury Fashion in Egypt",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

/**
 * Backward-compatible alias.
 */
export const siteMetadata = defaultMetadata;

/**
 * Convert a relative asset URL into an absolute URL on the official host.
 */
function toAbsoluteUrl(url?: string | null): string {
  if (!url) return siteConfig.ogImage;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Normalize text before putting it into metadata / structured data.
 */
function cleanText(value?: string | null): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

/**
 * Keep descriptions concise while preserving complete words where possible.
 */
function truncateDescription(
  value: string,
  maxLength = 160,
): string {
  const text = cleanText(value);

  if (text.length <= maxLength) return text;

  const truncated = text
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, "");

  return `${truncated}…`;
}

/**
 * Product description.
 *
 * The page remains English-first, while Arabic discovery is handled through
 * the search-term layer and genuine brand aliases.
 */
function buildProductDescription(product: ProductItem): string {
  const source = cleanText(
    product.short_description || product.description,
  );

  if (source) {
    return truncateDescription(
      `${source} Shop the official ${product.name} from LÉVARO in Egypt.`,
      160,
    );
  }

  const material = cleanText(product.material);
  const fit = cleanText(product.fit);
  const category = cleanText(product.category);

  const details = [category, material, fit]
    .filter(Boolean)
    .join(", ");

  return truncateDescription(
    details
      ? `Shop ${product.name} by LÉVARO. ${details}. Discover the official LÉVARO collection online in Egypt.`
      : `Shop ${product.name} by LÉVARO. Discover the official LÉVARO collection online in Egypt.`,
    160,
  );
}

/**
 * Search/discovery terms for a product.
 *
 * Exported so the same normalization can be reused by the site's own search
 * system. This is important: Google SEO metadata and your internal search
 * engine are separate systems.
 */
export function getProductSearchTerms(
  product: ProductItem,
): string[] {
  const name = cleanText(product.name);
  const category = cleanText(product.category);
  const department = cleanText(product.department);

  const tags = (product.tags || [])
    .map(cleanText)
    .filter(Boolean);

  return [
    name,
    `${name} LÉVARO`,
    `${name} Levaro`,
    `${name} ليفارو`,
    `${name} ليڤارو`,
    category,
    department,
    ...tags,
    ...PRODUCT_ARABIC_SEARCH_TERMS,
    ...BRAND_ENGLISH_SEARCH_TERMS,
    ...BRAND_ARABIC_SEARCH_TERMS,
  ].filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Dynamic Product SEO Metadata Generator                                     */
/* -------------------------------------------------------------------------- */

export function generateProductSeoMetadata(
  product: ProductItem,
): Metadata {
  const productName = cleanText(product.name);
  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const productDescription = buildProductDescription(product);

  const productImages = (product.images || [])
    .filter(Boolean)
    .slice(0, 6)
    .map(toAbsoluteUrl);

  const primaryImageUrl = productImages[0] || siteConfig.ogImage;

  const cleanTitle = `${productName} — LÉVARO`;

  const ogImages =
    productImages.length > 0
      ? productImages.map((url, index) => ({
          url,
          secureUrl: url,
          width: 1200,
          height: 1600,
          alt:
            index === 0
              ? `${productName} — LÉVARO`
              : `${productName} — LÉVARO Image ${index + 1}`,
          type: "image/jpeg",
        }))
      : [
          {
            url: siteConfig.ogImage,
            secureUrl: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: `${productName} — LÉVARO`,
            type: "image/jpeg",
          },
        ];

  return {
    title: cleanTitle,

    description: productDescription,

    keywords: getProductSearchTerms(product),

    alternates: {
      canonical: productUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      title: cleanTitle,
      description: productDescription,
      url: productUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: productDescription,
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
  const categoryName = cleanText(category.name);
  const arabicName = cleanText(category.arabicName);

  const categoryUrl = `${SITE_URL}/shop/${category.slug}`;

  const description = truncateDescription(
    cleanText(category.description) ||
      `Explore the ${categoryName} collection by LÉVARO. Discover contemporary ready-to-wear, refined silhouettes, and distinctive essentials from an Egyptian fashion house.`,
    160,
  );

  const cleanTitle = `${categoryName} — LÉVARO`;
  const primaryImageUrl = toAbsoluteUrl(category.image);

  const categoryKeywords = [
    categoryName,
    arabicName,
    `${categoryName} LÉVARO`,
    `${categoryName} Levaro`,
    `${categoryName} ليفارو`,
    `${arabicName} ليفارو`,
    "LÉVARO",
    "Levaro Egypt",
    "ليفارو",
    "ليڤارو",
  ].filter(Boolean);

  return {
    title: cleanTitle,

    description,

    keywords: categoryKeywords,

    alternates: {
      canonical: categoryUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      title: cleanTitle,
      description,
      url: categoryUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      images: [
        {
          url: primaryImageUrl,
          width: 1200,
          height: 800,
          alt: `${categoryName} — LÉVARO`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images: [primaryImageUrl],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD Structured Data Builders (Schema.org)                              */
/* -------------------------------------------------------------------------- */

/**
 * Organization schema.
 *
 * Arabic aliases are genuine brand-name variants. Do not turn generic search
 * phrases into alternateName values.
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE_URL}/#organization`,

    name: siteConfig.name,

    alternateName: [
      siteConfig.arabicName,
      "ليڤارو",
      "Levaro",
      "Lévaro",
      "Lévaro Egypt",
      "براند ليفارو",
      "ماركة ليفارو",
      "متجر ليفارو",
      "دار ليفارو للأزياء",
    ],

    legalName: siteConfig.legalName,

    url: SITE_URL,

    logo: `${SITE_URL}/images/logo.png`,
    image: siteConfig.ogImage,

    description: siteConfig.description,

    telephone: siteConfig.telephone,
    email: siteConfig.email,

    currenciesAccepted: siteConfig.currency,

    knowsLanguage: ["en", "ar"],

    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
      alternateName: "مصر",
    },

    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "Cairo",
      addressCountry: "EG",
    },

    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,

      name: siteConfig.founder,

      alternateName: [
        siteConfig.founderArabic,
        siteConfig.founder,
      ],

      jobTitle: siteConfig.founderRole,

      url: siteConfig.socialLinks.linkedin,

      sameAs: [
        siteConfig.socialLinks.github,
        siteConfig.socialLinks.linkedin,
        siteConfig.socialLinks.facebook,
        siteConfig.socialLinks.instagram,
      ],
    },

    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.telephone,
        contactType: "customer support",
        email: siteConfig.email,
        availableLanguage: ["English", "Arabic"],
        areaServed: "EG",
      },
    ],

    sameAs: [
      siteConfig.socialLinks.github,
      siteConfig.socialLinks.linkedin,
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram,
    ],
  };
}

/**
 * WebSite schema.
 *
 * SearchAction describes the site's own search endpoint.
 * Google decides whether / how it presents search features in results.
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    name: siteConfig.name,

    alternateName: [
      siteConfig.arabicName,
      "ليڤارو",
      "Levaro",
      "Lévaro",
    ],

    url: SITE_URL,

    description: siteConfig.description,

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "en-US",

    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Product schema.
 *
 * This is the most important structured-data layer for your store because
 * Google can use Product/Offer markup for richer product search experiences.
 */
export function generateProductJsonLd(
  product: ProductItem,
) {
  const productUrl = `${SITE_URL}/shop/${product.slug}`;

  const currentPrice =
    product.sale_price || product.price;

  const productImages = (product.images || [])
    .filter(Boolean)
    .map(toAbsoluteUrl);

  const productDescription =
    buildProductDescription(product);

  /**
   * Keep the current stock logic compatible with the existing ProductItem
   * type. If your stock entries later contain quantities, this helper should
   * be upgraded to check actual quantity > 0.
   */
  const isAvailable =
    Array.isArray(product.stock) &&
    product.stock.length > 0;

  const productName = cleanText(product.name);
  const category = cleanText(product.category);
  const material = cleanText(product.material);
  const color = cleanText(product.color);

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": `${productUrl}#product`,

    name: productName,

    description: productDescription,

    image: productImages,

    sku: product.sku || product.code,
    mpn: product.code,

    brand: {
      "@type": "Brand",
      name: siteConfig.name,
      alternateName: siteConfig.arabicName,
    },

    color: color || undefined,
    material: material || undefined,
    category: category || undefined,

    inLanguage: "en-US",

    url: productUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": productUrl,
    },

    offers: {
      "@type": "Offer",

      url: productUrl,

      priceCurrency: siteConfig.currency,
      price: currentPrice,

      itemCondition:
        "https://schema.org/NewCondition",

      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",

      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: SITE_URL,
      },
    },
  };
}

/**
 * BreadcrumbList schema.
 *
 * Use this only when the same breadcrumb hierarchy is visible to users.
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: items
      .filter(
        (item) =>
          cleanText(item.name) &&
          Boolean(item.url),
      )
      .map((item, index) => ({
        "@type": "ListItem",

        position: index + 1,

        name: cleanText(item.name),

        item: item.url.startsWith("http")
          ? item.url
          : `${SITE_URL}${
              item.url.startsWith("/") ? "" : "/"
            }${item.url}`,
      })),
  };
}

/**
 * FAQPage schema.
 *
 * Only use this when the exact questions/answers are visibly present on the
 * page. Do not create hidden FAQ content solely for SEO.
 */
export function generateFaqJsonLd(
  items: {
    question: string;
    answer: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: items
      .filter(
        (item) =>
          cleanText(item.question) &&
          cleanText(item.answer),
      )
      .map((item) => ({
        "@type": "Question",

        name: cleanText(item.question),

        acceptedAnswer: {
          "@type": "Answer",
          text: cleanText(item.answer),
        },
      })),
  };
}

/**
 * CollectionPage schema.
 */
export function generateCategoryJsonLd(
  category: {
    slug: string;
    name: string;
    arabicName: string;
    description: string;
  },
  products: ProductItem[],
) {
  const categoryUrl =
    `${SITE_URL}/shop/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    "@id": `${categoryUrl}#webpage`,

    url: categoryUrl,

    name: `${category.name} — LÉVARO`,

    alternateName: category.arabicName,

    description: cleanText(
      category.description,
    ),

    inLanguage: "en-US",

    isPartOf: {
      "@type": "WebSite",

      "@id": `${SITE_URL}/#website`,

      name: siteConfig.name,

      url: SITE_URL,
    },

    about: {
      "@type": "Thing",

      name: category.name,

      alternateName: category.arabicName,
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems: products.length,

      itemListElement: products
        .slice(0, 30)
        .map((product, index) => ({
          "@type": "ListItem",

          position: index + 1,

          url: `${SITE_URL}/shop/${product.slug}`,

          name: product.name,

          image: product.images?.[0]
            ? toAbsoluteUrl(
                product.images[0],
              )
            : undefined,
        })),
    },
  };
}

/**
 * About page schema.
 */
export function generateAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",

    "@id": `${SITE_URL}/about#webpage`,

    url: `${SITE_URL}/about`,

    name: "About LÉVARO",

    alternateName:
      "عن دار ليفارو للأزياء",

    description:
      "Discover the House of LÉVARO, a contemporary fashion atelier founded in Cairo by Mahmoud Ragab, exploring form, weight, silhouette, and refined ready-to-wear.",

    inLanguage: "en-US",

    publisher: {
      "@type": "ClothingStore",

      "@id": `${SITE_URL}/#organization`,

      name: siteConfig.name,

      url: SITE_URL,
    },

    mainEntity: {
      "@type": "Organization",

      "@id": `${SITE_URL}/#organization`,
    },
  };
}
