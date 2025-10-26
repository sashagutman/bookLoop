import type { Genre } from "../Genre";
import type { Language } from "../Language";
import type { Status } from "../Status";

export interface Book {
  _id: string; 
  title: string;
  language: Language;
  author: string;
  publishedYear?: number;    
  readYear?: number | null;
  description?: string;
  genre: Genre;
  pages?: number;
  status: Status;
  image: string;
  rating: number;       
  likes: string[];
  wants?: string[]; 
  notes?: string;
  user_id: string;     
  createdAt: string;    
  updatedAt: string;

  _personal?: {
    liked?: boolean;
    want?: boolean;
    status?: "unread" | "reading" | "finished" | null;
    updatedAt?: string | null;
  };
}

