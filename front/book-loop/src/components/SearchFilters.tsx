import type { FunctionComponent } from "react";
import { LiaFilterSolid } from "react-icons/lia";
import Select from "react-select";
import "../style/search-filters.css";
import {
  GENRE_VALUES, LANG_VALUES,
  type GenreValue, type LangValue,
  labelGenre, labelLang,
} from "../helpers/filters";
import { RiResetLeftLine } from "react-icons/ri";

export interface SearchFiltersProps {
  query: string;
  genre: GenreValue | null;
  lang: LangValue | null;
  onQueryChange: (q: string) => void;
  onGenreChange: (g: GenreValue | null) => void;
  onLangChange: (l: LangValue | null) => void;
  onReset?: () => void;
  hasActive?: boolean;
}

// options от констант
const genreOptions = GENRE_VALUES.map(v => ({ value: v, label: labelGenre[v] }));
const languageOptions = LANG_VALUES.map(v => ({ value: v, label: labelLang[v] }));

const SearchFilters: FunctionComponent<SearchFiltersProps> = ({
  query, genre, lang, onQueryChange, onGenreChange, onLangChange, onReset, hasActive,
}) => {
  const genreValue = genre ? { value: genre, label: labelGenre[genre] } : null;
  const langValue  = lang  ? { value: lang,  label: labelLang[lang] }   : null;

  return (
    <div className="search-filters_inner">
      <div className="container">
        <div className="search-filters">
          <input
            type="search"
            placeholder="Search by title or author..."
            className="search-input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />

          <div className="filters">
            <label className="filter-label">
              <LiaFilterSolid /> Filters:
            </label>

            <div className="filter-genre box-filter">
              <Select
                className="filter-select"
                classNamePrefix="rs"
                options={genreOptions}
                value={genreValue}
                onChange={(opt) => onGenreChange(opt ? (opt.value as GenreValue) : null)}
                isClearable
                placeholder="Genre"
              />
            </div>

            <div className="filter-language box-filter">
              <Select
                className="filter-select"
                classNamePrefix="rs"
                options={languageOptions}
                value={langValue}
                onChange={(opt) => onLangChange(opt ? (opt.value as LangValue) : null)}
                isClearable
                placeholder="Language"
              />
            </div>

            {onReset && (
              <div className="filters-actions">
                <button
                  type="button"
                  className="btn-flip"
                  onClick={onReset}
                  disabled={!hasActive}
                  title="Reset filters"
                >
                  <span className="front">Reset</span>
                  <span className="back"><RiResetLeftLine /></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;


