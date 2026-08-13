import { Navbar } from "@/components/landing/navbar";
import { Faq, FinalCta, Footer, Pricing } from "@/components/landing/sections";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Pricing - plans from free to coach | EnForma AI",
  description: "Simple EnForma AI pricing: a free starter tier, the full Athlete stack, and Coach seats for trainers. 14-day trial on paid plans.",
  openGraph: {
    title: "Pricing - EnForma AI",
    description: "Free starter tier, unlimited Athlete plan and Coach seats for trainers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-background pt-28">
      <Navbar />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
