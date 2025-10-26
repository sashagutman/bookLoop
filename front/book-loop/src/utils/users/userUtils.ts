import type { User } from "../../interfaces/users/User";

export function safeLocaleDate(v?: string | number | Date) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export function fullName(u?: User | null) {
  if (!u) return "User";
  return [u?.name?.first, u?.name?.middle, u?.name?.last].filter(Boolean).join(" ").trim() || "User";
}

export function normalizeUsers(payload: unknown): User[] {
  if (!payload || typeof payload !== "object") return [];
  const any = payload as any;
  if (Array.isArray(any)) return any as User[];
  if (Array.isArray(any?.users)) return any.users as User[];
  return [];
}

