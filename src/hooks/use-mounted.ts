import { useSyncExternalStore } from "react";

/**
 * Hook to check if component is mounted (useful for hydration issues)
 *
 * Uses useSyncExternalStore to avoid setState-in-effect issues
 */

function subscribe() {
  // No-op: mounted state never changes after initial hydration
  return () => {};
}

function getSnapshot() {
  return true; // Client is always mounted
}

function getServerSnapshot() {
  return false; // Server is never "mounted"
}

export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
