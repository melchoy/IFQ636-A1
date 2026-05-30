import { useSyncExternalStore } from "react";

import {
  getCartSummary,
  readCartItems,
  subscribeToCartChanges,
} from "./cart.storage";

let cachedCartSnapshot = getCartSummary([]);
let cachedCartSnapshotKey = "[]";

function getCartSnapshot() {
  const items = readCartItems();
  const nextKey = JSON.stringify(items);

  if (nextKey !== cachedCartSnapshotKey) {
    cachedCartSnapshotKey = nextKey;
    cachedCartSnapshot = getCartSummary(items);
  }

  return cachedCartSnapshot;
}

function getServerCartSnapshot() {
  return getCartSummary([]);
}

export function useCart() {
  return useSyncExternalStore(
    subscribeToCartChanges,
    getCartSnapshot,
    getServerCartSnapshot,
  );
}
