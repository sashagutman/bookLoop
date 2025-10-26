import { useEffect, useState } from "react";
import axios from "axios";

type Stats = {
  total: number;
  favorites: number;
  toRead: number;
  reading: number;
  finished: number;
};

const API: string = import.meta.env.VITE_BOOKS_API_URL;
const authHeaders = () => ({ headers: { "x-auth-token": localStorage.getItem("token") || "" } });

export function invalidateStats() {
  window.dispatchEvent(new Event("stats:invalidate"));
}

export function useUserStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [{ total, favorites, toRead, reading, finished }, setStats] = useState<Stats>({
    total: 0, favorites: 0, toRead: 0, reading: 0, finished: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ownRes, favRes, wantRes, readingRes, finishedRes] = await Promise.all([
        axios.get(`${API}/my-books`, { params: { owned: "true" }, ...authHeaders() }),
        axios.get(`${API}/my-books`, { params: { favorites: "true" }, ...authHeaders() }),
        axios.get(`${API}/my-books`, { params: { want: "true" }, ...authHeaders() }),
        axios.get(`${API}/my-books`, { params: { status: "reading" }, ...authHeaders() }),
        axios.get(`${API}/my-books`, { params: { status: "finished" }, ...authHeaders() }),
      ]);
      setStats({
        total: Array.isArray(ownRes.data) ? ownRes.data.length : 0,
        favorites: Array.isArray(favRes.data) ? favRes.data.length : 0,
        toRead: Array.isArray(wantRes.data) ? wantRes.data.length : 0,
        reading: Array.isArray(readingRes.data) ? readingRes.data.length : 0,
        finished: Array.isArray(finishedRes.data) ? finishedRes.data.length : 0,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load stats");
      setStats({ total: 0, favorites: 0, toRead: 0, reading: 0, finished: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => { if (alive) await fetchStats(); })();
    const onInvalidate = () => fetchStats();
    window.addEventListener("stats:invalidate", onInvalidate);
    return () => { alive = false; window.removeEventListener("stats:invalidate", onInvalidate); };
  }, []);

  return { total, favorites, toRead, reading, finished, loading, error, refetch: fetchStats };
}
