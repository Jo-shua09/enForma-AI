"use client";
import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/sections";
import { Section, SectionHeading } from "@/components/landing/primitives";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Contact EnForma AI - talk to the team",
  description: "Questions about coaching seats, partnerships or support? Send the EnForma AI team a message.",
  openGraph: {
    title: "Contact - EnForma AI",
    description: "Reach the EnForma AI team about support or sales.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <main className="relative min-h-screen bg-background pt-28">
      <Navbar />
      <Section>
        <SectionHeading
          align="left"
          label="Contact"
          title="Talk to a human."
          description="Support, coaching seats or partnerships - we reply within one working day."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name || !form.email || !form.message) {
                toast.error("Please fill in every field.");
                return;
              }
              toast.success("Message sent - we'll be in touch shortly.");
              setForm({ name: "", email: "", message: "" });
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6"
          >
            {(
              [
                ["name", "Name", "Alex Carter"],
                ["email", "Email", "you@enforma.ai"],
              ] as const
            ).map(([k, l, p]) => (
              <label key={k} className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{l}</span>
                <input
                  value={form[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  placeholder={p}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan/50"
                />
              </label>
            ))}
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan/50"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" /> Send message
            </button>
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface/40 p-6">
              <Mail className="h-4 w-4 text-cyan" />
              <p className="mt-3 text-sm">hello@enforma.ai</p>
              <p className="text-xs text-muted-foreground">General & support</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface/40 p-6">
              <MapPin className="h-4 w-4 text-accent" />
              <p className="mt-3 text-sm">Remote-first · Global Reach</p>
              <p className="text-xs text-muted-foreground">Mon–Fri, 09:00–18:00 CET</p>
            </div>
          </div>
        </div>
      </Section>
      <Footer />
    </main>
  );
}
