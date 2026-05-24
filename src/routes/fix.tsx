import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Wrench, ShieldAlert, Trophy, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/fix")({
  head: () => ({
    meta: [
      { title: "Your Fix Guide — SafeHouse DIY" },
      { name: "description", content: "A simple step-by-step guide tailored to your repair." },
    ],
  }),
  component: FixView,
});

// Simulated AI response
const aiFix = {
  title: "Fix a Dripping Sink Drain",
  difficulty: 2,
  estimatedTime: "20 minutes",
  tools: [
    { name: "Adjustable Wrench", emoji: "🔧" },
    { name: "Bucket", emoji: "🪣" },
    { name: "Old Towel", emoji: "🧻" },
    { name: "Plumber's Tape", emoji: "🩹" },
  ],
  steps: [
    "Clear everything from under the sink and put a bucket below the pipes.",
    "Turn off the water using the valves under the sink (turn clockwise).",
    "Unscrew the slip nut on the leaking joint by hand or with the wrench.",
    "Wrap plumber's tape clockwise around the threads (3 turns).",
    "Tighten the nut back on — snug, but don't overtighten.",
    "Turn the water back on and watch for drips. You did it!",
  ],
};

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
  const [checked, setChecked] = useState<boolean[]>(() => aiFix.steps.map(() => false));
  const completedCount = useMemo(() => checked.filter(Boolean).length, [checked]);
  const totalXp = completedCount * 20;
  const allDone = completedCount === aiFix.steps.length;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

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

      {/* XP tracker */}
      <section className="flex items-center gap-4 rounded-3xl border-2 border-primary bg-primary/10 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Trophy className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">XP Earned</p>
          <p className="font-display text-2xl font-black">
            +{totalXp} XP <span className="text-base font-bold text-muted-foreground">(+20 per step)</span>
          </p>
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
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    isChecked
                      ? "border-success bg-success/10"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-black transition-colors ${
                      isChecked
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {isChecked ? <Check className="h-6 w-6" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`text-lg leading-snug ${isChecked ? "line-through opacity-70" : ""}`}>
                    {step}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {allDone && (
        <div className="rounded-3xl border-2 border-success bg-success/15 p-6 text-center">
          <p className="text-4xl">🎉</p>
          <p className="mt-2 font-display text-2xl font-black">You fixed it!</p>
          <p className="mt-1 text-base text-muted-foreground">+{totalXp} XP added to your profile.</p>
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
