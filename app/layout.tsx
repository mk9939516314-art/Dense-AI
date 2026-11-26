import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/bricolage.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});
const serif = localFont({
  src: "./fonts/instrument-serif-italic.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "italic",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const description =
  "Dense AI provides human data collection, annotation, evaluation and quality workflows for AI and machine learning teams.";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Dense AI — Human Data Infrastructure for AI", template: "%s" },
  description,
  keywords: ["AI data", "data annotation", "data collection", "LLM evaluation", "human feedback", "AI training data"],
  openGraph: {
    title: "Dense AI — Human Data Infrastructure for AI",
    description,
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dense AI — Human Data Infrastructure for AI",
    description,
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#020001",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dense AI",
    description,
    email: "densee.ai@gmail.com",
    ...(siteUrl ? { url: siteUrl, logo: `${siteUrl}/logo.png` } : {}),
  };

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        {children}
      </body>
    </html>
  );
}
