import { isRouteErrorResponse, useRouteError } from "react-router";

export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Unexpected storefront error";

  return (
    <main className="storefront-container px-4 py-16 md:px-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm text-muted-foreground">Storefront error</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">{message}</h1>
      </div>
    </main>
  );
}
