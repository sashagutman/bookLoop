import type { Book } from "../interfaces/books/Book";
import { apiBooks } from "./api";

function cleanParams(p: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(p).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
}

const GENRE_API_MAP: Record<string, string> = {
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

function mapGenre(genre?: string) {
  if (!genre) return undefined;
  return GENRE_API_MAP[genre] ?? genre;
}

export type BookSearchParams = {
  author?: string;
  title?: string;
  genre?: string;
  language?: string;
  lang?: string;
};

export async function searchBooks(params: BookSearchParams): Promise<Book[]> {
  const qp = cleanParams({
    ...params,
    genre: mapGenre(params.genre),
    lang: params.lang ?? params.language,
  });

  const { data } = await apiBooks.get("/", { params: qp });

  if (Array.isArray(data)) return data as Book[];

  const items =
    data?.items ??
    data?.results ??
    data?.data ??
    data?.books ??
    [];

  return items as Book[];
}
