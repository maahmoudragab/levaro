import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/storefront/search/CommandPalette";
import {
  SITE_URL,
  siteConfig,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const supreme = localFont({
  src: [
    {
      path: "../../public/fonts/Supreme/Supreme-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Supreme/Supreme-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-supreme",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay/ClashDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LÉVARO",
    template: "LÉVARO — %s",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "LÉVARO Atelier" }],
  creator: "LÉVARO",
  publisher: "LÉVARO",
  applicationName: "LÉVARO",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    title: "LÉVARO | ليفارو — براند الأزياء الفاخرة والملابس العصرية",
    description: siteConfig.description,
    siteName: "LÉVARO",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "LÉVARO | ليفارو — Modern Luxury Fashion & Atelier Editions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LÉVARO | ليفارو — براند الأزياء الفاخرة والملابس العصرية",
    description: siteConfig.description,
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationJsonLd();
  const websiteSchema = generateWebSiteJsonLd();

  return (
    <html
      lang="ar"
      dir="ltr"
      className={`${supreme.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-sans">
        <Toaster />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
