import { Button, Input } from "@otbt/ui";
import { Package2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../auth.provider";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await login(String(formData.get("email")), String(formData.get("password")));
      navigate("/");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="rounded-lg border bg-background p-8 shadow-sm" onSubmit={handleSubmit}>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border bg-primary text-primary-foreground">
          <Package2 className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Order of the Black Thorn</p>
          <p className="truncate text-xs text-muted-foreground">Online Store Management</p>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>

      <div className="mt-7 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <Input className="h-11" id="email" name="email" required type="email" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="password">
            Password
          </label>
          <Input className="h-11" id="password" name="password" required type="password" />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button className="h-11 w-full" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
