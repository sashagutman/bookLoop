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
    return () => {
      ignore = true;
    };
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

  //helpers
  const toNumUndef = (v: unknown): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = typeof v === "string" ? Number(v) : (v as number);
    return Number.isFinite(n) ? n : undefined;
  };

  // image всегда превращается в строку url
  const normalizeImage = (img: unknown): string => {
    const s =
      typeof img === "string"
        ? img.trim()
        : (img as any)?.url && typeof (img as any).url === "string"
        ? String((img as any).url).trim()
        : "";
    return s;
  };

  async function saveEditedBook(id: string, patch: Partial<Book>) {
    const base = books.find(b => b._id === id);
    if (!base) {
      toast.error("Book not found");
      return false;
    }
    // обязательные поля
    const title = (patch.title ?? base.title)?.trim();
    const author = (patch.author ?? base.author)?.trim();
    const language = (patch.language ?? base.language) as Language;
    const genre = (patch.genre ?? base.genre) as Genre;

    const pubRaw = patch.publishedYear ?? base.publishedYear;
    const publishedYear =
      typeof pubRaw === "string" ? Number(pubRaw) : pubRaw;

    if (
      !title ||
      !author ||
      !language ||
      !genre ||
      typeof publishedYear !== "number" ||
      !Number.isFinite(publishedYear)
    ) {
      toast.error("Please fill required fields (title, author, language, genre, publishedYear)");
      return false;
    }

    // опциональные поля
    const readYear = toNumUndef(patch.readYear ?? base.readYear);
    const pages = toNumUndef(patch.pages ?? base.pages);
    const rating = toNumUndef(patch.rating ?? base.rating);

    const image = normalizeImage(patch.image ?? base.image);
    const description = ((patch.description ?? base.description) ?? "").toString().trim();
    const notes = ((patch.notes ?? base.notes) ?? "").toString().trim();

    const basePayload = {
      title,
      author,
      language,
      genre,
      publishedYear,
      image,       
      description,  
      notes,     
    };

    const payload: CreateBookPayload = {
      ...basePayload,
      ...(readYear !== undefined ? { readYear } : {}),
      ...(pages !== undefined ? { pages } : {}),
      ...(rating !== undefined ? { rating } : {}),
    } as CreateBookPayload;

    try {
      const { data: updated } = await updateBookById(id, payload);
      setBooks(prev => prev.map(b => (b._id === id ? { ...b, ...updated } : b)));
      setEditId(null);
      toast.success("Book updated");
      return true;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to update";
      toast.error(msg);
      if (e?.response?.status === 401) navigate("/login", { replace: true });
      return false;
    }
  }

  return {
    books,
    isLoading,
    viewId,
    setViewId,
    viewed,
    editId,
    setEditId,
    editingBook,
    handleDelete,
    saveEditedBook,
  };
}
