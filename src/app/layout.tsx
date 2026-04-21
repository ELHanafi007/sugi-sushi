import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import CinematicReveal from "@/components/CinematicReveal";

export const metadata: Metadata = {
  title: "SUGI — Kinetic Dining",
  description: "Experience Japanese perfection in motion. A luxury sushi dining experience in Riyadh.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "SUGI SUSHI — Kinetic Dining",
    description: "Traditional Soul, Modern Vision. Experience Japanese perfection in motion.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060608",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&family=Space+Mono:wght@400;700&family=Noto+Sans+Arabic:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cinzel:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased select-none">
        <LanguageProvider>
          <CinematicReveal>
            {children}
          </CinematicReveal>
          <BottomNavWrapper />
        </LanguageProvider>

        {/* Film Grain — low z, pointer-events none */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
