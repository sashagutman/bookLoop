import type { Language } from "../Language";
import type { Genre } from "../Genre";

export type BookForm = {
  title: string;
  author: string;
  language: Language | ""; 
  genre: Genre | "";       
  publishedYear: string;  
  readYear?: string;
  pages?: string;
  rating?: string;
  image?: string;
  description?: string;
  notes?: string;
};
