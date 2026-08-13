"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Quote, Star } from "lucide-react";
import { MovingBorderButton } from "./hero";
import { Reveal, Section, SectionHeading } from "./primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const testimonials = [
  {
    quote: "The form scoring caught a knee valgus I'd had for four years. My physio confirmed it in the same week.",
    name: "Marcus Reyes",
    role: "Intermediate lifter · 3 yrs training",
  },
  {
    quote: "I stopped weighing food entirely. Photo, done. My protein went from 90g to 165g a day without effort.",
    name: "Aisha Bello",
    role: "Fat loss phase · down 11kg",
  },
  {
    quote: "It's the first planner that actually notices when I'm under-recovering and pulls volume back.",
    name: "Tom Lindqvist",
    role: "Masters powerlifter",
  },
  {
    quote: "The progression suggestions feel like texting a coach who has memorised every session I've done.",
    name: "Priya Nair",
    role: "Hybrid athlete",
  },
  {
    quote: "Beautiful, quiet, fast. It never nags me - the streak rings just quietly do their job.",
    name: "Dan Okafor",
    role: "Beginner · 6 months in",
  },
  {
    quote: "We onboard new members with EnForma now. Their technique curve is visibly steeper.",
    name: "Sofia Marín",
    role: "Head coach, Velocity Club",
  },
];

const tiers = [
  {
    name: "Starter",
    price: { m: 0, y: 0 },
    desc: "Everything you need to build the habit.",
    features: ["10 meal scans / month", "1 AI workout plan", "Habit streaks & water tracking", "Basic progress charts"],
    missing: ["Form analysis", "Coach chat"],
    cta: "Start free",
  },
  {
    name: "Athlete",
    price: { m: 14, y: 11 },
    desc: "The full AI coaching stack, unlimited.",
    features: [
      "Unlimited meal scans",
      "Adaptive weekly programming",
      "Camera form analysis (5 lifts)",
      "Progression intelligence",
      "Coach chat with full history",
      "Apple Health & Garmin sync",
    ],
    missing: [],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Coach",
    price: { m: 39, y: 31 },
    desc: "For trainers running real rosters.",
    features: [
      "Everything in Athlete",
      "Up to 25 client seats",
      "Shared form review inbox",
      "Client compliance dashboard",
      "White-label PDF plans",
      "Priority support",
    ],
    missing: [],
    cta: "Talk to us",
  },
];

const faqs = [
  {
    q: "How accurate are the calorie estimates?",
    a: "Within roughly 10–15% for common plated meals. We always show a range and a confidence score, because a photo can't see the oil in the pan. Used consistently, the trend is what drives results.",
  },
  {
    q: "Do I need special equipment for form analysis?",
    a: "No. Any phone camera at roughly waist height, 2–3 metres away, side-on. Pose tracking runs on-device, so your video never has to leave the phone.",
  },
  {
    q: "Which exercises are supported?",
    a: "Back squat, push-up, bicep curl, overhead press and deadlift at launch. Bench press, lunge and row are in beta.",
  },
  {
    q: "Can I edit what the AI generates?",
    a: "Always. Swap exercises, change set schemes, correct a meal estimate - every correction feeds back into how the model plans for you.",
  },
  {
    q: "Is this medical advice?",
    a: "No. EnForma AI is a fitness and nutrition tool. It's not a diagnosis, and it doesn't replace a physiotherapist, doctor or registered dietitian.",
  },
  {
    q: "Can I export my data?",
    a: "Yes - full CSV and JSON export of meals, sessions and habits at any time, and one-click account deletion.",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        label="Results"
        title={
          <>
            People who stopped <span className="text-gradient">guessing.</span>
          </>
        }
      />
      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
            <figure className="rounded-2xl border border-border bg-surface/50 p-6">
              <Quote className="h-4 w-4 text-cyan" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">{t.quote}</blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <Section id="pricing">
      <SectionHeading
        label="Pricing"
        title={
          <>
            Less than one session <span className="text-gradient">with a trainer.</span>
          </>
        }
        description="Cancel any time. Every paid plan includes a 14-day trial with the full feature set."
      />

      <Reveal delay={0.06} className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1">
          {[
            { k: false, l: "Monthly" },
            { k: true, l: "Yearly · save 20%" },
          ].map((o) => (
            <button
              key={o.l}
              onClick={() => setYearly(o.k)}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                yearly === o.k ? "bg-surface-2 text-foreground" : "text-muted-foreground"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.07}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                t.featured ? "border-cyan/40 bg-surface/70 glow-cyan" : "border-border bg-surface/40"
              }`}
            >
              {t.featured ? (
                <span className="absolute -top-3 left-8 rounded-full border border-cyan/40 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                  Most popular
                </span>
              ) : null}
              <h3 className="font-display text-xl font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold tracking-tight">${yearly ? t.price.y : t.price.m}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </p>

              <ul className="mt-7 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
                {t.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground/50">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={t.name === "Coach" ? "/contact" : "/auth"}
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] ${
                  t.featured ? "bg-primary text-primary-foreground" : "border border-border bg-surface-2 text-foreground"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading align="left" label="FAQ" title="Questions, answered straight." />
        <Accordion type="single" collapsible defaultValue="faq-0" className="border-y border-border">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="gap-6 py-5 text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-6 pr-10 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section id="cta">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-surface/50 px-8 py-20 text-center">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
            style={{ background: "var(--gradient-accent)" }}
          />
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">
              Stop guessing. <span className="text-gradient">Start forming.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
              Free forever plan, no card required. Your first meal scan takes about four seconds.
            </p>
            <div className="mt-10 flex justify-center">
              <MovingBorderButton href="/auth">Create your free account</MovingBorderButton>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Footer() {
  const cols = [
    {
      t: "Product",
      l: [
        ["Meal scanner", "#meals"],
        ["Workout planner", "#workouts"],
        ["Form coach", "#form-coach"],
        ["Progress", "/progress"],
        ["Pricing", "#pricing"],
      ],
    },
    {
      t: "Company",
      l: [
        ["About", "/about"],
        ["Contact", "/contact"],
        ["Features", "#features"],
      ],
    },
    {
      t: "Resources",
      l: [
        ["FAQ", "/faq"],
        ["Dashboard", "/dashboard"],
        ["Settings", "/settings"], // Assuming settings is a separate page
      ],
    },
    {
      t: "Get started",
      l: [
        ["Create account", "/auth"],
        ["Sign in", "/auth"],
        ["Talk to us", "/contact"],
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="">
              <Image src="/logo.png" alt="EnForma AI Logo" width={32} height={32} className="w-[5rem] object-contain p-1" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An AI coach for nutrition, training and technique. Built for people who want the data without the noise.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.t}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.t}</p>
              <ul className="mt-4 space-y-2.5">
                {c.l.map(([label, to]) => (
                  <li key={label}>
                    <Link href={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} EnForma AI. All rights reserved.</p>
          <p>Estimates are not medical advice. Train smart.</p>
        </div>
      </div>
    </footer>
  );
}
