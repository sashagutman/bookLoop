import type { Genre } from "../Genre";
import type { Language } from "../Language";

export interface UnnormalizedBook {
  title: string;
  author: string;
  publishedYear?: number;
  language: Language;
  readYear?: number | null;
  description?: string; 
  genre: Genre,
  pages?: number;
  image: string;
  rating?: number | null;
  likes?: string[];
  notes?: string;
}