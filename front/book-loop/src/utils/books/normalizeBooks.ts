import type { CreateBookPayload } from "../../interfaces/books/CreateBookPayload";
import type { CreateBookValues } from "../../interfaces/books/CreateBookValues";

export function normalizeBooks(values: CreateBookValues): CreateBookPayload {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    language: values.language,
    publishedYear: values.publishedYear,
    readYear: values.readYear ?? undefined,
    description: values.description?.trim() || undefined,
    genre: values.genre,
    pages: values.pages ?? undefined,
    image: values.image?.trim() || undefined,
    rating: values.rating ?? undefined,
    notes: values.notes?.trim() || undefined,
  };
}
