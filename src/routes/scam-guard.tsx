import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Copy,
  Video,
  Check,
  AlertTriangle,
  ChevronDown,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/scam-guard")({
  head: () => ({
    meta: [
      { title: "Scam Guard — SafeHouse DIY" },
      { name: "description", content: "Fair price estimates and what to say to your contractor." },
    ],
  }),
  component: ScamGuard,
});

type IssueId = "clogged-drain" | "water-heater" | "ac-warm";

type Issue = {
  id: IssueId;
  label: string;
  emoji: string;
  averageLow: number;
  averageHigh: number;
  dangerOver: number;
  script: string;
  tips: string[];
};

const ISSUES: Record<IssueId, Issue> = {
  "clogged-drain": {
    id: "clogged-drain",
    label: "Clogged Main Drain",
    emoji: "🚿",
    averageLow: 175,
    averageHigh: 300,
    dangerOver: 350,
    script:
      "Hi, I have a standard 3-inch mainline backup. I need a straightforward mainline snake clearing. Please confirm your flat fee for this service before sending a technician.",
    tips: [
      "Refuse a 'camera inspection upsell' before the snake is even tried.",
      "Get the flat fee in writing by text before they arrive.",
    ],
  },
  "water-heater": {
    id: "water-heater",
    label: "Leaking Water Heater",
    emoji: "🔥",
    averageLow: 220,
    averageHigh: 450,
    dangerOver: 600,
    script:
      "Hi, I have a 40-gallon water heater with a visible leak. I need a diagnostic visit with a written quote before any repair or replacement. Please confirm your diagnostic fee and that it will be credited toward the repair.",
    tips: [
      "Don't agree to full replacement without a second opinion.",
      "Ask the age of the unit — if under 8 years, repair is usually fine.",
    ],
  },
  "ac-warm": {
    id: "ac-warm",
    label: "AC Blowing Warm Air",
    emoji: "❄️",
    averageLow: 150,
    averageHigh: 400,
    dangerOver: 500,
    script:
      "Hi, my central AC is running but blowing warm air. I need a standard diagnostic visit with a written quote before any refrigerant is added or parts are replaced. Please confirm your diagnostic fee in writing.",
    tips: [
      "Never approve refrigerant top-off without finding the leak first.",
      "Reject 'whole system replacement' pitches on the first visit.",
    ],
  },
};

const ISSUE_LIST = Object.values(ISSUES);

function ScamGuard() {
  const [issueId, setIssueId] = useState<IssueId>("clogged-drain");
  const [copied, setCopied] = useState(false);
  const issue = ISSUES[issueId];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issue.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <p className="text-base font-bold uppercase tracking-wider text-primary">Scam Guard</p>
        </div>
        <h1 className="mt-2 text-3xl font-black">Don't get overcharged.</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pick your problem. We'll show you a fair price and exactly what to say.
        </p>
      </section>

      {/* Issue picker */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <label
          htmlFor="issue"
          className="text-sm font-black uppercase tracking-wider text-muted-foreground"
        >
          What's the problem?
        </label>
        <div className="relative mt-2">
          <select
            id="issue"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value as IssueId)}
            className="w-full appearance-none rounded-2xl border-2 border-input bg-background py-5 pl-5 pr-14 text-xl font-black text-foreground shadow-sm focus:border-primary focus:outline-none"
          >
            {ISSUE_LIST.map((i) => (
              <option key={i.id} value={i.id}>
                {i.emoji}  {i.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-5 top-1/2 h-7 w-7 -translate-y-1/2 text-primary"
            strokeWidth={3}
          />
        </div>
      </section>

      {/* Fair Price Tracker */}
      <section
        key={issue.id + "-price"}
        className="rounded-3xl border-2 border-primary bg-card p-6 shadow-lg animate-fade-in"
      >
        <p className="text-sm font-black uppercase tracking-widest text-primary">
          Fair Price Tracker
        </p>
        <p className="mt-1 font-display text-2xl font-black leading-tight">
          {issue.emoji} {issue.label}
        </p>

        <div className="mt-5 rounded-2xl bg-success/15 p-5">
          <p className="text-base font-black uppercase tracking-wider text-success">
            Average Cost
          </p>
          <p className="mt-1 font-display text-4xl font-black text-success">
            ${issue.averageLow}<span className="text-2xl"> – </span>${issue.averageHigh}
          </p>
          <p className="mt-2 text-base font-bold text-foreground">
            This is the fair range in your area.
          </p>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-destructive/15 p-5">
          <AlertTriangle
            className="mt-1 h-7 w-7 shrink-0 text-destructive"
            strokeWidth={2.5}
          />
          <div>
            <p className="text-base font-black uppercase tracking-wider text-destructive">
              Danger Zone
            </p>
            <p className="mt-1 font-display text-2xl font-black leading-tight text-destructive">
              Over ${issue.dangerOver} is a scam.
            </p>
            <p className="mt-1 text-base font-bold">
              Hang up politely and call a different company.
            </p>
          </div>
        </div>

        {/* Visual range */}
        <div className="mt-5">
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-success via-warning to-destructive" />
          <div className="mt-2 flex justify-between text-sm font-black">
            <span className="text-success">FAIR</span>
            <span className="text-warning">CAUTION</span>
            <span className="text-destructive">SCAM</span>
          </div>
        </div>
      </section>

      {/* Contractor Script */}
      <section
        key={issue.id + "-script"}
        className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm animate-fade-in"
      >
        <div className="flex items-center gap-2">
          <Phone className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <h2 className="text-xl font-black">Contractor Script</h2>
        </div>
        <p className="mt-1 text-base text-muted-foreground">
          Read this word-for-word when they pick up.
        </p>

        <div className="mt-4 rounded-2xl border-l-[6px] border-primary bg-background p-5">
          <p className="text-sm font-black uppercase tracking-wider text-primary">
            Tell the dispatcher:
          </p>
          <p className="mt-3 text-2xl font-bold leading-relaxed text-foreground">
            "{issue.script}"
          </p>
        </div>

        <button
          onClick={copy}
          aria-live="polite"
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-5 text-xl font-black shadow-sm transition-all active:scale-[0.98] ${
            copied
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-6 w-6" strokeWidth={3} /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-6 w-6" strokeWidth={2.5} /> Copy Script
            </>
          )}
        </button>

        {/* Tips */}
        <div className="mt-5 space-y-2">
          <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Watch out for
          </p>
          {issue.tips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-3 rounded-xl bg-warning/15 p-3"
            >
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-warning"
                strokeWidth={2.5}
              />
              <p className="text-base font-bold leading-snug">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor */}
      <Link
        to="/mentor"
        className="flex items-center gap-4 rounded-3xl border-2 border-primary bg-primary p-5 text-primary-foreground shadow-lg transition-transform active:scale-[0.99]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
          <Video className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="font-display text-xl font-black leading-tight">
            Video Call a Mentor
          </p>
          <p className="text-sm opacity-90">
            Nervous? Talk to a real person in under a minute.
          </p>
        </div>
      </Link>
    </div>
  );
}
