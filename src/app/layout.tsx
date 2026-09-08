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
  authors: [{ name: "Mahmoud Ragab", url: "https://www.linkedin.com/in/maahmoudragab/" }],
  creator: "Mahmoud Ragab",
  publisher: "LÉVARO — Founded by Mahmoud Ragab",
  applicationName: "LÉVARO",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/images/logo.ico" },
      { url: "/images/logo-without-background.png", type: "image/png" },
    ],
    shortcut: "/images/logo.ico",
    apple: "/images/logo-without-background.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: SITE_URL,
    title: "LÉVARO — Contemporary Luxury Fashion Atelier",
    description: siteConfig.description,
    siteName: "LÉVARO",
    images: [
      {
        url: `${SITE_URL}/images/og-levaro.jpg`,
        secureUrl: `${SITE_URL}/images/og-levaro.jpg`,
        width: 1200,
        height: 630,
        alt: "LÉVARO — Contemporary Luxury Fashion Atelier",
        type: "image/jpeg",
      },
      {
        url: `${SITE_URL}/images/logo.png`,
        secureUrl: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 1200,
        alt: "LÉVARO Emblem",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LÉVARO — Contemporary Luxury Fashion Atelier",
    description: siteConfig.description,
    images: [`${SITE_URL}/images/og-levaro.jpg`],
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
      lang="en"
      dir="ltr"
      className={`${supreme.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <head>
        <link rel="image_src" href={`${SITE_URL}/images/og-levaro.jpg`} />
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
