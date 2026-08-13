import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Faq, FinalCta, Footer } from "@/components/landing/sections";

const metadata: Metadata = {
  title: "FAQ - accuracy, privacy and supported lifts | EnForma AI",
  description: "Answers about calorie accuracy, camera form analysis, supported exercises, data export and privacy in EnForma AI.",
  openGraph: {
    title: "FAQ - EnForma AI",
    description: "Accuracy, privacy, supported lifts and data export, answered straight.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function FaqPage() {
  return (
    <main className="relative min-h-screen bg-background pt-28">
      <Navbar />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
