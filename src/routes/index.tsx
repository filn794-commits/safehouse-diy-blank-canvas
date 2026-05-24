import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeHouse DIY — Home Repair Made Simple" },
      { name: "description", content: "SafeHouse DIY helps you tackle home repairs safely and confidently." },
      { property: "og:title", content: "SafeHouse DIY — Home Repair Made Simple" },
      { property: "og:description", content: "SafeHouse DIY helps you tackle home repairs safely and confidently." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight">SafeHouse DIY</span>
          <nav className="text-sm text-muted-foreground">Home Repair, Simplified</nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          SafeHouse DIY
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Your blank canvas for building a smarter home repair experience.
        </p>
      </section>
    </main>
  );
}
