import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/sections";
import { Features } from "@/components/landing/features";
import { MealScanner } from "@/components/landing/meal-scanner";
import { FormCoach } from "@/components/landing/form-coach";
import { WorkoutPlanner } from "@/components/landing/workout-planner";

const metadata: Metadata = {
  title: "Features - meal scanning, training & form analysis | EnForma AI",
  description: "Explore every EnForma AI engine: photo macro scanning, adaptive programming, camera form analysis and habit streaks.",
  openGraph: {
    title: "Features - EnForma AI",
    description: "The four AI engines behind your nutrition, training and technique.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-background pt-28">
      <Navbar />
      <Features />
      <MealScanner />
      <FormCoach />
      <WorkoutPlanner />
      <Footer />
    </main>
  );
}
