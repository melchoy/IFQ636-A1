import { Link } from "react-router";

import { RegistrationForm } from "../../../modules/customers/registration/ui/registration-form";

export function RegisterPage() {
  return (
    <main className="storefront-container px-4 py-10 sm:py-12 md:px-6">
      <section className="mx-auto max-w-xl">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Create account
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Register to access member storefront features.
          </p>
        </div>

        <div className="mt-8 rounded-lg border bg-card p-5 shadow-sm sm:p-6">
          <RegistrationForm />
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link className="font-medium text-foreground hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
