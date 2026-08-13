"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { Activity, AlertTriangle, CheckCircle2, Video } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

export function FormCoach() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], ["7deg", "-7deg"]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], ["-7deg", "7deg"]), { stiffness: 140, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Section id="form-coach">
      <SectionHeading
        label="AI form analysis"
        title={
          <>
            A coach that actually <span className="text-gradient">watches your reps.</span>
          </>
        }
        description="Prop your phone against a water bottle, hit record and lift. EnForma tracks joint positions frame by frame and scores depth, knee tracking, torso angle and tempo - then tells you the single thing to fix."
      />

      <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
        >
          <motion.div
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="relative rounded-3xl border border-border bg-surface/50 p-2 backdrop-blur"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-border bg-background"
              style={{ boxShadow: "0 0 60px -18px color-mix(in oklab, var(--cyan) 55%, transparent)" }}
            >
              <video
                className="aspect-video h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                src="/videos/form-coach.mp4"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />

              {/* HUD overlays */}
              <div
                className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
                style={{ transform: "translateZ(60px)" }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                live · back squat
              </div>

              <div
                className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4"
                style={{ transform: "translateZ(70px)" }}
              >
                <div className="rounded-2xl border border-border bg-background/75 px-4 py-3 backdrop-blur">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Form score</p>
                  <p className="font-display text-3xl font-semibold text-gradient">84/100</p>
                </div>
                <div className="flex gap-2">
                  {[
                    { k: "Depth", v: "Good" },
                    { k: "Tempo", v: "3-1-1" },
                    { k: "Reps", v: "07" },
                  ].map((c) => (
                    <div key={c.k} className="rounded-xl border border-border bg-background/75 px-3 py-2 text-center backdrop-blur">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{c.k}</p>
                      <p className="mt-0.5 text-sm font-medium">{c.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <Reveal>
            <div className="rounded-2xl border border-border bg-surface/50 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> what you're doing well
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Squat depth clears parallel on every rep.</li>
                <li>Torso angle stays stable through the ascent.</li>
                <li>Bar path is vertical within 2.1cm of mid-foot.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-accent/25 bg-lime-soft p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <AlertTriangle className="h-3.5 w-3.5" /> fix this first
              </p>
              <p className="mt-4 text-sm text-foreground/90">
                Your knees drift inward on reps 5–7. Cue: <em>screw your feet into the floor</em> and keep the knees tracking over the second toe.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Video, k: "5 exercises", v: "Squat, push-up, curl, press, deadlift" },
                { icon: Activity, k: "30 fps", v: "On-device pose tracking, no upload needed" },
              ].map((b) => (
                <div key={b.k} className="rounded-2xl border border-border bg-surface/50 p-5">
                  <b.icon className="h-4 w-4 text-cyan" />
                  <p className="mt-3 font-display text-base font-semibold">{b.k}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
