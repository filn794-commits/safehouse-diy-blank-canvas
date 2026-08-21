import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Home, ScanLine, Wrench, ShieldCheck, LogOut, Video } from "lucide-react";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-xl">Page not found</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3 text-lg font-bold text-primary-foreground">
          Go Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-2xl bg-primary px-6 py-3 text-lg font-bold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PocketPro AI — Home Repair Made Simple" },
      { name: "description", content: "Confident home repairs for beginners. Step-by-step fixes, scam protection, and friendly guidance." },
      { property: "og:title", content: "PocketPro AI — Home Repair Made Simple" },
      { name: "twitter:title", content: "PocketPro AI — Home Repair Made Simple" },
      { property: "og:description", content: "Confident home repairs for beginners. Step-by-step fixes, scam protection, and friendly guidance." },
      { name: "twitter:description", content: "Confident home repairs for beginners. Step-by-step fixes, scam protection, and friendly guidance." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2ccfe461-fee2-44fa-b6a5-98a44b26820b" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2ccfe461-fee2-44fa-b6a5-98a44b26820b" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://safehouse-diy-blank-canvas.lovable.app/#website",
              "name": "PocketPro AI",
              "url": "https://safehouse-diy-blank-canvas.lovable.app/",
              "description": "Confident home repairs for beginners. Step-by-step fixes, scam protection, and friendly guidance.",
              "publisher": { "@id": "https://safehouse-diy-blank-canvas.lovable.app/#organization" },
            },
            {
              "@type": "Organization",
              "@id": "https://safehouse-diy-blank-canvas.lovable.app/#organization",
              "name": "PocketPro AI",
              "alternateName": "SafeHouse DIY",
              "url": "https://safehouse-diy-blank-canvas.lovable.app/",
              "description": "Home repair guidance and expert consultation for beginners, single mothers, and elderly homeowners.",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/fix", label: "Fix", icon: Wrench },
  { to: "/scam-guard", label: "Guard", icon: ShieldCheck },
  { to: "/mentor", label: "Mentor", icon: Video },
] as const;

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 z-50 w-[min(640px,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-border bg-card/80 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <ul className="flex items-stretch justify-around gap-1">
        {navItems.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.25} />
                <span className="uppercase">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!email) {
    return (
      <Link
        to="/auth"
        search={{ next: "/" }}
        className="rounded-full border border-border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.assign("/");
      }}
      title={email}
      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <LogOut className="h-4 w-4" strokeWidth={2.5} />
      Sign out
    </button>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
          <Wrench className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display text-lg font-bold leading-none tracking-tight">
            PocketPro<span className="text-primary"> AI</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            // you've got this
          </p>
        </div>
        <div className="ml-auto">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-2xl px-5 pb-8">
      <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          // safety &amp; pricing disclaimer
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          PocketPro AI provides general guidance and <strong>estimated</strong> price ranges based on
          typical regional labor rates. Estimates are not quotes and actual costs vary by property,
          parts, and contractor. Nothing here is professional, legal, or licensed-trade advice. Always
          shut off power, gas, and water before working, follow local codes, and hire a licensed
          professional for gas, electrical, structural, or anything you are unsure about. You are
          responsible for your own safety.
        </p>
        <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/scan" className="text-muted-foreground transition-colors hover:text-foreground">Scan</Link>
          <Link to="/fix" className="text-muted-foreground transition-colors hover:text-foreground">Fix</Link>
          <Link to="/scam-guard" className="text-muted-foreground transition-colors hover:text-foreground">Scam Guard</Link>
          <Link to="/mentor" className="text-muted-foreground transition-colors hover:text-foreground">Mentors</Link>
        </nav>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          © {new Date().getFullYear()} PocketPro AI — Built for beginners, moms, seniors &amp; crews
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background pb-28 text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-60 [background:radial-gradient(60%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_70%),radial-gradient(50%_30%_at_100%_100%,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_70%)]" />
        <AppHeader />
        <main className="mx-auto max-w-2xl px-5 py-6">
          <Outlet />
        </main>
        <AppFooter />
        <BottomNav />
        <LevelUpOverlay />
        <Toaster position="top-center" richColors closeButton theme="dark" />
      </div>
    </QueryClientProvider>
  );
}

