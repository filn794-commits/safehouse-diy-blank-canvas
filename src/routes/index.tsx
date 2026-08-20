import { createFileRoute } from "@tanstack/react-router";
import { Award, Hammer, Droplet, Zap, Paintbrush, Lock, Sparkles, Wrench } from "lucide-react";
import { useProgress, type BadgeId } from "@/lib/progress-store";
import { useUser } from "@/hooks/use-user";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Progress — PocketPro AI" },
      { name: "description", content: "Track your repair skills, XP, and badges as you grow." },
    ],
  }),
  component: Dashboard,
});

type Badge = { id: BadgeId; icon: typeof Droplet; label: string; color: string };

const badges: Badge[] = [
  { id: "leak-stopper", icon: Droplet, label: "Leak Stopper", color: "bg-accent" },
  { id: "patch-pro", icon: Paintbrush, label: "Patch Pro", color: "bg-success" },
  { id: "nail-it", icon: Hammer, label: "Nail It", color: "bg-primary" },
  { id: "master-plumber", icon: Wrench, label: "Master Plumber", color: "bg-primary" },
  { id: "spark-safe", icon: Zap, label: "Spark Safe", color: "bg-warning" },
  { id: "lockmaster", icon: Lock, label: "Lockmaster", color: "bg-accent" },
  { id: "helper", icon: Sparkles, label: "Helper", color: "bg-success" },
];

function Dashboard() {
  const { xp, goal, unlocked, level, rankName, lastGain } = useProgress();
  const user = useUser();
  const pct = Math.min(100, (xp / goal) * 100);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-primary bg-primary/15 font-display text-xl font-black text-primary"
          >
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold uppercase tracking-wider text-muted-foreground">
              Welcome back, {user.displayName}
            </p>
            {user.email ? (
              <p className="truncate font-mono text-xs text-muted-foreground">{user.email}</p>
            ) : (
              <Link to="/auth" search={{ next: "/" }} className="font-mono text-xs text-primary underline">
                Sign in to save your progress
              </Link>
            )}
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-black">What are we tackling today?</h1>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 text-3xl font-black">
            {level}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-90">Your Rank</p>
            <p className="font-display text-2xl font-black leading-tight">{rankName}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black">Your XP</h2>
          <p className="relative font-display text-2xl font-black text-primary">
            {xp}<span className="text-muted-foreground">/{goal}</span>
            {lastGain && (
              <span
                key={lastGain.id}
                className="pointer-events-none absolute -top-6 right-0 rounded-full bg-success px-2 py-0.5 text-sm font-black text-success-foreground animate-xp-pop"
              >
                +{lastGain.amount} XP
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 h-6 w-full overflow-hidden rounded-full border-2 border-border bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={goal}
          />
        </div>
        <p className="mt-3 text-base text-muted-foreground">
          {xp >= goal ? (
            <span className="font-bold text-success">Max level reached. You're amazing!</span>
          ) : (
            <>
              <span className="font-bold text-foreground">{goal - xp} XP</span> until next level
            </>
          )}
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
            const earned = unlocked.has(b.id);
            return (
              <div
                key={b.id}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-500 ${
                  earned
                    ? "border-border bg-card animate-scale-in"
                    : "border-dashed border-border bg-muted/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                    earned ? `${b.color} text-primary-foreground` : "bg-muted text-muted-foreground"
                  }`}
                >
                  {earned ? (
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                  ) : (
                    <Lock className="h-6 w-6" strokeWidth={2.5} />
                  )}
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
