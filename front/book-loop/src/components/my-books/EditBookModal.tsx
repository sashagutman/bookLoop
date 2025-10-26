import type { FunctionComponent } from "react";
import Loading from "../Loading";
import EditBookForm from "../../components/my-books/EditBookForm";
import { useEditBook, type BookForm } from "../../hooks/useEditBook";
import type { Language } from "../../interfaces/Language";
import type { Genre } from "../../interfaces/Genre";
import type { Book } from "../../interfaces/books/Book";
import "../../style/edit-profile.css";
// строгое перечисление языков
const LANGS: Record<Language, string> = {
    en: "English", ru: "Russian", uk: "Ukrainian", he: "Hebrew",
    es: "Spanish", de: "German", fr: "French", it: "Italian",
    pl: "Polish", pt: "Portuguese", other: "Other",
};
// строгое перечисление жанров
const GENRES: Record<Genre, string> = {
    fiction: "Fiction", classic: "Classic", fantasy: "Fantasy", sci_fi: "Sci-Fi",
    detective: "Detective", thriller: "Thriller", romance: "Romance", horror: "Horror",
    history: "History", biography: "Biography", non_fiction: "Non-fiction",
    poetry: "Poetry", graphic_novel: "Graphic novel", other: "Other",
};

type Props = {
    open: boolean;
    onClose: () => void;
    bookId: string | null;
    onUpdated?: (updated: Book) => void;
};

const EditBookModal: FunctionComponent<Props> = ({ open, onClose, bookId, onUpdated }) => {
    const { isLoading, register, handleSubmit, errors, isSubmitting, onSubmit } =
        useEditBook(open, bookId, onUpdated);

    if (!open) return null;
    // обработчик сабмита формы
    const handleFormSubmit = async (vals: BookForm): Promise<boolean> => {
        const ok = await onSubmit(vals);
        if (ok) onClose();
        return ok;
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-book-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 id="edit-book-title">Edit Book</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>

                {isLoading ? (
                    <div style={{ padding: 16 }}><Loading /></div>
                ) : (
                    <EditBookForm
                        LANGS={LANGS}
                        GENRES={GENRES}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        onSubmit={handleFormSubmit}
                        onCancel={onClose}
                    />
                )}
            </div>
        </>
    );
};

export default EditBookModal;