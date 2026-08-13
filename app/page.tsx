import { Navbar } from "@/components/landing/navbar";
import { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { MealScanner } from "@/components/landing/meal-scanner";
import { FormCoach } from "@/components/landing/form-coach";
import { WorkoutPlanner } from "@/components/landing/workout-planner";
import { HowItWorks, LogoMarquee } from "@/components/landing/how-it-works";
import { Faq, FinalCta, Footer, Pricing, Testimonials } from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "EnForma AI - AI Fitness Coach for Meals, Training & Form",
  description:
    "EnForma AI scans meal photos for macros, generates adaptive workout plans, grades your lifting form through your camera and keeps daily habits on streak.",
  openGraph: {
    title: "EnForma AI - Your body, decoded by AI",
    description: "AI meal scanning, adaptive training plans, camera-based form analysis and habit streaks in one calm dark-mode coach.",
  },
};

export default function Index() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Features />
      <MealScanner />
      <FormCoach />
      <WorkoutPlanner />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
