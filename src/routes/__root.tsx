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
import { Home, ScanLine, Wrench, ShieldCheck } from "lucide-react";

import appCss from "../styles.css?url";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { Toaster } from "@/components/ui/sonner";

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
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" },
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
      </div>
    </header>
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
        <BottomNav />
        <LevelUpOverlay />
        <Toaster position="top-center" richColors closeButton theme="dark" />
      </div>
    </QueryClientProvider>
  );
}

