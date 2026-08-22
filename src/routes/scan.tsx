import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Phone,
  RotateCcw,
  ShieldAlert,
  Wrench,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  questionsFor,
  triage,
  type Answers,
  type CategoryId,
  type Outcome,
} from "@/lib/triage";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Safety Check & Triage — PocketPro AI" },
      {
        name: "description",
        content:
          "Answer a few plain-language safety questions about your home problem and get one clear, deterministic next step.",
      },
      { property: "og:title", content: "Safety Check & Triage — PocketPro AI" },
      {
        property: "og:description",
        content:
          "Answer a few plain-language safety questions about your home problem and get one clear, deterministic next step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TriageHub,
});

function TriageHub() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Outcome | null>(null);

  const questions = category ? questionsFor(category) : [];

  const restart = () => {
    setCategory(null);
    setAnswers({});
    setStep(0);
    setNotes("");
    setResult(null);
  };

  const answer = (value: boolean) => {
    if (!category) return;
    const q = questions[step];
    const next: Answers = { ...answers, [q.id]: value };
    setAnswers(next);

    // Red flags short-circuit immediately — safety first.
    if (q.redFlag && value) {
      setResult(triage(category, next));
      return;
    }
    if (step + 1 >= questions.length) {
      setResult(triage(category, next));
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 0) {
      setCategory(null);
      return;
    }
    setStep(step - 1);
  };

  if (result?.id === "emergency") {
    return <EmergencyScreen outcome={result} onRestart={restart} />;
  }

  if (result) {
    return <ResultScreen outcome={result} notes={notes} onRestart={restart} />;
  }

  if (!category) {
    return (
      <div className="space-y-7">
        <header className="text-center">
          <h1 className="text-3xl font-black">Safety Check First</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tell us what is going on. We check for danger before we talk about repairs.
          </p>
        </header>

        <div className="grid gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategory(c.id);
                setStep(0);
              }}
              className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary active:scale-[0.98]"
            >
              <span className="text-4xl" aria-hidden>
                {c.emoji}
              </span>
              <span>
                <span className="block text-xl font-black leading-tight">{c.label}</span>
                <span className="block text-base text-muted-foreground">{c.hint}</span>
              </span>
            </button>
          ))}
        </div>

        <section className="rounded-3xl border-2 border-border bg-card p-5">
          <label htmlFor="describe" className="flex items-center gap-2 text-lg font-black">
            <MessageSquare className="h-6 w-6 text-primary" strokeWidth={2.5} />
            Optional: describe it in your own words
          </label>
          <textarea
            id="describe"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Water is dripping from under the kitchen sink..."
            className="mt-3 w-full resize-none rounded-2xl border-2 border-input bg-background p-4 text-lg focus:border-primary focus:outline-none"
          />
          <p className="mt-2 text-base text-muted-foreground">
            Your notes stay on this page. The result comes from your safety answers, not from a guess.
          </p>
        </section>
      </div>
    );
  }

  const q = questions[step];
  const label = CATEGORIES.find((c) => c.id === category)?.label ?? "";

  return (
    <div className="space-y-7">
      <button
        type="button"
        onClick={back}
        className="flex items-center gap-2 text-lg font-black text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} /> Back
      </button>

      <div>
        <p className="text-base font-black uppercase tracking-wide text-primary">
          {label} · Question {step + 1} of {questions.length}
        </p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <section
        className={`rounded-3xl border-2 p-6 ${
          q.redFlag ? "border-destructive bg-destructive/10" : "border-border bg-card"
        }`}
      >
        {q.redFlag && (
          <p className="mb-3 flex items-center gap-2 text-base font-black uppercase text-destructive">
            <ShieldAlert className="h-5 w-5" strokeWidth={2.5} /> Safety question
          </p>
        )}
        <h2 className="text-2xl font-black leading-tight">{q.text}</h2>
        {q.help && <p className="mt-2 text-lg text-muted-foreground">{q.help}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => answer(true)}
            className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-black text-primary-foreground transition-transform active:scale-[0.97]"
          >
            <Check className="h-8 w-8" strokeWidth={3} />
            Yes
          </button>
          <button
            type="button"
            onClick={() => answer(false)}
            className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background text-xl font-black transition-transform hover:border-primary active:scale-[0.97]"
          >
            <X className="h-8 w-8" strokeWidth={3} />
            No
          </button>
        </div>
      </section>
    </div>
  );
}

function EmergencyScreen({ outcome, onRestart }: { outcome: Outcome; onRestart: () => void }) {
  return (
    <div className="space-y-6 text-foreground">
      <section className="rounded-3xl border-4 border-destructive bg-destructive/15 p-6 text-center">
        <AlertTriangle className="mx-auto h-20 w-20 text-destructive" strokeWidth={2.5} />
        <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-destructive">
          Get safe first
        </h1>
        <p className="mt-3 text-xl font-bold leading-snug">
          Stop what you are doing. This is not a repair job right now.
        </p>
      </section>

      <a
        href="tel:911"
        className="flex min-h-24 w-full items-center justify-center gap-4 rounded-3xl bg-destructive text-3xl font-black uppercase text-destructive-foreground transition-transform active:scale-[0.98]"
      >
        <Phone className="h-10 w-10" strokeWidth={2.5} />
        Call 911
      </a>

      <section className="rounded-3xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-black">Why you are seeing this</h2>
        <p className="mt-2 text-xl leading-snug">{outcome.why}</p>
      </section>

      <section className="rounded-3xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-black">Do this now</h2>
        <ol className="mt-3 space-y-3">
          {outcome.nextAction.map((a) => (
            <li key={a} className="flex gap-3 text-xl font-bold leading-snug">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success" strokeWidth={2.5} />
              {a}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border-2 border-destructive bg-destructive/10 p-6">
        <h2 className="text-2xl font-black text-destructive">Do NOT do this</h2>
        <ul className="mt-3 space-y-3">
          {outcome.doNot.map((d) => (
            <li key={d} className="flex gap-3 text-xl font-bold leading-snug">
              <X className="mt-1 h-6 w-6 shrink-0 text-destructive" strokeWidth={3} />
              {d}
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={onRestart}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-border bg-background px-6 py-5 text-lg font-black"
      >
        <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
        Everyone is safe — start over
      </button>
    </div>
  );
}

function ResultScreen({
  outcome,
  notes,
  onRestart,
}: {
  outcome: Outcome;
  notes: string;
  onRestart: () => void;
}) {
  const accent =
    outcome.id === "pro"
      ? "border-warning"
      : outcome.id === "diy"
        ? "border-success"
        : "border-primary";

  return (
    <div className="space-y-6">
      <section className={`rounded-3xl border-4 ${accent} bg-card p-6 text-center`}>
        <h1 className="text-3xl font-black uppercase leading-tight">{outcome.title}</h1>
        <p className="mt-3 text-xl font-bold leading-snug">{outcome.why}</p>
      </section>

      <section className="rounded-3xl border-2 border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-2xl font-black">
          <ClipboardList className="h-7 w-7 text-primary" strokeWidth={2.5} />
          Your safe next step
        </h2>
        <ol className="mt-3 space-y-3">
          {outcome.nextAction.map((a) => (
            <li key={a} className="flex gap-3 text-xl leading-snug">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success" strokeWidth={2.5} />
              {a}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border-2 border-destructive bg-destructive/10 p-6">
        <h2 className="text-2xl font-black text-destructive">What not to do</h2>
        <ul className="mt-3 space-y-3">
          {outcome.doNot.map((d) => (
            <li key={d} className="flex gap-3 text-xl leading-snug">
              <X className="mt-1 h-6 w-6 shrink-0 text-destructive" strokeWidth={3} />
              {d}
            </li>
          ))}
        </ul>
      </section>

      {notes.trim().length > 0 && (
        <section className="rounded-3xl border-2 border-border bg-card p-5">
          <h2 className="text-lg font-black">Your description</h2>
          <p className="mt-2 text-lg text-muted-foreground">{notes}</p>
        </section>
      )}

      <div className="grid gap-3">
        {outcome.id === "diy" && (
          <Link
            to="/fix"
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-black text-primary-foreground active:scale-[0.98]"
          >
            <Wrench className="h-5 w-5" strokeWidth={2.5} />
            Open DIY guides
          </Link>
        )}
        {outcome.id === "pro" && (
          <Link
            to="/scam-guard"
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-black text-primary-foreground active:scale-[0.98]"
          >
            <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
            Check a fair price first
          </Link>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-background px-6 py-5 text-lg font-black"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
          Start a new safety check
        </button>
      </div>
    </div>
  );
}
