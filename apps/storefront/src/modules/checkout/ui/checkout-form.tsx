import { type FormEvent, useState } from "react";

import type { CheckoutRequest, CheckoutResponse } from "@otbt/types";
import { Button, Input } from "@otbt/ui";
import { Link } from "@otbt/web";

import { clearCartItems, useCart } from "../../cart";
import { useCheckoutMutation } from "../checkout.query";

type CheckoutFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  state: string;
  postcode: string;
  instructions: string;
};

const initialCheckoutFormState: CheckoutFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  recipientName: "",
  addressLine1: "",
  addressLine2: "",
  suburb: "",
  state: "",
  postcode: "",
  instructions: "",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

function optionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function buildCheckoutRequest(
  form: CheckoutFormState,
  cart: ReturnType<typeof useCart>,
): CheckoutRequest {
  return {
    customer: {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: optionalValue(form.phone),
    },
    deliveryAddress: {
      recipientName: form.recipientName.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: optionalValue(form.addressLine2),
      suburb: form.suburb.trim(),
      state: form.state.trim(),
      postcode: form.postcode.trim(),
      instructions: optionalValue(form.instructions),
    },
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Checkout failed";
}

export function CheckoutForm() {
  const cart = useCart();
  const checkoutMutation = useCheckoutMutation();
  const [form, setForm] = useState(initialCheckoutFormState);
  const [submittedOrder, setSubmittedOrder] =
    useState<CheckoutResponse["order"] | null>(null);

  function updateField(field: keyof CheckoutFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.items.length === 0) {
      return;
    }

    try {
      const response = await checkoutMutation.mutateAsync(
        buildCheckoutRequest(form, cart),
      );

      clearCartItems();
      setSubmittedOrder(response.order);
    } catch {
      // Mutation state renders the checkout error.
    }
  }

  if (submittedOrder) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="mx-auto max-w-2xl rounded-lg border bg-background p-8 text-center">
          <p className="text-sm text-muted-foreground">Order submitted</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Thanks, {submittedOrder.customer.firstName}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Your order reference is{" "}
            <span className="font-medium text-foreground">
              {submittedOrder.id}
            </span>
            .
          </p>
          <Button asChild className="mt-6">
            <Link to="/" unstyled>
              Continue shopping
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="mx-auto max-w-2xl rounded-lg border bg-background p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Checkout</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your cart is empty.
          </p>
          <Button asChild className="mt-6">
            <Link to="/" unstyled>
              Browse catalogue
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="storefront-container px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-foreground">Checkout</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Add delivery details and submit your order.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/cart" unstyled>
            Back to cart
          </Link>
        </Button>
      </div>

      <form
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        onSubmit={handleSubmit}
      >
        <section className="rounded-lg border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Contact details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                First name
                <Input
                  onChange={(event) =>
                    updateField("firstName", event.currentTarget.value)
                  }
                  required
                  value={form.firstName}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Last name
                <Input
                  onChange={(event) =>
                    updateField("lastName", event.currentTarget.value)
                  }
                  required
                  value={form.lastName}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground sm:col-span-2">
                Email
                <Input
                  onChange={(event) =>
                    updateField("email", event.currentTarget.value)
                  }
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground sm:col-span-2">
                Phone
                <Input
                  onChange={(event) =>
                    updateField("phone", event.currentTarget.value)
                  }
                  type="tel"
                  value={form.phone}
                />
              </label>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-foreground">
              Delivery details
            </h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Recipient name
                <Input
                  onChange={(event) =>
                    updateField("recipientName", event.currentTarget.value)
                  }
                  required
                  value={form.recipientName}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Address line 1
                <Input
                  onChange={(event) =>
                    updateField("addressLine1", event.currentTarget.value)
                  }
                  required
                  value={form.addressLine1}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Address line 2
                <Input
                  onChange={(event) =>
                    updateField("addressLine2", event.currentTarget.value)
                  }
                  value={form.addressLine2}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px_140px]">
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Suburb
                  <Input
                    onChange={(event) =>
                      updateField("suburb", event.currentTarget.value)
                    }
                    required
                    value={form.suburb}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  State
                  <Input
                    onChange={(event) =>
                      updateField("state", event.currentTarget.value)
                    }
                    required
                    value={form.state}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Postcode
                  <Input
                    onChange={(event) =>
                      updateField("postcode", event.currentTarget.value)
                    }
                    required
                    value={form.postcode}
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Delivery instructions
                <textarea
                  className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onChange={(event) =>
                    updateField("instructions", event.currentTarget.value)
                  }
                  value={form.instructions}
                />
              </label>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Order summary
          </h2>
          <div className="mt-5 divide-y border-y">
            {cart.items.map((item) => (
              <div className="py-4" key={item.productId}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-semibold text-foreground">
              {formatPrice(cart.subtotal)}
            </span>
          </div>
          {checkoutMutation.isError ? (
            <p className="mt-4 text-sm text-destructive">
              {getErrorMessage(checkoutMutation.error)}
            </p>
          ) : null}
          <Button
            className="mt-5 w-full"
            disabled={checkoutMutation.isPending}
            type="submit"
          >
            {checkoutMutation.isPending ? "Submitting..." : "Submit order"}
          </Button>
        </aside>
      </form>
    </main>
  );
}
