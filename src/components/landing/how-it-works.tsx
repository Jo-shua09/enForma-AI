"use client";

import { Reveal, Section, SectionHeading } from "./primitives";

const steps = [
  {
    n: "01",
    t: "Tell us the goal",
    d: "Two minutes of onboarding: goal, experience, equipment, days per week, injuries to work around.",
  },
  {
    n: "02",
    t: "Log with your camera",
    d: "Photograph meals, record a set. Vision does the data entry so you never touch a search box.",
  },
  {
    n: "03",
    t: "Get the adjustment",
    d: "Every Sunday the plan is rewritten: loads, volume, calories and habit targets move with your data.",
  },
  {
    n: "04",
    t: "Keep the streak",
    d: "Small daily rings, weekly reviews, and a coach chat that remembers your entire training history.",
  },
];

const logos = ["IRONHOUSE", "PULSE LABS", "NORTHSIDE BARBELL", "APEX PHYSIO", "VELOCITY CLUB", "STRONGHAUS", "KINETIC CO"];

export function LogoMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/30 py-8">
      <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Trusted inside performance gyms and clinics
      </p>
      <div className="flex w-max animate-marquee gap-16 pr-16">
        {[...logos, ...logos].map((l, i) => (
          <span key={`${l}-${i}`} className="font-display text-lg font-semibold tracking-[0.18em] text-muted-foreground/50">
            {l}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function HowItWorks() {
  return (
    <Section id="how">
      <SectionHeading
        label="How it works"
        title={
          <>
            Four steps to a coach that <span className="text-gradient">never forgets.</span>
          </>
        }
      />
      <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.07}>
            <div className="h-full bg-surface/50 p-8">
              <span className="font-mono text-xs tracking-[0.2em] text-cyan">{s.n}</span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
