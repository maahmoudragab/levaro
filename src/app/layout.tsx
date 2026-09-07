import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/storefront/search/CommandPalette";
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
  title: "LÉVARO — Modern Luxury Fashion",
  description: "Exclusive fashion collection for Men, Women, Kids, and Accessories.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${supreme.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <body className="font-sans">
        <Toaster />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
