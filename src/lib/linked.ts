import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LinkedAccount = {
  id: string;
  kind: "card" | "bank";
  name: string; // bank or card issuer name
  last4: string;
};

// Linked cards and banks are stored on the user's account in the cloud,
// so they show up on every device the user logs in from.
let items: LinkedAccount[] = [];
let uid: string | null = null;
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

async function loadFor(userId: string | null) {
  uid = userId;
  if (!userId) {
    items = [];
    emit();
    return;
  }
  // Move any accounts linked earlier on this device into the cloud.
  try {
    const raw = window.localStorage.getItem("varo.linked.v1");
    const legacy = raw ? (JSON.parse(raw) as LinkedAccount[]) : [];
    if (Array.isArray(legacy) && legacy.length) {
      await supabase.from("linked_accounts").insert(
        legacy.map((l) => ({ user_id: userId, kind: l.kind, name: l.name, last4: l.last4 })),
      );
      window.localStorage.removeItem("varo.linked.v1");
    }
  } catch {
    /* ignore */
  }
  const { data } = await supabase
    .from("linked_accounts")
    .select("id, kind, name, last4")
    .order("created_at", { ascending: true });
  if (uid !== userId) return;
  items = (data ?? []) as LinkedAccount[];
  emit();
}

if (typeof window !== "undefined") {
  void supabase.auth.getSession().then(({ data }) => loadFor(data.session?.user.id ?? null));
  supabase.auth.onAuthStateChange((_e, session) => {
    const next = session?.user.id ?? null;
    if (next !== uid) void loadFor(next);
  });
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
    emit();
    if (uid) {
      void supabase.from("linked_accounts").insert({ id: created.id, user_id: uid, ...entry });
    }
    return created;
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    emit();
    void supabase.from("linked_accounts").delete().eq("id", id);
  },
};

const empty: LinkedAccount[] = [];

export function useLinkedAccounts(): LinkedAccount[] {
  return useSyncExternalStore(linkedStore.subscribe, linkedStore.get, () => empty);
}
