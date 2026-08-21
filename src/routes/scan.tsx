import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, MessageSquare, Send, Loader2, Wrench, ReceiptText } from "lucide-react";
import { matchFix, fixStore } from "@/lib/fix-store";
import { CameraCapture } from "@/components/CameraCapture";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "DIY Co-Pilot Scan — PocketPro AI" },
      { name: "description", content: "Scan a home problem or a contractor quote and get instant, plain-English guidance." },
      { property: "og:title", content: "DIY Co-Pilot Scan — PocketPro AI" },
      { property: "og:description", content: "Scan a home problem or a contractor quote and get instant, plain-English guidance." },
    ],
  }),
  component: ScanHub,
});

type Mode = "diy" | "quote";

function ScanHub() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("diy");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");

  const guessIssue = (t: string) => {
    const s = t.toLowerCase();
    if (/(ac|a\/c|air condition|hvac|cool)/.test(s)) return "ac-warm" as const;
    if (/(water heater|heater|hot water)/.test(s)) return "water-heater" as const;
    return "clogged-drain" as const;
  };

  const run = () => {
    if (analyzing) return;
    setAnalyzing(true);
    setTimeout(() => {
      if (mode === "quote") {
        const amount = Number(quoteAmount);
        navigate({
          to: "/scam-guard",
          search: {
            ...(Number.isFinite(amount) && amount > 0 ? { quote: Math.round(amount) } : {}),
            issue: guessIssue(text),
          },
        });
        return;
      }
      fixStore.setFix(matchFix(text), true);
      navigate({ to: "/fix" });
    }, 3000);
  };

  return (
    <div className="space-y-7">
      <div className="text-center">
        <h1 className="text-3xl font-black">DIY Co-Pilot</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Point your camera at the problem — or at the paperwork.
        </p>
      </div>

      {/* Massive camera action button */}
      <label
        className={`mx-auto flex aspect-square w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-4 rounded-[2.5rem] border-4 border-primary bg-primary text-primary-foreground shadow-[0_0_60px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-transform active:scale-[0.97] ${
          analyzing ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {analyzing ? (
          <>
            <Loader2 className="h-24 w-24 animate-spin" strokeWidth={2.5} />
            <span className="px-6 text-center text-xl font-black leading-tight">
              PocketPro AI is analyzing...
              <span className="mt-1 block text-base font-bold opacity-90">
                Checking local repair metrics
              </span>
            </span>
          </>
        ) : (
          <>
            <Camera className="h-28 w-28" strokeWidth={2.25} />
            <span className="px-6 text-center font-display text-3xl font-black uppercase leading-tight tracking-tight">
              Scan Problem
              <span className="block text-2xl">or Quote</span>
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          disabled={analyzing}
          onChange={(e) => {
            setFileName(e.target.files?.[0]?.name ?? null);
            run();
          }}
        />
      </label>

      {/* Segment toggle */}
      <div
        role="tablist"
        aria-label="Scan mode"
        className="grid grid-cols-2 gap-2 rounded-3xl border-2 border-border bg-card p-2"
      >
        {(
          [
            { id: "diy" as Mode, label: "DIY Fix It Myself", icon: Wrench },
            { id: "quote" as Mode, label: "Verify Contractor Quote", icon: ReceiptText },
          ]
        ).map((opt) => {
          const Icon = opt.icon;
          const active = mode === opt.id;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(opt.id)}
              className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-4 text-center text-base font-black leading-tight transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-7 w-7" strokeWidth={2.5} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {fileName && (
        <p className="rounded-xl bg-success/15 px-4 py-3 text-base font-bold text-success">
          ✓ Added: {fileName}
        </p>
      )}

      {mode === "quote" && (
        <section className="rounded-3xl border-2 border-primary bg-card p-5 shadow-sm">
          <label htmlFor="quote-amount" className="text-lg font-black">
            What did they quote you? ($)
          </label>
          <input
            id="quote-amount"
            type="number"
            inputMode="decimal"
            min={0}
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            placeholder="e.g. 450"
            disabled={analyzing}
            className="mt-3 w-full rounded-2xl border-2 border-input bg-background px-4 py-4 text-2xl font-black focus:border-primary focus:outline-none disabled:opacity-60"
          />
          <p className="mt-2 text-base text-muted-foreground">
            We'll run it against local fair-price ranges on the risk dial.
          </p>
        </section>
      )}

      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <label htmlFor="describe" className="flex items-center gap-2 text-lg font-black">
          <MessageSquare className="h-6 w-6 text-primary" strokeWidth={2.5} />
          Or describe it in your own words
        </label>
        <textarea
          id="describe"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="My kitchen sink is backing up with smelly water..."
          rows={4}
          disabled={analyzing}
          className="mt-3 w-full resize-none rounded-2xl border-2 border-input bg-background p-4 text-lg focus:border-primary focus:outline-none disabled:opacity-60"
        />
        <button
          onClick={run}
          disabled={
            analyzing ||
            (mode === "diy" ? text.trim().length === 0 : quoteAmount.trim().length === 0)
          }
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary px-6 py-4 text-lg font-black text-secondary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <Send className="h-5 w-5" strokeWidth={2.5} />
          {mode === "diy" ? "Get My Fix Guide" : "Verify This Quote"}
        </button>
      </section>
    </div>
  );
}
