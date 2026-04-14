import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "SUGI — Kinetic Dining",
  description: "Experience Japanese perfection in motion.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=Space+Mono:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased select-none">
        <div className="noise" />
        <div className="spotlight" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
