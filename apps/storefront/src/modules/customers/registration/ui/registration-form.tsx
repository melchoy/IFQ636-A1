import { useState, type FormEvent } from "react";

import { Button, Input } from "@otbt/ui";

import { useRegisterCustomerMutation } from "../customer-registration.query";

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const initialRegistrationFormState: RegistrationFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export function RegistrationForm() {
  const registerCustomerMutation = useRegisterCustomerMutation();
  const [formState, setFormState] = useState(initialRegistrationFormState);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  function updateFormField(
    field: keyof RegistrationFormState,
    value: string,
  ) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisteredEmail(null);

    const response = await registerCustomerMutation.mutateAsync(formState);
    setRegisteredEmail(response.customer.email);
    setFormState(initialRegistrationFormState);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="firstName"
          >
            First name
          </label>
          <Input
            id="firstName"
            name="firstName"
            onChange={(event) => updateFormField("firstName", event.target.value)}
            required
            value={formState.firstName}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="lastName"
          >
            Last name
          </label>
          <Input
            id="lastName"
            name="lastName"
            onChange={(event) => updateFormField("lastName", event.target.value)}
            required
            value={formState.lastName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          onChange={(event) => updateFormField("email", event.target.value)}
          required
          type="email"
          value={formState.email}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="password">
          Password
        </label>
        <Input
          autoComplete="new-password"
          id="password"
          name="password"
          onChange={(event) => updateFormField("password", event.target.value)}
          required
          type="password"
          value={formState.password}
        />
      </div>

      {registerCustomerMutation.isError ? (
        <p className="text-sm text-destructive">
          {registerCustomerMutation.error.message}
        </p>
      ) : null}

      {registeredEmail ? (
        <p className="text-sm text-emerald-700">
          Account created for {registeredEmail}.
        </p>
      ) : null}

      <Button
        className="w-full"
        disabled={registerCustomerMutation.isPending}
        type="submit"
      >
        {registerCustomerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
