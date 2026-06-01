import { Button } from "@otbt/ui";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { Link } from "@otbt/web";

import { NotFoundPage } from "./not-found.page";

export function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  const message = isRouteErrorResponse(error)
    ? error.statusText || "Something went wrong"
    : error instanceof Error
      ? error.message
      : "Unexpected storefront error";

  return (
    <main className="storefront-container px-4 py-16 sm:py-20 md:px-6">
      <section className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-destructive">
          Error
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          {message}
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link to="/" unstyled>
              Back to collection
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
