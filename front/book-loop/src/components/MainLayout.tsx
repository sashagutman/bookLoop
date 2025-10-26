import type { FunctionComponent } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import SearchFilters from "./SearchFilters";
import Catalog from "./Catalog";
import { asGenre, asLang } from "../helpers/filters";

const MainLayout: FunctionComponent = () => {
  const [params, setParams] = useSearchParams();

  const qRaw = params.get("q");
  const gRaw = params.get("genre");
  const lRaw = params.get("lang");

  const q = qRaw ?? "";
  const genre = asGenre(gRaw); 
  const lang  = asLang(lRaw); 
    // установка параметра и сброс страницы
  const setParam = (name: string, value: string | null) => {
    const p = new URLSearchParams(params);
    if (value && value.trim()) p.set(name, value);
    else p.delete(name);
    if (name !== "page") p.delete("page"); 
    setParams(p, { replace: true });
  };
  // сброс фильтров
  const resetFilters = () => {
    const p = new URLSearchParams(params);
    p.delete("q"); p.delete("genre"); p.delete("lang"); p.delete("page");
    setParams(p, { replace: true });
  };

  const hasActive = Boolean((q && q.trim()) || genre || lang);

  return (
    <>
      <Dashboard />
      <SearchFilters
        query={q}
        genre={genre}
        lang={lang}
        onQueryChange={(val) => setParam("q", val)}
        onGenreChange={(val) => setParam("genre", val)}
        onLangChange={(val) => setParam("lang", val)}
        onReset={resetFilters}
        hasActive={hasActive}
      />
      <Catalog />
    </>
  );
};

export default MainLayout;
