import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

// Real session state backed by the cloud backend, so a user's account and
// transaction history follow them to any device.
let loggedIn = false;
let currentUserId: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  void supabase.auth.getSession().then(({ data }) => {
    loggedIn = !!data.session;
    currentUserId = data.session?.user.id ?? null;
    emit();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    loggedIn = !!session;
    currentUserId = session?.user.id ?? null;
    emit();
  });
}

export const demoAuth = {
  async login(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  },
  async signup(
    email: string,
    password: string,
    phone?: string,
  ): Promise<{ error: string | null; needsConfirmation: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      ...(phone ? { options: { data: { phone } } } : {}),
    });
    return {
      error: error ? error.message : null,
      needsConfirmation: !error && !data.session,
    };
  },
  async logout() {
    await supabase.auth.signOut();
  },
  isLoggedIn: () => loggedIn,
  userId: () => currentUserId,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useDemoAuth() {
  return useSyncExternalStore(demoAuth.subscribe, demoAuth.isLoggedIn, () => false);
}
