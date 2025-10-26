import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createBook } from "../services/booksService";
import { notify } from "../helpers/notify";
import type { CreateBookPayload } from "../interfaces/books/CreateBookPayload";
import type { Genre } from "../interfaces/Genre";
import type { Language } from "../interfaces/Language";

const currentYear = new Date().getFullYear();
// универсальный тип для input, textarea, select
type InputLike = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;


export type AddBookFormState = {
    title: string;
    author: string;
    language: Language | "";
    genre: Genre | "";
    publishedYear: string;
    readYear: string;
    pages: string;
    rating: string;
    image: string;
    description: string;
    notes: string;
};

const INITIAL_STATE: AddBookFormState = {
    title: "",
    author: "",
    language: "" as Language | "",
    genre: "" as Genre | "",
    publishedYear: String(currentYear),
    readYear: "",
    pages: "",
    rating: "",
    image: "",
    description: "",
    notes: "",
};

export function useAddBookForm(onClose: () => void) {
    const [form, setForm] = useState<AddBookFormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // управление формой
    const reset = useCallback(() => setForm(INITIAL_STATE), []);
    const setField = useCallback(<K extends keyof AddBookFormState>(key: K, value: AddBookFormState[K]) => {
        setForm((s) => ({ ...s, [key]: value }));
    }, []);

    const onChange = useCallback((e: ChangeEvent<InputLike>) => {
  const { name, value } = e.target;
  setForm((s) => ({ ...s, [name]: value }));
}, []);
    // валидация формы при сабмите
    const validate = useCallback((): string | null => {
        if (!form.title.trim() || !form.author.trim() || !form.language || !form.genre || !form.publishedYear.trim()) {
            return "Please fill Title, Author, Language, Genre and Published Year";
        }
        const pub = Number(form.publishedYear);
        if (Number.isNaN(pub) || pub < 0 || pub > currentYear) {
            return `Published Year must be between 0 and ${currentYear}`;
        }
        if (form.readYear) {
            const ry = Number(form.readYear);
            if (Number.isNaN(ry) || ry < 0 || ry > currentYear) return `Read Year must be between 0 and ${currentYear}`;
        }
        if (form.rating) {
            const r = Number(form.rating);
            if (Number.isNaN(r) || r < 0 || r > 5) return "Rating must be 0–5";
        }
        return null;
    }, [form]);

    const toPayload = useCallback((): CreateBookPayload => {
        return {
            title: form.title.trim(),
            author: form.author.trim(),
            language: form.language as Language,
            genre: form.genre as Genre,
            publishedYear: Number(form.publishedYear),
            readYear: form.readYear.trim() ? Number(form.readYear) : undefined,
            pages: form.pages.trim() ? Number(form.pages) : undefined,
            rating: form.rating.trim() ? Number(form.rating) : undefined,
            image: form.image.trim() || undefined,
            description: form.description.trim() || undefined,
            notes: form.notes.trim() || undefined,
        };
    }, [form]);
    // обработчики
    const handleCancel = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);
    // сабмит формы
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            notify?.error?.(err);
            return;
        }
        try {
            setIsSubmitting(true);
            const payload = toPayload();
            await createBook(payload);
            notify?.success?.("Book added");
            handleCancel(); // сбросить и закрыть
        } catch (ex: any) {
            console.error("createBook failed:", ex);
            notify?.error?.(ex?.response?.data?.message || "Failed to add book");
        } finally {
            setIsSubmitting(false);
        }
    }, [validate, toPayload, handleCancel]);
    // языки книг
    const languages = useMemo(
        () => ["en", "ru", "uk", "he", "es", "de", "fr", "it", "pl", "pt", "other"] as const,
        []
    );
    // жанры книг
    const genres = useMemo(
        () => ["fiction", "non_fiction", "fantasy", "sci_fi", "detective", "thriller", "romance", "horror", "history", "biography", "classic", "poetry", "graphic_novel", "other"] as const,
        []
    );

    return {
        form, setForm, setField, onChange,
        isSubmitting, handleSubmit, handleCancel,
        languages, genres, currentYear,
    };
}

