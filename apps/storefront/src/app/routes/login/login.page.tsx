import { Link } from "react-router";

import { LoginForm } from "../../../modules/customers/auth/ui/login-form";

export function LoginPage() {
  return (
    <main className="storefront-container px-4 py-10 sm:py-12 md:px-6">
      <section className="mx-auto max-w-md">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Sign in
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to continue with your storefront account.
          </p>
        </div>

        <div className="mt-8 rounded-lg border bg-card p-5 shadow-sm sm:p-6">
          <LoginForm />
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          New customer?{" "}
          <Link className="font-medium text-foreground hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
