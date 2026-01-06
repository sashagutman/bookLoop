import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Book } from "../interfaces/books/Book";
import { getAllBooks } from "../services/booksService";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isAbortError(e: any) {
  return (
    e?.name === "CanceledError" ||
    e?.code === "ERR_CANCELED" ||
    e?.name === "AbortError"
  );
}

function isRetryable(e: any) {
  const status = e?.response?.status;
  return !status || status === 502 || status === 503 || status === 504;
}

export type DashboardStats = {
  total: number;
  languagesCount: number;
  genresCount: number;
  avgRating: string; // "4.2" или "—"
};

function computeStats(books: Book[]): DashboardStats {
  const total = books.length;

  const languages = new Set(
    books
      .map((b: any) =>
        (b.language ?? b.lang ?? "").toString().toLowerCase().trim()
      )
      .filter(Boolean)
  );

  const genres = new Set(
    books.map((b: any) => String(b.genre ?? "").trim()).filter(Boolean)
  );

  const nums = books
    .map((b: any) => Number(b.rating))
    .filter((n: number) => Number.isFinite(n));

  const avgRating = nums.length
    ? (nums.reduce((s: number, n: number) => s + n, 0) / nums.length).toFixed(1)
    : "—";

  return {
    total,
    languagesCount: languages.size,
    genresCount: genres.size,
    avgRating,
  };
}

export function useDashboardStats() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (signal?: AbortSignal) => {
    const reqId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    const MAX_TRIES = 2;

    for (let attempt = 0; attempt <= MAX_TRIES; attempt++) {
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 12_000);

      try {
        const res = await getAllBooks(timeoutController.signal);
        clearTimeout(timeoutId);

        if (signal?.aborted || timeoutController.signal.aborted) return;
        if (reqId !== requestIdRef.current) return;

        const data = res?.data;
        setBooks(Array.isArray(data) ? data : []);
        setHasLoaded(true);
        setLoading(false);
        return;
      } catch (e: any) {
        clearTimeout(timeoutId);

        if (signal?.aborted) return;
        if (reqId !== requestIdRef.current) return;

        if (isAbortError(e)) {
          if (attempt < MAX_TRIES) {
            await sleep(700 * (attempt + 1));
            continue;
          }
          setBooks([]);
          setError("Timeout: request took too long");
          setHasLoaded(true);
          setLoading(false);
          return;
        }

        if (isRetryable(e) && attempt < MAX_TRIES) {
          await sleep(700 * (attempt + 1));
          continue;
        }

        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message || e?.message || "Failed to load books";

        setBooks([]);
        setError(status ? `[${status}] ${msg}` : msg);
        setHasLoaded(true);
        setLoading(false);
        return;
      }
    }
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    load(ac.signal);

    return () => ac.abort();
  }, [load]);

  const refetch = useCallback(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    return load(ac.signal);
  }, [load]);

  const stats = useMemo(() => computeStats(books), [books]);

  return { stats, books, loading, hasLoaded, error, refetch };
}
