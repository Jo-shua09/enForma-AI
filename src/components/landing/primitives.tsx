"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: {
  label: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start text-left")}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p> : null}
    </Reveal>
  );
}

export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-7xl px-6 py-12 sm:py-24", className)}>
      {children}
    </section>
  );
}
