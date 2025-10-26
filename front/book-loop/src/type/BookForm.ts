import type { Genre } from "../interfaces/Genre";
import type { Language } from "../interfaces/Language";

export type BookForm = {
  title: string;
  author: string;
  language: Language;
  genre: Genre;

  publishedYear?: number;
  readYear?: number;
  pages?: number;
  rating?: number;

  image?: string;
  imageAlt?: string;
  description?: string;
  notes?: string;
};
