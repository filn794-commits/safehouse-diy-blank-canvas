import { useProgress, progressStore } from "@/lib/progress-store";
import { PartyPopper, Sparkles } from "lucide-react";
import { useEffect } from "react";

export function LevelUpOverlay() {
  const { leveledUp, level, rankName } = useProgress();

  useEffect(() => {
    if (!leveledUp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") progressStore.dismissLevelUp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leveledUp]);

  if (!leveledUp) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 px-5 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-primary bg-card p-8 text-center shadow-2xl animate-scale-in">
        {/* Confetti-ish sparkles */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute h-5 w-5 text-accent animate-pulse"
              style={{
                top: `${(i * 37) % 90}%`,
                left: `${(i * 53) % 90}%`,
                animationDelay: `${i * 120}ms`,
              }}
              strokeWidth={2.5}
            />
          ))}
        </div>

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <PartyPopper className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <p className="mt-5 text-base font-bold uppercase tracking-widest text-primary">
            Level {level} Unlocked
          </p>
          <h2 id="levelup-title" className="mt-2 font-display text-4xl font-black leading-tight">
            Level Up!
          </h2>
          <p className="mt-3 text-xl font-bold">
            You are now a <span className="text-primary">{rankName}!</span> 🛠️
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            You've earned a brand-new badge for your trophy cabinet.
          </p>

          <button
            onClick={() => progressStore.dismissLevelUp()}
            className="mt-6 w-full rounded-2xl bg-primary px-6 py-5 text-xl font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
          >
            See My New Badge
          </button>
        </div>
      </div>
    </div>
  );
}
