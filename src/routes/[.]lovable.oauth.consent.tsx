import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

type OAuthClient = { name?: string; redirect_uri?: string; client_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult = { data?: AuthorizationDetails | null; error?: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

const SCOPE_LABELS: Record<string, string> = {
  openid: "Confirm who you are",
  email: "Share your email address",
  profile: "Share your basic profile",
};

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { next: location.pathname + location.searchStr } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data ?? {};
  },
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md py-10 text-center">
      <h1 className="font-display text-2xl font-black">Could not load this request</h1>
      <p className="mt-3 text-lg text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
  component: Consent,
});

function Consent() {
  const details = Route.useLoaderData() as AuthorizationDetails;
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";
  const scopes = (details?.scope ?? "").split(" ").filter(Boolean);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (err) { setBusy(false); setError(err.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  return (
    <main className="mx-auto max-w-md py-6">
      <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-black">
          Connect {clientName} to PocketPro AI
        </h1>
        <p className="mt-2 text-lg font-bold text-muted-foreground">
          This lets {clientName} use PocketPro AI's tools as you.
        </p>

        {details?.client?.redirect_uri && (
          <p className="mt-4 break-all rounded-2xl bg-background p-4 font-mono text-sm">
            Redirects to: {details.client.redirect_uri}
          </p>
        )}

        {scopes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {scopes.map((s) => (
              <li key={s} className="flex gap-3 text-base font-bold">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {SCOPE_LABELS[s] ?? `Additional permission requested: ${s}`}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-base font-bold text-muted-foreground">
          This does not bypass PocketPro AI's own permissions.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-2xl border-2 border-destructive bg-destructive/10 p-4 text-base font-bold text-destructive">
            {error}
          </p>
        )}

        <button
          disabled={busy}
          onClick={() => decide(true)}
          className="mt-6 w-full rounded-2xl bg-primary px-6 py-5 text-xl font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          Approve
        </button>
        <button
          disabled={busy}
          onClick={() => decide(false)}
          className="mt-3 w-full rounded-2xl border-2 border-border px-6 py-4 text-lg font-black transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          Cancel connection
        </button>
      </div>
    </main>
  );
}
