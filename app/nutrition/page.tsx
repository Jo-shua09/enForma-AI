"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/app-shell";
import { Apple, Camera, Flame, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { analyzeMealAction, saveMealAction, getRecentMealsAction, deleteMealAction } from "@/actions/nutrition";

type Meal = {
  id: string;
  image_url: string;
  food_items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: string;
};

export default function NutritionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanResult, setScanResult] = useState<Partial<Meal> | null>(null);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);

  useEffect(() => {
    async function loadMeals() {
      const res = await getRecentMealsAction();
      if (res.success && res.meals) {
        setRecentMeals(res.meals);
      }
    }
    loadMeals();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
  };

  const triggerScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    const res = await analyzeMealAction(formData);
    setIsScanning(false);

    if (res.success && res.data) {
      setScanResult(res.data);
      toast.success("Meal analyzed successfully!");
    } else {
      toast.error(res.error || "Failed to analyze meal.");
    }
  };

  const handleSaveMeal = async () => {
    if (!scanResult || !selectedFile) return;

    setIsSaving(true);
    const toastId = toast.loading("Saving to journal...");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("macros", JSON.stringify(scanResult));

    const res = await saveMealAction(formData);
    setIsSaving(false);

    if (res.success && res.meal) {
      setRecentMeals([res.meal, ...recentMeals]);
      handleReset();
      toast.success("Meal logged to your journal.", { id: toastId });
    } else {
      toast.error(res.error || "Failed to save meal.", { id: toastId });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteMeal = async (id: string) => {
    const toastId = toast.loading("Deleting meal...");
    const res = await deleteMealAction(id);

    if (res.success) {
      setRecentMeals((prev) => prev.filter((meal) => meal.id !== id));
      toast.success("Meal deleted.", { id: toastId });
    } else {
      toast.error("Failed to delete meal.", { id: toastId });
    }
  };

  return (
    <AppShell title="Nutrition" subtitle="Scan your meals to track macros instantly.">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface/40 p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">AI Meal Scanner</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Upload or take a photo of your food to get a macro breakdown.</p>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background/50 transition-colors hover:border-cyan/50 hover:bg-surface-2/50"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-cyan">
                  <Camera className="h-6 w-6" />
                </div>
                <p className="mt-4 font-medium text-foreground">Tap to scan meal</p>
                <p className="mt-1 text-xs text-muted-foreground">Supports JPG, PNG, HEIC</p>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
                <img src={previewUrl} alt="Meal preview" className="h-64 w-full object-cover opacity-90" />

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <button
                  onClick={handleReset}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-background/50 text-foreground backdrop-blur hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {!scanResult && !isScanning && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <button
                      onClick={triggerScan}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-xl transition-transform hover:scale-105"
                    >
                      <ScanIcon className="h-4 w-4" /> Analyze Macros
                    </button>
                  </div>
                )}

                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-cyan glow-cyan">AI is scanning...</p>
                  </div>
                )}
              </div>
            )}

            {scanResult && (
              <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="grid grid-cols-4 gap-3">
                  <MacroCard
                    label="Calories"
                    value={`${scanResult.calories ?? 0}`}
                    unit="kcal"
                    icon={<Flame className="h-3 w-3 text-orange-500" />}
                  />
                  <MacroCard
                    label="Protein"
                    value={`${scanResult.protein ?? 0}`}
                    unit="g"
                    icon={<div className="h-3 w-3 rounded-full bg-blue-500" />}
                  />
                  <MacroCard label="Carbs" value={`${scanResult.carbs ?? 0}`} unit="g" icon={<div className="h-3 w-3 rounded-full bg-green-500" />} />
                  <MacroCard label="Fats" value={`${scanResult.fats ?? 0}`} unit="g" icon={<div className="h-3 w-3 rounded-full bg-yellow-500" />} />
                </div>

                <div className="mt-6 rounded-xl border border-border bg-background/50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Detected Items</p>
                  <ul className="mt-3 space-y-2">
                    {scanResult.food_items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    disabled={isSaving}
                    className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2/60 disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveMeal}
                    disabled={isSaving}
                    className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-80 disabled:hover:scale-100"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save to Journal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Recent Logs</h2>
              <span className="font-mono text-xs text-muted-foreground">{recentMeals.length} meals</span>
            </div>

            {recentMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Apple className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">No meals logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="group relative flex items-start gap-4 rounded-2xl border border-border bg-background p-3 transition-colors hover:border-border/80"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image src={meal.image_url} alt="Meal" fill className="object-cover" sizes="64px" />
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between pr-6">
                        <p className="truncate text-sm font-medium text-foreground">
                          {meal.food_items?.[0]} {meal.food_items?.length > 1 && `+${meal.food_items.length - 1}`}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Flame className="h-3 w-3 text-orange-500" /> {meal.calories}
                        </span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fats}g</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="absolute right-3 top-3 hidden h-7 w-7 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground group-hover:grid md:grid lg:hidden"
                      title="Delete meal"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function MacroCard({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background/50 p-3 text-center">
      <div className="mb-2">{icon}</div>
      <p className="font-display text-lg font-semibold tracking-tight">
        {value}
        <span className="text-[10px] text-muted-foreground ml-0.5">{unit}</span>
      </p>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}
