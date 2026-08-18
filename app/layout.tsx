import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = "https://enforma-ai.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Enforma AI - AI Fitness Coach for Nutrition, Training, and Form",
    template: `%s | Enforma AI`,
  },
  description:
    "Enforma AI is your all-in-one AI fitness coach. Scan meals for macros, get personalized workout plans, and perfect your form with camera-based analysis.",

  // Favicon
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // Open Graph (for social sharing)
  openGraph: {
    title: "Enforma AI - Your AI Fitness Coach",
    description: "Scan meals, get personalized workouts, and analyze your form with Enforma AI.",
    url: siteUrl,
    siteName: "Enforma AI",
    images: [
      {
        url: `${siteUrl}og-image.png`,
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
    title: "Enforma AI - AI Fitness Coach for Nutrition & Training",
    description: "Scan meals, get personalized workouts, and analyze your form with Enforma AI.",
    images: [`${siteUrl}og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`data-scroll-behavior="smooth" ${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
