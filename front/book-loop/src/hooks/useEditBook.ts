import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getBookById, updateBookById } from "../services/booksService";
import type { Book } from "../interfaces/books/Book";
import type { Language } from "../interfaces/Language";
import type { Genre } from "../interfaces/Genre";
import type { BookForm } from "../interfaces/forms/BookForm";
import type { CreateBookPayload } from "../interfaces/books/CreateBookPayload";

export function useEditBook(
  open: boolean,
  bookId: string | null,
  onUpdated?: (b: Book) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<BookForm>({
      mode: "onSubmit",
      defaultValues: {
        title: "", author: "", language: "", genre: "",
        publishedYear: "", readYear: "", pages: "", rating: "",
        image: "", description: "", notes: "",
      },
    });

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!open || !bookId) return;
      try {
        setIsLoading(true);
        const { data } = await getBookById(bookId);
        if (ignore) return;

        const b = data as Book;
        const image = typeof b.image === "string" ? b.image : (b as any)?.image?.url || "";

        reset({
          title: b.title ?? "",
          author: b.author ?? "",
          language: (b.language as Language) ?? "",
          genre: (b.genre as Genre) ?? "",
          publishedYear: b.publishedYear != null ? String(b.publishedYear) : "",
          readYear:      b.readYear      != null ? String(b.readYear)      : "",
          pages:         b.pages         != null ? String(b.pages)         : "",
          rating:        b.rating        != null ? String(b.rating)        : "",
          image,
          description: (b.description ?? "").toString(),
          notes:       (b.notes ?? "").toString(),
        });
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load book");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [open, bookId, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        title: "", author: "", language: "", genre: "",
        publishedYear: "", readYear: "", pages: "", rating: "",
        image: "", description: "", notes: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (values: BookForm): Promise<boolean> => {
    if (!bookId) return false;
    try {
      const publishedYear = Number(values.publishedYear);
      // rating поле должно уходить даже когда 0
      const rawRating = (values as any).rating;
      const rating =
        rawRating === "" || rawRating === undefined || rawRating === null
          ? undefined
          : Number(rawRating);

      if (rating !== undefined && (!Number.isFinite(rating) || rating < 0 || rating > 5)) {
        toast.error("Rating must be 0..5");
        return false;
      }

      const payload: CreateBookPayload = {
        title: values.title.trim(),
        author: values.author.trim(),
        language: values.language as Language,
        genre: values.genre as Genre,
        publishedYear,
        ...(values.readYear?.trim() ? { readYear: Number(values.readYear) } : {}),
        ...(values.pages?.trim() ? { pages: Number(values.pages) } : {}),
        ...(values.image?.trim() ? { image: values.image.trim() } : {}),
        // description/notes всегда строками (чтобы можно было очистить поле)
        description: (values.description ?? "").toString().trim(),
        notes:       (values.notes ?? "").toString().trim(),
        // rating — ложим полем (чтобы 0 не потерялся)
        rating,
      };
      
      const { data } = await updateBookById(bookId, payload);
      toast.success("Book updated");
      onUpdated?.(data as Book);
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update");
      return false;
    }
  };

  return { isLoading, register, handleSubmit, errors, isSubmitting, onSubmit };
}
