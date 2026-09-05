import { useSyncExternalStore } from "react";

// Demo-only session state for the UI flow (no real authentication).
let loggedIn = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const demoAuth = {
  login() {
    loggedIn = true;
    emit();
  },
  logout() {
    loggedIn = false;
    emit();
  },
  isLoggedIn: () => loggedIn,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useDemoAuth() {
  return useSyncExternalStore(demoAuth.subscribe, demoAuth.isLoggedIn, () => false);
}
