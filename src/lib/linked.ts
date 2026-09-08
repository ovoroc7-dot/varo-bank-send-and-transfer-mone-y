import { useSyncExternalStore } from "react";

export type LinkedAccount = {
  id: string;
  kind: "card" | "bank";
  name: string; // bank or card issuer name
  last4: string;
};

const KEY = "varo.linked.v1";

let items: LinkedAccount[] = load();
const listeners = new Set<() => void>();

function load(): LinkedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as LinkedAccount[]) : [];
  } catch {
    return [];
  }
}

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
  for (const l of listeners) l();
}

export const linkedStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get(): LinkedAccount[] {
    return items;
  },
  add(entry: Omit<LinkedAccount, "id">) {
    const created: LinkedAccount = { id: crypto.randomUUID(), ...entry };
    items = [...items, created];
    save();
    return created;
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    save();
  },
};

const empty: LinkedAccount[] = [];

export function useLinkedAccounts(): LinkedAccount[] {
  return useSyncExternalStore(linkedStore.subscribe, linkedStore.get, () => empty);
}
