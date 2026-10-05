import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

// Real session state backed by the cloud backend, so a user's account and
// transaction history follow them to any device.
let loggedIn = false;
let currentUserId: string | null = null;
export type Profile = {
  first_name?: string; last_name?: string; phone?: string; email?: string;
  street?: string; apt?: string; city?: string; state?: string; zip?: string; joined?: string; avatar_path?: string | null;
};
let profile: Profile | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setProfile(session: any) {
  const u = session?.user;
  profile = u ? { ...(u.user_metadata ?? {}), email: u.email, joined: u.created_at } : null;
}
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  void supabase.auth.getSession().then(({ data }) => {
    loggedIn = !!data.session;
    currentUserId = data.session?.user.id ?? null;
    setProfile(data.session);
    emit();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    loggedIn = !!session;
    currentUserId = session?.user.id ?? null;
    setProfile(session);
    emit();
  });
}

export const demoAuth = {
  async login(identifier: string, password: string): Promise<string | null> {
    const id = identifier.trim();
    let email = id.toLowerCase();
    if (!id.includes("@")) {
      // Phone login: find the account's email, then sign in normally.
      // Runs entirely in the browser so it works on any host (e.g. Vercel).
      const { data } = await supabase.rpc("email_for_phone", { _phone: id });
      if (!data) return "Invalid login credentials";
      email = data as string;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  },
  async signup(
    email: string,
    password: string,
    phone?: string,
    profile?: Record<string, string>,
  ): Promise<{ error: string | null; needsConfirmation: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...(typeof window !== "undefined" ? { emailRedirectTo: window.location.origin } : {}),
        data: { ...(profile ?? {}), ...(phone ? { phone } : {}) },
      },
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
  profile: () => profile,
  userId: () => currentUserId,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useDemoAuth() {
  return useSyncExternalStore(demoAuth.subscribe, demoAuth.isLoggedIn, () => false);
}

export function useProfile() {
  return useSyncExternalStore(demoAuth.subscribe, demoAuth.profile, () => null);
}
