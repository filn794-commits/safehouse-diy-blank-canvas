import { createFileRoute } from "@tanstack/react-router";
import { Award, Hammer, Droplet, Zap, Paintbrush, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Progress — SafeHouse DIY" },
      { name: "description", content: "Track your repair skills, XP, and badges as you grow." },
    ],
  }),
  component: Dashboard,
});

const badges = [
  { icon: Droplet, label: "Leak Stopper", earned: true, color: "bg-accent" },
  { icon: Paintbrush, label: "Patch Pro", earned: true, color: "bg-success" },
  { icon: Hammer, label: "Nail It", earned: true, color: "bg-primary" },
  { icon: Zap, label: "Spark Safe", earned: false, color: "bg-muted" },
  { icon: Lock, label: "Lockmaster", earned: false, color: "bg-muted" },
  { icon: Sparkles, label: "Helper", earned: false, color: "bg-muted" },
];

function Dashboard() {
  const xp = 350;
  const goal = 500;
  const pct = (xp / goal) * 100;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <p className="text-base font-bold uppercase tracking-wider text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl font-black">Maria</h1>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 text-3xl font-black">
            2
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-90">Your Rank</p>
            <p className="font-display text-2xl font-black leading-tight">Apprentice Fixer</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black">Your XP</h2>
          <p className="font-display text-2xl font-black text-primary">
            {xp}<span className="text-muted-foreground">/{goal}</span>
          </p>
        </div>
        <div className="mt-4 h-6 w-full overflow-hidden rounded-full border-2 border-border bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={goal}
          />
        </div>
        <p className="mt-3 text-base text-muted-foreground">
          <span className="font-bold text-foreground">{goal - xp} XP</span> until Level 3 — Handy Hero
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <h2 className="text-2xl font-black">Your Badges</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center ${
                  b.earned
                    ? "border-border bg-card"
                    : "border-dashed border-border bg-muted/40 opacity-60"
                }`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${b.color} ${b.earned ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold leading-tight">{b.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
