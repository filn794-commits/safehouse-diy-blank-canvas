import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Wrench, ShieldAlert, Trophy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useProgress, progressStore } from "@/lib/progress-store";
import { useFix, fixStore } from "@/lib/fix-store";

export const Route = createFileRoute("/fix")({
  head: () => ({
    meta: [
      { title: "Your Fix Guide — PocketPro AI" },
      { name: "description", content: "A simple step-by-step guide tailored to your repair." },
    ],
  }),
  component: FixView,
});

const XP_PER_STEP = 20;

function DifficultyGauge({ level }: { level: number }) {
  const labels = ["", "Super Easy", "Easy", "Moderate", "Tricky", "Pro Level"];
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Difficulty</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-display text-2xl font-black">{labels[level]}</p>
        <p className="text-lg font-bold text-muted-foreground">{level}/5</p>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-3 flex-1 rounded-full ${
              n <= level
                ? level <= 2
                  ? "bg-success"
                  : level <= 3
                  ? "bg-warning"
                  : "bg-destructive"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FixView() {
  const { xp, goal } = useProgress();
  const { fix: aiFix, justAnalyzed } = useFix();
  // Track which steps have already awarded XP (only award on first check).
  const [checked, setChecked] = useState<boolean[]>(() => aiFix.steps.map(() => false));
  const [awarded, setAwarded] = useState<boolean[]>(() => aiFix.steps.map(() => false));
  const [bumpKey, setBumpKey] = useState(0);

  // Reset checklist whenever the fix changes (e.g. new AI analysis).
  useEffect(() => {
    setChecked(aiFix.steps.map(() => false));
    setAwarded(aiFix.steps.map(() => false));
    setBumpKey((k) => k + 1);
  }, [aiFix]);

  // Show analysis-complete toast once when arriving from Scan Hub.
  useEffect(() => {
    if (!justAnalyzed) return;
    const totalXp = aiFix.steps.length * XP_PER_STEP;
    toast.success("Analysis Complete!", {
      description: `Your Dashboard has been updated. Complete this fix to earn +${totalXp} total XP!`,
      duration: 6000,
    });
    fixStore.clearJustAnalyzed();
  }, [justAnalyzed, aiFix]);

  const sessionXp = useMemo(() => awarded.filter(Boolean).length * XP_PER_STEP, [awarded]);
  const allDone = checked.length > 0 && checked.every(Boolean);
  const pct = Math.min(100, (xp / goal) * 100);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !prev[i];
      return next;
    });
    // Only add XP the first time a step is checked (don't subtract when unchecked).
    if (!checked[i] && !awarded[i]) {
      progressStore.addXp(XP_PER_STEP);
      setAwarded((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
      setBumpKey((k) => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="text-base font-bold uppercase tracking-wider text-primary">Your Fix</p>
        <h1 className="mt-1 text-3xl font-black">{aiFix.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          About {aiFix.estimatedTime}. You can do this.
        </p>
      </section>

      <DifficultyGauge level={aiFix.difficulty} />

      {/* Tools */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <h2 className="text-xl font-black">What you'll need</h2>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {aiFix.tools.map((t) => (
            <li
              key={t.name}
              className="flex items-center gap-3 rounded-2xl border-2 border-border bg-background p-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl">
                {t.emoji}
              </span>
              <span className="text-base font-bold leading-tight">{t.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Live XP tracker */}
      <section className="sticky top-[88px] z-30 rounded-3xl border-2 border-primary bg-primary/10 p-5 shadow-md backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Trophy className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Your XP</p>
            <p className="font-display text-2xl font-black leading-tight">
              {xp}<span className="text-muted-foreground">/{goal}</span>
              {sessionXp > 0 && (
                <span
                  key={bumpKey}
                  className="ml-2 inline-block rounded-full bg-success px-3 py-0.5 text-base font-black text-success-foreground animate-scale-in"
                >
                  +{sessionXp}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-3 h-4 w-full overflow-hidden rounded-full border-2 border-border bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="mb-4 text-2xl font-black">Step by step</h2>
        <ol className="space-y-3">
          {aiFix.steps.map((step, i) => {
            const isChecked = checked[i];
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  aria-pressed={isChecked}
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    isChecked
                      ? "border-success bg-success/10"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-black transition-colors ${
                      isChecked
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {isChecked ? (
                      <Check
                        key={`check-${i}-${awarded[i] ? "done" : "fresh"}`}
                        className="h-6 w-6 animate-scale-in"
                        strokeWidth={3}
                      />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-lg leading-snug ${
                        isChecked ? "line-through opacity-70" : ""
                      }`}
                    >
                      {step}
                    </span>
                    {isChecked && awarded[i] && (
                      <span className="mt-1 inline-block rounded-full bg-success/20 px-2.5 py-0.5 text-sm font-black text-success animate-fade-in">
                        +{XP_PER_STEP} XP
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {allDone && (
        <div className="rounded-3xl border-2 border-success bg-success/15 p-6 text-center animate-fade-in">
          <p className="text-4xl">🎉</p>
          <p className="mt-2 font-display text-2xl font-black">You fixed it!</p>
          <p className="mt-1 text-base text-muted-foreground">
            +{sessionXp} XP added to your profile.
          </p>
        </div>
      )}

      <Link
        to="/scam-guard"
        className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card px-5 py-4 text-lg font-black shadow-sm"
      >
        <span className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-primary" strokeWidth={2.5} />
          Not comfortable? Check Scam Guard
        </span>
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
