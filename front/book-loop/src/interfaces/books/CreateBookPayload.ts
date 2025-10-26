import type { Genre } from "../Genre";
import type { Language } from "../Language";

export interface CreateBookPayload {
  title: string;
  author: string;
  language: Language;          
  publishedYear: number;       
  readYear?: number | null;
  description?: string;
  genre: Genre;                
  pages?: number | null;
  image?: string;              
  rating?: number | null;      
  notes?: string;
}
