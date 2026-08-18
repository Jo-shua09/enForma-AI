"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const stats = [
  { value: "1.2M+", label: "Meals scanned" },
  { value: "94%", label: "Macro accuracy" },
  { value: "48k", label: "Plans generated" },
  { value: "4.9★", label: "App rating" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Ambient video layer */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <video className="h-full w-full object-cover opacity-40" autoPlay loop muted playsInline preload="auto" poster="" src="/videos/hero.mp4" />
      </div>

      {/* Gradient blending into the background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--gradient-accent)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-5xl font-display text-3xl sm:text-5xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
        >
          Train with <span className="text-gradient">precision.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="mt-7 max-w-4xl text-balance text-sm sm:text-lg leading-relaxed text-muted-foreground"
        >
          EnForma AI scans your meals, writes your training plan, grades your lifting form through your camera, and keeps every habit on streak - one
          calm, intelligent coach instead of five noisy apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MovingBorderButton href="/auth">Start Tracking Free</MovingBorderButton>
          <Link
            href="/form-coach"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface-2"
          >
            <Play className="h-4 w-4 text-cyan" />
            Watch the form coach
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-surface/60 px-4 py-5 backdrop-blur">
              <dt className="font-display text-2xl font-semibold text-foreground">{s.value}</dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

export function MovingBorderButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative inline-flex overflow-hidden rounded-xl p-[1.5px] focus:outline-none">
      <span
        className="absolute inset-[-160%] animate-[spin_4s_linear_infinite]"
        style={{
          background: "conic-gradient(from 90deg at 50% 50%, transparent 0%, var(--cyan) 25%, var(--lime) 45%, transparent 60%)",
        }}
      />
      <span className="relative inline-flex items-center gap-2 rounded-[10px] bg-background px-6 py-3 text-sm font-medium text-foreground backdrop-blur-3xl transition-colors group-hover:bg-surface">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
