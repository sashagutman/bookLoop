import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../interfaces/books/Book";
import { getAllBooks, deleteBook, updateBookById } from "../services/booksService";
import { confirmDeleteBook } from "../helpers/modals";
import { toast } from "sonner";

import type { CreateBookPayload } from "../interfaces/books/CreateBookPayload";
import type { Genre } from "../interfaces/Genre";
import type { Language } from "../interfaces/Language";

export function useAdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const viewed = useMemo(() => books.find(b => b._id === viewId) ?? null, [books, viewId]);
  const editingBook = useMemo(() => books.find(b => b._id === editId) ?? null, [books, editId]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await getAllBooks();
        const payload = res?.data as any;
        const data: Book[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.books)
          ? payload.books
          : [];
        if (!ignore) setBooks(data);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!ignore) setBooks([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [navigate]);

  async function handleDelete(book: Book) {
    const ok = await confirmDeleteBook(book.title);
    if (!ok) return;

    const prev = books;
    setBooks(p => p.filter(b => b._id !== book._id));
    if (viewId === book._id) setViewId(null);
    if (editId === book._id) setEditId(null);

    try {
      await deleteBook(book._id);
      toast.success("Book deleted");
    } catch (e: any) {
      setBooks(prev);
      if (e?.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        toast.error("Failed to delete");
      }
    }
  }

  async function saveEditedBook(id: string, patch: Partial<Book>) {
    const base = books.find(b => b._id === id);
    if (!base) {
      toast.error("Book not found");
      return false;
    }

    // обязательные поля CreateBookPayload
    const title = patch.title ?? base.title;
    const author = patch.author ?? base.author;
    const language = (patch.language ?? base.language) as Language;
    const genre = (patch.genre ?? base.genre) as Genre;

    // publishedYear обязателен и number
    const publishedYear =
      typeof patch.publishedYear === "number" ? patch.publishedYear : base.publishedYear;

    if (!title || !author || !language || !genre || typeof publishedYear !== "number") {
      toast.error("Please fill required fields (title, author, language, genre, publishedYear)");
      return false;
    }

    const payload: CreateBookPayload = {
      title,
      author,
      language,
      genre,
      publishedYear,
      readYear: (patch.readYear ?? base.readYear) ?? null,
      description: patch.description ?? base.description ?? "",
      pages: (patch.pages ?? base.pages) ?? null,
      image: patch.image ?? base.image ?? "",
      rating: (patch.rating ?? base.rating) ?? null,
      notes: patch.notes ?? base.notes ?? "",
    };

    try {
      const { data: updated } = await updateBookById(id, payload);
      setBooks(prev => prev.map(b => (b._id === id ? { ...b, ...updated } : b)));
      setEditId(null);
      toast.success("Book updated");
      return true;
    } catch (e: any) {
      if (e?.response?.status === 401) navigate("/login", { replace: true });
      return false;
    }
  }

  return {
    books, isLoading,
    viewId, setViewId, viewed,
    editId, setEditId, editingBook,
    handleDelete, saveEditedBook,
  };
}
