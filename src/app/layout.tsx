import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fixly - Premium Local Services Marketplace",
  description: "Connect with skilled professionals for all your home and service needs. Built with cutting-edge technology for the ultimate user experience.",
  keywords: "fixly, services, marketplace, home repair, professionals, local services",
  authors: [{ name: "Fixly Team" }],
  creator: "Fixly",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
    siteName: "Fixly",
    title: "Fixly - Premium Local Services Marketplace",
    description: "Connect with skilled professionals for all your home and service needs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fixly - Local Services Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixly - Premium Local Services Marketplace",
    description: "Connect with skilled professionals for all your home and service needs.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
