import type { Metadata, Viewport } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sugi Sushi — Artistry in Every Slice",
    template: "%s | Sugi Sushi",
  },
  description: "Experience the art of Japanese cuisine. Premium sushi & sashimi crafted with the finest ingredients, served in an atmosphere of understated luxury.",
  keywords: ["sushi", "japanese", "premium", "sashimi", "omakase", "saudi arabia"],
  authors: [{ name: "Sugi Sushi" }],
  creator: "Sugi Sushi",
  publisher: "Sugi Sushi",
  formatDetection: {
    telephone: true,
    email: false,
    address: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sugi Sushi",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sugi Sushi",
    title: "Sugi Sushi — Artistry in Every Slice",
    description: "Experience the art of Japanese cuisine. Premium sushi & sashimi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#050505",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${shipporiMincho.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="/media" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground selection:bg-gold/30 selection:text-gold-lighter overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
