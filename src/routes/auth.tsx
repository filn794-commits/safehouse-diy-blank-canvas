import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wrench, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

function safeNext(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ next: safeNext(s.next) }),
  head: () => ({
    meta: [
      { title: "Sign in — PocketPro AI" },
      { name: "description", content: "Sign in to PocketPro AI to save your progress and connect assistants to your account." },
      { property: "og:title", content: "Sign in — PocketPro AI" },
      { property: "og:description", content: "Sign in to PocketPro AI to save your progress and connect assistants to your account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(next);
    });
  }, [next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });
      setBusy(false);
      if (err) return setError(err.message);
      setMessage("Check your email to confirm your account, then come back and sign in.");
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) return setError(err.message);
    if (next.startsWith("/.lovable")) window.location.assign(next);
    else void navigate({ to: next });
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${next}`,
    });
    if (result.error) return setError("Could not start Google sign-in. Please try again.");
    if (result.redirected) return;
    window.location.assign(next);
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
          <Wrench className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 font-display text-3xl font-black">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Save your progress and let trusted assistants use PocketPro AI for you.
        </p>
      </div>

      <button
        onClick={google}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-border bg-card px-6 py-4 text-lg font-black transition-transform active:scale-[0.98]"
      >
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-base font-black">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border-2 border-input bg-background px-4 py-4 text-lg font-bold focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-base font-black">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border-2 border-input bg-background px-4 py-4 text-lg font-bold focus:border-primary focus:outline-none"
          />
        </div>

        {error && <p role="alert" className="rounded-2xl border-2 border-destructive bg-destructive/10 p-4 text-base font-bold text-destructive">{error}</p>}
        {message && <p className="rounded-2xl border-2 border-success bg-success/10 p-4 text-base font-bold text-success">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-xl font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
        className="mt-5 w-full text-center text-base font-bold text-muted-foreground underline"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
