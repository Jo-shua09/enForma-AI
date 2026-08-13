import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css"; // Assuming you have a global stylesheet

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

const metadata: Metadata = {
  title: "EnForma AI - AI Fitness Coach for Meals, Training & Form",
  description:
    "EnForma AI scans meal photos for macros, generates adaptive workout plans, grades your lifting form through your camera and keeps daily habits on streak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
