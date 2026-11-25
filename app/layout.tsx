import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AssistantLoader from "@/components/assistant/loader";

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
  themeColor: "#F4F6FA",
  colorScheme: "light",
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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <AssistantLoader />
      </body>
    </html>
  );
}
