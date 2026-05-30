import { isRouteErrorResponse, useRouteError } from "react-router";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.data?.message ?? error.statusText;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export function RouteError() {
  const error = useRouteError();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Unable to load this page</h1>
        <p className="mt-2 text-sm text-muted-foreground">{getErrorMessage(error)}</p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/" unstyled>
            Return to admin
          </Link>
        </Button>
      </section>
    </main>
  );
}
