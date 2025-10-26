import { useEffect, useState } from "react";
import { getToken } from "../services/tokenService";
import { getMe } from "../services/userService";
import type { User } from "../interfaces/users/User";

function normalizeUser(payload: any): User | null {
  if (!payload || typeof payload !== "object") return null;
  const u = "user" in payload ? payload.user : payload; 

  // чистка пустых строк в image
  if (u?.image?.url === "") delete u.image.url;
  if (u?.image?.alt === "") delete u.image.alt;

  return u as User;
}

export function useCurrentUser(enabled = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!enabled);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!enabled) { if (alive) setUser(null); return; }

      const token = getToken();
      if (!token) { if (alive) setUser(null); return; }

      try {
        setLoading(true); setError(null);
        const res = await getMe();              
        const u = normalizeUser(res?.data);
        if (alive) setUser(u);
      } catch (e) {
        if (alive) { setError(e); setUser(null); }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [enabled]);

  return { user, loading, error };
}
