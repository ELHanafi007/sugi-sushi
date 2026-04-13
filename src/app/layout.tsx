import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Sugi Sushi — 杉",
  description: "Experience the art of Japanese cuisine. Premium sushi & sashimi crafted with the finest ingredients, served in an atmosphere of understated luxury.",
  keywords: ["sushi", "japanese restaurant", "premium sushi", "sashimi", "omakase", "saudi arabia"],
  authors: [{ name: "Sugi Sushi" }],
  creator: "Sugi Sushi",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sugi Sushi",
    title: "Sugi Sushi — 杉",
    description: "The art of Japanese cuisine, perfected.",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg text-text min-h-dvh overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <div className="grain" />
      </body>
    </html>
  );
}
