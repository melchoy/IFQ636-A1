import { Outlet } from "react-router";

export function PublicLayout() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-[480px]">
        <Outlet />
      </section>
    </main>
  );
}
