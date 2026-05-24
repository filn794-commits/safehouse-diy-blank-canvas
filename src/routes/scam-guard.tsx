import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, DollarSign, Copy, Video, Check, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/scam-guard")({
  head: () => ({
    meta: [
      { title: "Scam Guard — SafeHouse DIY" },
      { name: "description", content: "Fair price estimates and what to say to your plumber." },
    ],
  }),
  component: ScamGuard,
});

const priceEstimate = {
  job: "Fix a Leaky Sink Drain",
  zip: "94110",
  low: 95,
  fair: 150,
  high: 240,
};

const script = `Hi, I have a leak at the slip nut under my kitchen sink. I'd like a flat-rate quote before any work begins. Please don't replace the whole P-trap unless you can show me it's cracked. My neighborhood's fair range for this job is $95 to $240. Can you confirm your price in writing?`;

function ScamGuard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <p className="text-base font-bold uppercase tracking-wider text-primary">Scam Guard</p>
        </div>
        <h1 className="mt-2 text-3xl font-black">Don't get overcharged.</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Fair local prices and exactly what to say. We've got your back.
        </p>
      </section>

      {/* Price gauge */}
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Price range in {priceEstimate.zip}
        </p>
        <p className="mt-1 font-display text-2xl font-black">{priceEstimate.job}</p>

        <div className="mt-5">
          <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-success via-warning to-destructive" />
          <div className="mt-3 flex justify-between text-base font-black">
            <div className="text-success">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Low</p>
              <p>${priceEstimate.low}</p>
            </div>
            <div className="text-center text-warning">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Fair</p>
              <p>${priceEstimate.fair}</p>
            </div>
            <div className="text-right text-destructive">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">High</p>
              <p>${priceEstimate.high}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-warning/15 p-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-warning" strokeWidth={2.5} />
          <p className="text-base font-bold">
            Anything over <span className="text-destructive">${priceEstimate.high}</span> is a red flag. Get a second quote.
          </p>
        </div>
      </section>

      {/* Script */}
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-black">What to tell the plumber</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Read this word-for-word. It works.
        </p>
        <blockquote className="mt-4 rounded-2xl border-l-4 border-primary bg-background p-5 text-lg leading-relaxed">
          {script}
        </blockquote>
        <button
          onClick={copy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-lg font-black text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          {copied ? <Check className="h-5 w-5" strokeWidth={3} /> : <Copy className="h-5 w-5" strokeWidth={2.5} />}
          {copied ? "Copied!" : "Copy Script"}
        </button>
      </section>

      {/* Mentor */}
      <a
        href="#mentor"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-4 rounded-3xl border-2 border-primary bg-primary p-5 text-primary-foreground shadow-lg"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
          <Video className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="font-display text-xl font-black leading-tight">Video Call a Mentor</p>
          <p className="text-sm opacity-90">Talk to a real person, free, in 5 minutes.</p>
        </div>
        <DollarSign className="h-5 w-5 opacity-0" />
      </a>
    </div>
  );
}
