import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getBookById, updateBookById } from "../services/booksService";
import type { Book } from "../interfaces/books/Book";
import type { Language } from "../interfaces/Language";
import type { Genre } from "../interfaces/Genre";
//
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

export function useEditBook(
  open: boolean,
  bookId: string | null,
  onUpdated?: (b: Book) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const {register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<BookForm>({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      author: "",
      language: "" as Language | "",
      genre: "" as Genre | "",
      publishedYear: "",
      readYear: "",
      pages: "",
      rating: "",
      image: "",
      description: "",
      notes: "",
    },
  });

  // загрузка книги при открытии
  useEffect(() => {
    let ignore = false;

    (async () => {if (!open || !bookId) return;

      try { setIsLoading(true);
        const { data } = await getBookById(bookId);
        if (ignore) return;

        const b = data as Book;
        const image = typeof b.image === "string" ? b.image : (b as any)?.image?.url || "";
        // заполняем форму
        reset({
          title: b.title || "",
          author: b.author || "",
          language: (b.language as Language) ?? ("" as Language | ""),
          genre: (b.genre as Genre) ?? ("" as Genre | ""),
          publishedYear: b.publishedYear != null ? String(b.publishedYear) : "",
          readYear: b.readYear != null ? String(b.readYear) : "",
          pages: b.pages != null ? String(b.pages) : "",
          rating: b.rating != null ? String(b.rating) : "",
          image,
          description: b.description || "",
          notes: b.notes || "",
        });
      } catch (e: any) {
        const msg = e?.response?.data?.message ||"Failed to load book";
        toast.error(msg);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [open, bookId, reset]);

  // очищаем форму при закрытии, чтобы не мигали старые данные
  useEffect(() => {
    if (!open) {
      reset({
        title: "",
        author: "",
        language: "" as Language | "",
        genre: "" as Genre | "",
        publishedYear: "",
        readYear: "",
        pages: "",
        rating: "",
        image: "",
        description: "",
        notes: "",
      });
    }
  }, [open, reset]);

  // отправка формы
  const onSubmit = async (values: BookForm): Promise<boolean> => {
    if (!bookId) return false;

    try {
      const payload = {
        title: values.title.trim(),
        author: values.author.trim(),
        language: values.language as Language,
        genre: values.genre as Genre,
        publishedYear: values.publishedYear?.trim()
          ? Number(values.publishedYear)
          : undefined, 
        readYear: values.readYear?.trim() ? Number(values.readYear) : undefined,
        pages: values.pages?.trim() ? Number(values.pages) : undefined,
        rating: values.rating?.trim() ? Number(values.rating) : undefined,
        image: values.image?.trim() || undefined,
        description: values.description?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      };

      const { data } = await updateBookById(bookId, payload);
      toast.success("Book updated");
      onUpdated?.(data as Book);
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update";
      toast.error(msg);
      return false;
    }
  };

  return { isLoading, register, handleSubmit, errors, isSubmitting, onSubmit };
}