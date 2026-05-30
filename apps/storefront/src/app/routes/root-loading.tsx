export function RootLoading() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="storefront-container grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-9 shrink-0 rounded-lg bg-muted" />
            <div className="min-w-0 space-y-1.5">
              <div className="h-3.5 w-40 rounded bg-muted" />
              <div className="h-2.5 w-20 rounded bg-muted" />
            </div>
          </div>
          <div className="hidden items-center justify-center gap-7 md:flex">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="h-8 w-16 rounded bg-muted" />
            <div className="h-8 w-28 rounded bg-muted" />
            <div className="size-8 rounded bg-muted" />
          </div>
        </div>
      </header>
      <main className="storefront-container px-4 py-8 md:px-6" />
    </div>
  );
}
