const highlights = [
  'Track requests and approvals in one place.',
  'Keep backend and frontend changes inside the same Nx workspace.',
  'Ship consistent UI with the shared shadcn component library.',
];

export default function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          EBMS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Electronic Business Management System
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          A focused Next.js application inside your monorepo, ready for feature
          work instead of the default Nx landing page.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Open dashboard
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View documentation
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 className="mb-2 text-lg font-medium">Why this workspace setup</h2>
            <p className="text-sm text-muted-foreground">{highlight}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
