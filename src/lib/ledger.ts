import { useSyncExternalStore } from "react";

export type Txn = {
  id: string;
  name: string;
  note?: string;
  amount: number; // negative = money out, positive = money in
  date: string; // ISO
};

const STARTING_BALANCE = 60000;
const KEY = "varo.transactions.v1";

let txns: Txn[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) txns = parsed as Txn[];
    }
  } catch {
    txns = [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(txns));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  for (const l of listeners) l();
}

export const ledger = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getTransactions(): Txn[] {
    load();
    return txns;
  },
  getBalance(): number {
    load();
    return txns.reduce((sum, t) => sum + t.amount, STARTING_BALANCE);
  },
  /** Records money leaving the account. Amount is a positive dollar value. */
  addSent({ name, note, amount }: { name: string; note?: string; amount: number }) {
    load();
    const txn: Txn = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      ...(note ? { note } : {}),
      amount: -Math.abs(amount),
      date: new Date().toISOString(),
    };
    txns = [txn, ...txns];
    persist();
    emit();
    return txn;
  },
};

const emptyTxns: Txn[] = [];

export function useTransactions(): Txn[] {
  return useSyncExternalStore(
    ledger.subscribe,
    ledger.getTransactions,
    () => emptyTxns,
  );
}

export function useBalance(): number {
  return useSyncExternalStore(ledger.subscribe, ledger.getBalance, () => STARTING_BALANCE);
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function txnDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
