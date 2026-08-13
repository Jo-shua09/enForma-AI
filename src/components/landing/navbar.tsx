"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

const AnimatedHamburgerButton = ({ open, onClick }: { open: boolean; onClick: () => void }) => {
  const topVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 5.5 },
  };
  const middleVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  const bottomVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -5.5 },
  };

  return (
    <button aria-label="Toggle menu" onClick={onClick} className="grid h-9 w-9 place-items-center rounded-lg border border-border lg:hidden">
      <motion.div className="flex h-4 w-4 flex-col items-center justify-between">
        <motion.span
          variants={topVariants}
          animate={open ? "open" : "closed"}
          className="block h-px w-full bg-foreground"
          style={{ transformOrigin: "center" }}
        />
        <motion.span variants={middleVariants} animate={open ? "open" : "closed"} className="block h-px w-full bg-foreground" />
        <motion.span variants={bottomVariants} animate={open ? "open" : "closed"} className="block h-px w-full bg-foreground" />
      </motion.div>
    </button>
  );
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Next.js hook to get current path for active links

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "w-full max-w-7xl rounded-2xl border border-transparent px-4 py-3 transition-all duration-300",
          scrolled || open ? "glass border-border shadow-2xl" : "bg-transparent",
        )}
      >
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="">
            <Image src="/logo.png" alt="EnForma AI Logo" width={104} height={104} className="h-full w-full object-contain p-1" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                  pathname === l.to && "bg-surface-2 text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                  className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sign in
                </Link>
                <Link
                  href="/auth"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  Start free
                </Link>
              </>
            )}
          </div>

          <AnimatedHamburgerButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, ease: "easeOut" }}
                  >
                    <Link
                      href={l.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: "easeOut" }}>
                  <Link
                    href={user ? "/dashboard" : "/auth"}
                    onClick={() => setOpen(false)}
                    className="mt-2 block rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                  >
                    {user ? "Go to dashboard" : "Start free"}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
