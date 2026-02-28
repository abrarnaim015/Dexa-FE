const KEY = "admin_last_seen_audit_log";

export function getLastSeen(): string | null {
  return localStorage.getItem(KEY);
}

export function setLastSeen(value: string) {
  localStorage.setItem(KEY, value);
}
