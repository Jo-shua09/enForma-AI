"use client";

import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

const metadata = {
  title: "Settings",
  description: "Manage your EnForma AI profile, goals and preferences.",
  openGraph: {
    description: "Profile, goals and app preferences.",
  },
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <AppShell title="Settings" subtitle="Demo account - nothing is stored on a server">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Profile</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="capitalize">{user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="text-cyan">Athlete (trial)</dd>
            </div>
          </dl>
          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="mt-6 rounded-xl border border-border bg-surface-2 px-4 py-2 text-xs"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Goals</p>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["Daily calories", "2,350 kcal"],
              ["Protein target", "175 g"],
              ["Training days", "5 per week"],
              ["Water goal", "3.0 L"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => toast("Goal editing is coming soon in this demo.")}
            className="mt-6 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            Edit goals
          </button>
        </div>
      </div>
    </AppShell>
  );
}
