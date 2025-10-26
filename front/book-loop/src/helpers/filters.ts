export const GENRE_VALUES = [
  "fiction","non_fiction","fantasy","sci_fi","detective",
  "thriller","romance","horror","history","biography",
  "classic","poetry","graphic_novel","other",
] as const;

export type GenreValue = typeof GENRE_VALUES[number];

export const LANG_VALUES = [
  "en","ru","uk","he","es","de","fr","it","pl","pt","other",
] as const;

export type LangValue = typeof LANG_VALUES[number];

export function asGenre(v: string | null): GenreValue | null {
  return GENRE_VALUES.includes(v as any) ? (v as GenreValue) : null;
}
export function asLang(v: string | null): LangValue | null {
  return LANG_VALUES.includes(v as any) ? (v as LangValue) : null;
}

export const labelGenre: Record<GenreValue, string> = {
  fiction: "Fiction", non_fiction: "Non-fiction", fantasy: "Fantasy", sci_fi: "Sci-Fi",
  detective: "Detective", thriller: "Thriller", romance: "Romance", horror: "Horror",
  history: "History", biography: "Biography", classic: "Classic",
  poetry: "Poetry", graphic_novel: "Graphic novel", other: "Other",
};
export const labelLang: Record<LangValue, string> = {
  en: "English", ru: "Russian", uk: "Ukrainian", he: "Hebrew", es: "Spanish",
  de: "German", fr: "French", it: "Italian", pl: "Polish", pt: "Portuguese", other: "Other",
};
// mapping for API
export const GENRE_API_MAP: Record<GenreValue, string> = {
  fiction: "fiction",
  non_fiction: "non_fiction",  
  fantasy: "fantasy",
  sci_fi: "sci_fi",             
  detective: "detective",
  thriller: "thriller",
  romance: "romance",
  horror: "horror",
  history: "history",
  biography: "biography",
  classic: "classic",
  poetry: "poetry",
  graphic_novel: "graphic_novel",
  other: "other",
};
