import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/sections";
import { Reveal, Section, SectionHeading } from "@/components/landing/primitives";

export const metadata: Metadata = {
  title: "About EnForma AI - the team behind the coach",
  description: "Why we built EnForma AI: one calm, intelligent coach for nutrition, training and technique instead of five noisy apps.",
  openGraph: {
    title: "About - EnForma AI",
    description: "The story and principles behind the EnForma AI coach.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const principles = [
  {
    t: "Signal over noise",
    d: "No streak-shaming pop-ups. The app speaks when it has something useful to say.",
  },
  {
    t: "Honest estimates",
    d: "Every macro number ships with a range and a confidence score. We never fake precision.",
  },
  {
    t: "On-device first",
    d: "Pose tracking runs on your phone. Your training footage stays yours by default.",
  },
  {
    t: "Your data, portable",
    d: "Full CSV and JSON export at any time, and one-click account deletion.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background pt-28">
      <Navbar />
      <Section>
        <SectionHeading
          label="About"
          align="left"
          title={
            <>
              Built by lifters who were <span className="text-gradient">tired of guessing.</span>
            </>
          }
          description="EnForma AI started as an internal tool for a small strength gym: one place to check whether the food, the programme and the technique were actually lining up. It grew into the coach we wish we'd had at year one."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface/50 p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <Footer />
    </main>
  );
}
