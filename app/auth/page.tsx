import type { Metadata } from "next";
import { AuthForm } from "./auth-form";

const metadata: Metadata = {
  title: "Sign in or create your EnForma AI account",
  description: "Access your EnForma AI coach - meal scans, adaptive training plans, camera form analysis and habit streaks.",
  openGraph: {
    title: "Sign in - EnForma AI",
    description: "Create an EnForma AI account and start training with an AI coach today.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function AuthPage() {
  return <AuthForm />;
}
