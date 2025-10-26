import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { asGenre, asLang } from "../helpers/filters";
import { useDebouncedValue } from "./useDebouncedValue";

export function useCatalogParams(defaultPageSize = 8) {
  const [params, setParams] = useSearchParams();

  const qRaw = params.get("q") ?? "";
  const genre = asGenre(params.get("genre"));
  const lang = asLang(params.get("lang"));
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = defaultPageSize;

  const debouncedQ = useDebouncedValue(qRaw, 350);

  // сброс страницы на 1 при смене фильтров
  const prevFiltersRef = useRef({ q: debouncedQ, genre, lang });
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const changed = prev.q !== debouncedQ || prev.genre !== genre || prev.lang !== lang;
    prevFiltersRef.current = { q: debouncedQ, genre, lang };
    if (!changed) return;

    setParams(prevParams => {
      const p = new URLSearchParams(prevParams);
      p.set("page", "1");
      return p;
    });
  }, [debouncedQ, genre, lang, setParams]);

  const handlePageChange = (nextPage: number) => {
    setParams(prev => {
      const p = new URLSearchParams(prev);
      p.set("page", String(nextPage));
      return p;
    });
    const top = document.getElementById("catalog")?.offsetTop ?? 0;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const filtersKey = useMemo(
    () => `${debouncedQ}|${genre ?? ""}|${lang ?? ""}`,
    [debouncedQ, genre, lang]
  );

  return {
    params: { q: qRaw, genre, lang, page, limit, debouncedQ, filtersKey },
    setParams,
    handlePageChange,
  };
}
