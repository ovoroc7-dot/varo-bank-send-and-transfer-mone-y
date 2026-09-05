import { useSyncExternalStore } from "react";

export type Txn = {
  id: string;
  name: string;
  note?: string;
  amount: number; // negative = money out, positive = money in
  date: string; // ISO
  status?: "pending" | "completed";
  fee?: number; // BIC fee charged on top of the amount
};

const STARTING_BALANCE = 60000;
const KEY = "varo.transactions.v1";

/** BIC fee tiers for outgoing transfers (demo). */
export function bicFee(amount: number): number {
  if (amount >= 41000) return 5000;
  if (amount >= 20600) return 2500;
  if (amount >= 10200) return 500;
  if (amount >= 5200) return 300;
  if (amount >= 3150) return 250;
  if (amount >= 2000) return 150;
  if (amount >= 1000) return 75;
  return 0;
}

/** Transfers of $1,000 up to $200,000 are held for review before they settle. */
export function isPendingAmount(amount: number): boolean {
  return amount >= 1000 && amount <= 200000;
}


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
    return txns.reduce((sum, t) => sum + t.amount - (t.fee ?? 0), STARTING_BALANCE);
  },
  /** Records money leaving the account. Amount is a positive dollar value. */
  addSent({ name, note, amount }: { name: string; note?: string; amount: number }) {
    load();
    const value = Math.abs(amount);
    const fee = bicFee(value);
    const txn: Txn = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      ...(note ? { note } : {}),
      amount: -value,
      date: new Date().toISOString(),
      status: isPendingAmount(value) ? "pending" : "completed",
      ...(fee ? { fee } : {}),
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
