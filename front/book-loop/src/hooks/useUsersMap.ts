import { useEffect, useState, useMemo } from "react";
import type { User } from "../interfaces/users/User";
import { getAllUsers } from "../services/userService";

const fullName = (u: User) =>
  [u?.name?.first, u?.name?.last].filter(Boolean).join(" ").trim() || "User";

export function useUsersMap() {
  const [userNames, setUserNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await getAllUsers();
        const payload = res?.data as any;
        const users: User[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.users)
          ? payload.users
          : [];

        if (!ignore) {
          const m = new Map<string, string>();
          users.forEach(u => { if (u?._id) m.set(u._id, fullName(u)); });
          setUserNames(m);
        }
      } catch {/* ignore */}
    })();
    return () => { ignore = true; };
  }, []);

  const getOwnerName = useMemo(
    () => (id?: string) => (id ? userNames.get(id) ?? "—" : "—"),
    [userNames]
  );

  return { userNames, getOwnerName };
}
