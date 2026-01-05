// import { useEffect, useMemo, useRef, useState } from "react";
// import type { Book } from "../interfaces/books/Book";
// import { searchBooks } from "../services/searchService";

// export type UseBooksQuery = {
//   q?: string;
//   genre?: string;
//   language?: string;
//   page?: number;   // поддержка пагинации
//   limit?: number;  // поддержка пагинации
// };

// function buildParams({ q, genre, language }: UseBooksQuery) {
//   const trimmed = (q ?? "").trim();

//   const params: Record<string, string> = {};
//   if (trimmed) {
//     // текущая логика: искать и по автору, и по названию
//     params.author = trimmed;
//     params.title = trimmed;
//   }
//   if (genre) params.genre = genre;
//   if (language) {
//     params.language = language;
//     params.lang = language; 
//   }

//   return Object.fromEntries(
//     Object.entries(params).filter(([, v]) => String(v ?? "").trim() !== "")
//   );
// }

// export function useBooksList(input: UseBooksQuery) {
//   const {
//     q,
//     genre,
//     language,
//     page: pageInput,
//     limit: limitInput,
//   } = input;

//   const page = Math.max(1, Number(pageInput ?? 1));
//   const limit = Math.max(1, Number(limitInput ?? 8));

//   const [allItems, setAllItems] = useState<Book[]>([]); 
//   const [books, setBooks] = useState<Book[]>([]);     
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const abortRef = useRef<AbortController | null>(null);

//   const query = useMemo(() => buildParams({ q, genre, language }), [q, genre, language]);
//   const filtersKey = useMemo(
//     () => JSON.stringify(query, Object.keys(query).sort()),
//     [query]
//   );

//   const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

//   // загрузка полного списка по фильтрам
//   async function load(signal?: AbortSignal) {
//     setLoading(true);
//     setError(null);
//     try {
//       const items = await searchBooks(query); 
//       if (signal?.aborted) return;
//       setAllItems(items);
//       setTotal(items.length);
//     } catch (e: any) {
//       if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED" || e?.name === "AbortError") return;
//       const status = e?.response?.status;
//       const msg = e?.response?.data?.message || e?.message || "Failed to load books";
//       setAllItems([]);
//       setBooks([]);
//       setTotal(0);
//       setError(status ? `[${status}] ${msg}` : msg);
//       if (import.meta.env.DEV) console.error("[useBooksList]", status, msg, e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Фетчим при изменении фильтров
//   useEffect(() => {
//     abortRef.current?.abort();
//     const ac = new AbortController();
//     abortRef.current = ac;

//     load(ac.signal);
    

//     return () => ac.abort();
//   }, [filtersKey]);

//   useEffect(() => {
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   const slice = allItems.slice(start, end);
//   setBooks(slice);
// }, [allItems, page, limit]);

//   const refetch = () => load();

//   return {
//     books,          
//     setBooks,      
//     total,          
//     totalPages, 
//     loading,
//     error,
//     refetch,
//   };
// }


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

export function useBooksList(input: UseBooksQuery) {
  const { q, genre, language, page: pageInput, limit: limitInput } = input;

  const page = Math.max(1, Number(pageInput ?? 1));
  const limit = Math.max(1, Number(limitInput ?? 8));

  const [allItems, setAllItems] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const query = useMemo(() => buildParams({ q, genre, language }), [q, genre, language]);
  const filtersKey = useMemo(
    () => JSON.stringify(query, Object.keys(query).sort()),
    [query]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setError(null);

    try {
      // прокинули signal
      const items = await searchBooks(query, signal);
      if (signal?.aborted) return;

      setAllItems(items);
      setTotal(items.length);
      // добавление slice здесь, чтобы избежать гонок при быстром переключении страниц
      const start = (page - 1) * limit;
      setBooks(items.slice(start, start + limit));
    } catch (e: any) {
      if (
        e?.name === "CanceledError" ||
        e?.code === "ERR_CANCELED" ||
        e?.name === "AbortError"
      ) {
        return;
      }

      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || "Failed to load books";

      setAllItems([]);
      setBooks([]);
      setTotal(0);
      setError(status ? `[${status}] ${msg}` : msg);

      if (import.meta.env.DEV) console.error("[useBooksList]", status, msg, e);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    load(ac.signal);

    return () => ac.abort();
  }, [filtersKey, page, limit]); // ✅ добавил page/limit, чтобы при смене страницы
    // slice не делался по старым данным в редких гонках

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setBooks(allItems.slice(start, end));
  }, [allItems, page, limit]);

  const refetch = () => load();

  return {
    books,
    setBooks,
    total,
    totalPages,
    loading,
    error,
    refetch,
  };
}

