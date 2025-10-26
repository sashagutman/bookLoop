import { useEffect, useState, useMemo } from "react";
import { useForm, type UseFormHandleSubmit, type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { Book } from "../interfaces/books/Book";
import type { BookForm } from "../types/BookForm";

export function useEditBookForm(
  editingBook: Book | null,
  saveEditedBook: (id: string, patch: Partial<Book>) => Promise<boolean>
) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<BookForm>({
    defaultValues: {
      title: "", author: "", language: "", genre: "",
      publishedYear: "", readYear: "", pages: "", rating: "",
      image: "", description: "", notes: "",
    },
  });

  useEffect(() => {
    if (!editingBook) return;
    reset({
      title: editingBook.title ?? "",
      author: editingBook.author ?? "",
      language: String(editingBook.language ?? ""),
      genre: String(editingBook.genre ?? ""),
      publishedYear: editingBook.publishedYear != null ? String(editingBook.publishedYear) : "",
      readYear: editingBook.readYear != null ? String(editingBook.readYear) : "",
      pages: editingBook.pages != null ? String(editingBook.pages) : "",
      rating: editingBook.rating != null ? String(editingBook.rating) : "",
      image: editingBook.image ?? "",
      description: editingBook.description ?? "",
      notes: editingBook.notes ?? "",
    });
  }, [editingBook, reset]);

  const onValid = useMemo(() => async (values: BookForm) => {
    if (!editingBook?._id) return false;
    setIsSaving(true);

    const toNum = (v?: string) => {
      if (v == null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const patch: Partial<Book> = {
      title: values.title,
      author: values.author,
      language: values.language as any,
      genre: values.genre as any,
      publishedYear: toNum(values.publishedYear),
      readYear: toNum(values.readYear) ?? null,
      pages: toNum(values.pages),
      rating: toNum(values.rating) ?? 0,
      image: values.image ?? "",
      description: values.description ?? "",
      notes: values.notes ?? "",
    };

    const ok = await saveEditedBook(editingBook._id, patch);
    setIsSaving(false);
    return ok;
  }, [editingBook, saveEditedBook]);

  return {
    register: register as UseFormRegister<BookForm>,
    errors: errors as FieldErrors<BookForm>,
    handleSubmitRHF: handleSubmit as UseFormHandleSubmit<BookForm>,
    onValid,
    isBusy: isSubmitting || isSaving,
  };
}
