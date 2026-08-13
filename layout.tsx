import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://enforma-ai.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Enforma AI - Your Intelligent Information Companion",
    template: `%s | Enforma AI`,
  },
  description:
    "Enforma AI is a cutting-edge AI assistant designed to provide you with accurate and insightful answers. Experience the future of information access.",

  // Favicon
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // Open Graph (for social sharing)
  openGraph: {
    title: "Enforma AI - Your Intelligent Information Companion",
    description: "Experience the future of information access with Enforma AI, a cutting-edge AI assistant.",
    url: siteUrl,
    siteName: "Enforma AI",
    images: [
      {
        url: `${siteUrl}og-image.png`, // Create and add an og-image.png to your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Enforma AI - Your Intelligent Information Companion",
    description: "Experience the future of information access with Enforma AI.",
    images: [`${siteUrl}og-image.png`], // Create and add an og-image.png to your public folder
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
