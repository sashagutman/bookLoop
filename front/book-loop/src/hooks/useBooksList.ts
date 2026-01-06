import { useEffect, useMemo, useRef, useState } from "react";
import type { Book } from "../interfaces/books/Book";
import { searchBooks } from "../services/searchService";

export type UseBooksQuery = {
  q?: string;
  genre?: string;
  language?: string;
  page?: number;
  limit?: number;
};

function buildParams({ q, genre, language }: UseBooksQuery) {
  const trimmed = (q ?? "").trim();

  const params: Record<string, string> = {};
  if (trimmed) {
    params.author = trimmed;
    params.title = trimmed;
  }
  if (genre) params.genre = genre;
  if (language) {
    params.language = language;
    params.lang = language;
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => String(v ?? "").trim() !== "")
  );
}

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

export function useBooksList(input: UseBooksQuery) {
  const { q, genre, language, page: pageInput, limit: limitInput } = input;

  const page = Math.max(1, Number(pageInput ?? 1));
  const limit = Math.max(1, Number(limitInput ?? 8));

  const [allItems, setAllItems] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  // актуальные page/limit даже если изменились пока запрос летел
  const pageRef = useRef(page);
  const limitRef = useRef(limit);
  useEffect(() => {
    pageRef.current = page;
    limitRef.current = limit;
  }, [page, limit]);

  const query = useMemo(() => buildParams({ q, genre, language }), [q, genre, language]);

  const filtersKey = useMemo(
    () => JSON.stringify(query, Object.keys(query).sort()),
    [query]
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // clamp page по данным и режем текущую страницу
  const slicePage = (items: Book[]) => {
    const L = Math.max(1, limitRef.current);
    const pages = Math.max(1, Math.ceil(items.length / L));
    const P = Math.max(1, Math.min(pageRef.current, pages));
    const start = (P - 1) * L;
    return items.slice(start, start + L);
  };

  async function load(signal?: AbortSignal) {
    const reqId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    const MAX_TRIES = 2;

    for (let attempt = 0; attempt <= MAX_TRIES; attempt++) {
      const timeoutController = new AbortController();
      // таймаут 12 сек
      const timeoutId = setTimeout(() => timeoutController.abort(), 12_000);

      try {
        const items = await searchBooks(query, timeoutController.signal);

        clearTimeout(timeoutId);

        if (signal?.aborted || timeoutController.signal.aborted) return;
        if (reqId !== requestIdRef.current) return;

        setAllItems(items);
        setTotal(items.length);
        // books пересчитаются в эффекте ниже

        setHasLoaded(true);
        setLoading(false);
        return;
      } catch (e: any) {
        clearTimeout(timeoutId);

        if (signal?.aborted) return;
        if (reqId !== requestIdRef.current) return;

        // abort / timeout
        if (isAbortError(e)) {
          if (attempt < MAX_TRIES) {
            await sleep(700 * (attempt + 1));
            continue;
          }
          setAllItems([]);
          setTotal(0);
          setError("Timeout: books request took too long");
          setHasLoaded(true);
          setLoading(false);
          return;
        }

        // retryable
        if (isRetryable(e) && attempt < MAX_TRIES) {
          await sleep(700 * (attempt + 1));
          continue;
        }

        const status = e?.response?.status;
        const msg = e?.response?.data?.message || e?.message || "Failed to load books";

        setAllItems([]);
        setTotal(0);
        setError(status ? `[${status}] ${msg}` : msg);
        setHasLoaded(true);
        setLoading(false);
        return;
      }
    }
  }
  // грузим при смене фильтров
  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    load(ac.signal);

    return () => ac.abort();
  }, [filtersKey]);
  // пересчитываем books при смене данных/страницы
  useEffect(() => {
    setBooks(slicePage(allItems));
  }, [allItems, page, limit]);

  const refetch = () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    return load(ac.signal);
  };

  return { books, setBooks, total, totalPages, loading, error, hasLoaded, refetch};
}
