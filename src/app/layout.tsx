import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoni = localFont({
  src: "../../public/fonts/BodoniModa-VariableFont_opsz,wght.ttf",
  variable: "--font-bodoni",
});

export const metadata: Metadata = {
  title: "LÉVARO — Modern Luxury Fashion",
  description: "Exclusive fashion collection for Men, Women, Kids, and Accessories.",
};

/**
 * Root Layout Component.
 * Sets global fonts and mounts the application-wide Toaster provider.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
