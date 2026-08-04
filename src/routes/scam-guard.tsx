import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Copy,
  Video,
  Check,
  AlertTriangle,
  ChevronDown,
  Phone,
  Gauge,
} from "lucide-react";

export const Route = createFileRoute("/scam-guard")({
  head: () => ({
    meta: [
      { title: "Liar Detector — PocketPro AI" },
      { name: "description", content: "Scam & price risk meter for contractor quotes, with Phoenix-area labor rates and word-for-word phone scripts." },
      { property: "og:title", content: "Liar Detector — PocketPro AI" },
      { property: "og:description", content: "Scam & price risk meter for contractor quotes, with Phoenix-area labor rates and word-for-word phone scripts." },
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
  breakdown: string[];
};

const ISSUES: Record<IssueId, Issue> = {
  "clogged-drain": {
    id: "clogged-drain",
    label: "Clogged Main Drain",
    emoji: "🚿",
    averageLow: 150,
    averageHigh: 300,
    dangerOver: 350,
    script:
      "Hi, I have a standard 3-inch mainline backup. I need a straightforward mainline snake clearing. Please confirm your flat fee for this service before sending a technician.",
    tips: [
      "Refuse a 'camera inspection upsell' before the snake is even tried.",
      "Get the flat fee in writing by text before they arrive.",
    ],
    breakdown: [
      "Phoenix trip / dispatch fee: $59 - $89 (often waived with repair)",
      "Standard labor rate: $95 - $135 per hour",
      "Typical job time: 1 - 1.5 hours",
      "Snake / cable equipment: included in flat fee",
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
    breakdown: [
      "Phoenix trip / diagnostic fee: $75 - $99",
      "Standard labor rate: $110 - $150 per hour",
      "Typical job time: 2 - 3 hours",
      "Common parts (T&P valve, element): $25 - $90",
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
    breakdown: [
      "Phoenix trip / diagnostic fee: $69 - $99 (higher in July/August)",
      "Standard labor rate: $100 - $145 per hour",
      "Typical job time: 1 - 2 hours",
      "Capacitor replacement: $150 - $250 installed",
    ],
  },
};

const ISSUE_LIST = Object.values(ISSUES);

type Risk = "green" | "yellow" | "red";

function riskOf(quote: number, issue: Issue): Risk {
  if (quote <= issue.averageHigh) return "green";
  if (quote < issue.dangerOver) return "yellow";
  return "red";
}

const RISK_META: Record<Risk, { label: string; token: string; blurb: string }> = {
  green: {
    label: "Fair Deal",
    token: "var(--success)",
    blurb: "This quote sits inside the normal local range. Safe to book.",
  },
  yellow: {
    label: "Get a Second Opinion",
    token: "var(--warning)",
    blurb: "Above typical. Call one more company before you say yes.",
  },
  red: {
    label: "High Scam Risk",
    token: "var(--destructive)",
    blurb: "Well over fair market. Do not approve this work today.",
  },
};

/** Radial gauge: 180° dial, needle animates to the quote position. */
function RiskDial({ quote, issue }: { quote: number; issue: Issue }) {
  const risk = riskOf(quote, issue);
  const meta = RISK_META[risk];
  const max = issue.dangerOver * 1.6;
  const ratio = Math.max(0, Math.min(1, quote / max));
  const angle = -90 + ratio * 180;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-sm" role="img" aria-label={`Risk: ${meta.label}`}>
        {[
          { from: 0, to: issue.averageHigh / max, color: "var(--success)" },
          { from: issue.averageHigh / max, to: issue.dangerOver / max, color: "var(--warning)" },
          { from: issue.dangerOver / max, to: 1, color: "var(--destructive)" },
        ].map((seg, i) => {
          const a0 = Math.PI - seg.from * Math.PI;
          const a1 = Math.PI - seg.to * Math.PI;
          const r = 82;
          const x0 = 100 + r * Math.cos(a0);
          const y0 = 100 - r * Math.sin(a0);
          const x1 = 100 + r * Math.cos(a1);
          const y1 = 100 - r * Math.sin(a1);
          return (
            <path
              key={i}
              d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
              stroke={seg.color}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              opacity={risk === (["green", "yellow", "red"] as Risk[])[i] ? 1 : 0.28}
            />
          );
        })}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 900ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <line x1="100" y1="100" x2="100" y2="30" stroke={meta.token} strokeWidth="6" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="10" fill={meta.token} />
      </svg>

      <p
        className="mt-2 font-display text-3xl font-black uppercase tracking-tight"
        style={{ color: meta.token }}
      >
        {meta.label}
      </p>
      <p className="mt-1 text-center text-lg font-bold text-muted-foreground">{meta.blurb}</p>
    </div>
  );
}

function ScamGuard() {
  const [issueId, setIssueId] = useState<IssueId>("clogged-drain");
  const [quote, setQuote] = useState(275);
  const [copied, setCopied] = useState(false);
  const issue = ISSUES[issueId];
  const risk = useMemo(() => riskOf(quote, issue), [quote, issue]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issue.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="flex items-center gap-2 text-base font-black uppercase tracking-wider text-primary">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.5} /> Liar Detector
        </p>
        <h1 className="mt-1 text-3xl font-black">Scam &amp; Price Risk Meter</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Calibrated to standard Phoenix-area repair labor rates.
        </p>
      </section>

      {/* Issue picker */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <label htmlFor="issue" className="text-lg font-black">
          What is the job?
        </label>
        <div className="relative mt-3">
          <select
            id="issue"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value as IssueId)}
            className="w-full appearance-none rounded-2xl border-2 border-input bg-background px-4 py-4 pr-12 text-lg font-black focus:border-primary focus:outline-none"
          >
            {ISSUE_LIST.map((i) => (
              <option key={i.id} value={i.id}>
                {i.emoji} {i.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" strokeWidth={2.5} />
        </div>

        <label htmlFor="quote" className="mt-5 block text-lg font-black">
          Their quote: <span className="text-primary">${quote}</span>
        </label>
        <input
          id="quote"
          type="range"
          min={50}
          max={Math.round(issue.dangerOver * 1.6)}
          step={5}
          value={quote}
          onChange={(e) => setQuote(Number(e.target.value))}
          className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
        />
      </section>

      {/* Gauge */}
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-black">
          <Gauge className="h-6 w-6 text-primary" strokeWidth={2.5} />
          Risk Dial
        </h2>
        <RiskDial quote={quote} issue={issue} />
      </section>

      {/* Fair price + breakdown */}
      <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <p className="text-base font-bold uppercase tracking-wider text-muted-foreground">
          Average Fair Price Range
        </p>
        <p className="mt-1 font-display text-4xl font-black text-success">
          ${issue.averageLow} - ${issue.averageHigh}
        </p>
        <p className="mt-2 flex items-center gap-2 text-lg font-black text-destructive">
          <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
          Danger zone: over ${issue.dangerOver} is a scam
        </p>

        <h3 className="mt-5 text-lg font-black">Phoenix area breakdown</h3>
        <ul className="mt-3 space-y-2">
          {issue.breakdown.map((b) => (
            <li key={b} className="flex gap-3 text-lg font-bold leading-snug">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* Script */}
      <section className="rounded-3xl border-2 border-primary bg-card p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <Phone className="h-6 w-6 text-primary" strokeWidth={2.5} />
          What to tell the contractor
        </h2>
        <p className="mt-3 rounded-2xl bg-background p-5 text-2xl font-black leading-snug">
          “{issue.script}”
        </p>
        <button
          onClick={copy}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-lg font-black text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {copied ? <Check className="h-6 w-6" strokeWidth={3} /> : <Copy className="h-6 w-6" strokeWidth={2.5} />}
          {copied ? "Copied!" : "Copy this script"}
        </button>
        <ul className="mt-4 space-y-2">
          {issue.tips.map((t) => (
            <li key={t} className="flex gap-3 text-base font-bold text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {risk !== "green" && (
        <p className="rounded-2xl border-2 border-warning bg-warning/15 p-5 text-lg font-black">
          Tip: say “That's above the local average of ${issue.averageLow}–${issue.averageHigh}. Can you
          explain the difference in writing?”
        </p>
      )}

      <Link
        to="/mentor"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-success px-6 py-5 text-xl font-black text-success-foreground shadow-lg transition-transform active:scale-[0.98]"
      >
        <Video className="h-7 w-7" strokeWidth={2.5} />
        Video Call a Mentor
      </Link>
    </div>
  );
}
