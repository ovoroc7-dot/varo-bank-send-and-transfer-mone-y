import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VaroAccount = "checking" | "savings";

export type Txn = {
  id: string;
  name: string;
  note?: string;
  amount: number; // negative = money out, positive = money in
  date: string; // ISO
  status?: "pending" | "completed";
  fee?: number; // BIC fee charged on top of the amount
  account?: VaroAccount; // which Varo account the money moved through
};

const STARTING_BALANCE = 60000;
const KEY_PREFIX = "varo.transactions.v2";
const LEGACY_KEY = "varo.transactions.v1";

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
let currentUserId: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function storageKey() {
  return currentUserId ? `${KEY_PREFIX}.${currentUserId}` : null;
}

function loadLocal() {
  const key = storageKey();
  txns = [];
  if (!key || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) txns = parsed as Txn[];
    }
  } catch {
    txns = [];
  }
}

function persist() {
  const key = storageKey();
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(txns));
  } catch {
    /* storage unavailable */
  }
}

/** One-time move of device-wide demo transactions into the signed-in account. */
function migrateLegacy() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const existing = new Set(txns.map((t) => t.id));
      txns = [...txns, ...(parsed as Txn[]).filter((t) => !existing.has(t.id))];
    }
    window.localStorage.removeItem(LEGACY_KEY);
    persist();
  } catch {
    /* ignore */
  }
}

/** Pull the user's transactions from the cloud and push any local-only ones up. */
async function refreshFromCloud() {
  const userId = currentUserId;
  if (!userId) return;
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || currentUserId !== userId) return;

  const remote: Txn[] = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    ...(r.note ? { note: r.note } : {}),
    amount: Number(r.amount),
    date: r.created_at,
    status: r.status === "pending" ? ("pending" as const) : ("completed" as const),
    ...(Number(r.fee) ? { fee: Number(r.fee) } : {}),
    account: r.account === "savings" ? ("savings" as const) : ("checking" as const),
  }));

  const remoteIds = new Set(remote.map((t) => t.id));
  const localOnly = txns.filter((t) => !remoteIds.has(t.id));
  if (localOnly.length) {
    await supabase.from("transactions").insert(
      localOnly.map((t) => ({
        id: t.id,
        user_id: userId,
        name: t.name,
        note: t.note ?? null,
        amount: t.amount,
        fee: t.fee ?? 0,
        status: t.status ?? "completed",
        account: t.account ?? "checking",
        created_at: t.date,
      })),
    );
  }

  txns = [...remote, ...localOnly].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  );
  persist();
  emit();
}

function pushToCloud(txn: Txn) {
  const userId = currentUserId;
  if (!userId) return;
  void supabase.from("transactions").insert({
    id: txn.id,
    user_id: userId,
    name: txn.name,
    note: txn.note ?? null,
    amount: txn.amount,
    fee: txn.fee ?? 0,
    status: txn.status ?? "completed",
    account: txn.account ?? "checking",
    created_at: txn.date,
  });
}

if (typeof window !== "undefined") {
  void supabase.auth.getSession().then(({ data }) => {
    currentUserId = data.session?.user.id ?? null;
    if (!currentUserId) return;
    loadLocal();
    migrateLegacy();
    emit();
    void refreshFromCloud();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user.id ?? null;
    if (uid === currentUserId) return;
    currentUserId = uid;
    if (uid) {
      loadLocal();
      migrateLegacy();
      emit();
      void refreshFromCloud();
    } else {
      txns = [];
      emit();
    }
  });
}

function record(txn: Txn) {
  txns = [txn, ...txns];
  persist();
  emit();
  pushToCloud(txn);
  return txn;
}

function accountOf(t: Txn): VaroAccount {
  return t.account ?? "checking";
}

export const ledger = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getTransactions(): Txn[] {
    return txns;
  },
  /** Checking (Varo Bank Account) balance. */
  getBalance(): number {
    return txns
      .filter((t) => accountOf(t) === "checking")
      .reduce((sum, t) => sum + t.amount - (t.fee ?? 0), STARTING_BALANCE);
  },
  /** Varo Savings Account balance. */
  getSavingsBalance(): number {
    return txns
      .filter((t) => accountOf(t) === "savings")
      .reduce((sum, t) => sum + t.amount - (t.fee ?? 0), 0);
  },
  /** Records money leaving the Varo Bank Account. Amount is a positive dollar value. */
  addSent({ name, note, amount }: { name: string; note?: string; amount: number }) {
    const value = Math.abs(amount);
    const fee = bicFee(value);
    return record({
      id: crypto.randomUUID(),
      name,
      ...(note ? { note } : {}),
      amount: -value,
      date: new Date().toISOString(),
      status: isPendingAmount(value) ? "pending" : "completed",
      ...(fee ? { fee } : {}),
      account: "checking",
    });
  },
  /** Records money coming into the Varo Bank Account. Amount is a positive dollar value. */
  addReceived({ name, note, amount }: { name: string; note?: string; amount: number }) {
    return record({
      id: crypto.randomUUID(),
      name,
      ...(note ? { note } : {}),
      amount: Math.abs(amount),
      date: new Date().toISOString(),
      status: "completed",
      account: "checking",
    });
  },
  /**
   * Moves money between the user's own Varo accounts. Records one entry on each
   * side so both balances and the transaction history stay accurate.
   */
  transferBetweenAccounts({
    from,
    to,
    amount,
  }: {
    from: VaroAccount;
    to: VaroAccount;
    amount: number;
  }) {
    const value = Math.abs(amount);
    const label = (a: VaroAccount) =>
      a === "checking" ? "Varo Bank Account" : "Varo Savings Account";
    const date = new Date().toISOString();
    const out = record({
      id: crypto.randomUUID(),
      name: `Transfer to ${label(to)}`,
      amount: -value,
      date,
      status: "completed",
      account: from,
    });
    record({
      id: crypto.randomUUID(),
      name: `Transfer from ${label(from)}`,
      amount: value,
      date,
      status: "completed",
      account: to,
    });
    return out;
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

export function useSavingsBalance(): number {
  return useSyncExternalStore(ledger.subscribe, ledger.getSavingsBalance, () => 0);
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function txnDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
