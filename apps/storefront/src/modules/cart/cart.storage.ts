import type {
  CartItem,
  CartLineItem,
  CartProductSnapshot,
  CartSummary,
} from "./cart.types";

const CART_STORAGE_KEY = "storefront.cart";
const CART_UPDATED_EVENT = "storefront:cart:updated";

function hasBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function parseCartItems(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is CartItem => {
        return (
          item &&
          typeof item.productId === "string" &&
          typeof item.name === "string" &&
          typeof item.price === "number" &&
          typeof item.quantity === "number" &&
          (typeof item.imageUrl === "string" || item.imageUrl === null)
        );
      })
      .map((item) => ({
        ...item,
        quantity: sanitizeQuantity(item.quantity),
      }));
  } catch {
    return [];
  }
}

function notifyCartUpdated() {
  if (!hasBrowserStorage()) {
    return;
  }

  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function readCartItems() {
  if (!hasBrowserStorage()) {
    return [];
  }

  return parseCartItems(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function writeCartItems(items: CartItem[]) {
  if (!hasBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  notifyCartUpdated();
}

export function clearCartItems() {
  if (!hasBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  notifyCartUpdated();
}

export function addCartItem(product: CartProductSnapshot, quantity = 1) {
  const items = readCartItems();
  const existingItem = items.find((item) => item.productId === product.productId);
  const nextQuantity = sanitizeQuantity(quantity);

  if (existingItem) {
    writeCartItems(
      items.map((item) =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + nextQuantity }
          : item,
      ),
    );
    return;
  }

  writeCartItems([...items, { ...product, quantity: nextQuantity }]);
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const nextQuantity = Math.floor(quantity);

  if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
    removeCartItem(productId);
    return;
  }

  writeCartItems(
    readCartItems().map((item) =>
      item.productId === productId ? { ...item, quantity: nextQuantity } : item,
    ),
  );
}

export function removeCartItem(productId: string) {
  writeCartItems(readCartItems().filter((item) => item.productId !== productId));
}

export function getCartSummary(items: CartItem[]): CartSummary {
  const lineItems: CartLineItem[] = items.map((item) => ({
    ...item,
    lineTotal: item.price * item.quantity,
  }));

  return {
    items: lineItems,
    itemCount: lineItems.reduce((total, item) => total + item.quantity, 0),
    subtotal: lineItems.reduce((total, item) => total + item.lineTotal, 0),
  };
}

export function subscribeToCartChanges(listener: () => void) {
  if (!hasBrowserStorage()) {
    return () => {};
  }

  window.addEventListener(CART_UPDATED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
