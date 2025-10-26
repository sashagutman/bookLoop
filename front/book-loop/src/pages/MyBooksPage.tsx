import { useEffect, useState, type FunctionComponent, useCallback } from "react";
import "../style/my-books/books-page.css";
import { Link } from "react-router-dom";
import { FiBook } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewBookModal from "../components/AddNewBookModal";
import Loading from "../components/Loading";
import type { Book } from "../interfaces/books/Book";
import { getBooksByUserId, deleteBook } from "../services/booksService";
import { notify } from "../helpers/notify";
import { confirmDeleteBook, confirmDeleteAllBooks, showBookNotesModal } from "../helpers/modals";
import { MdKeyboardArrowRight } from "react-icons/md";
import EditBookModal from "../components/my-books/EditBookModal";

interface MyBooksPageProps { }

const MyBooksPage: FunctionComponent<MyBooksPageProps> = () => {
    const [openModal, setOpenModal] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);

    const loadMyBooks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { data } = await getBooksByUserId();
            setBooks(Array.isArray(data) ? data : data?.books ?? []);
        } catch (err: any) {
            console.error("Failed to fetch my books:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to load books");
            notify?.error?.("Couldn't load your books");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMyBooks();
    }, [loadMyBooks]);

    const handleRemove = async (book: Book) => {
        const ok = await confirmDeleteBook(book.title);
        if (!ok) return;

        const prev = books;
        setBooks((cur) => cur.filter((b) => b._id !== book._id));
        try {
            await deleteBook(book._id);
            notify?.success?.("Book removed");
        } catch (err: any) {
            console.error("delete book failed:", err);
            setBooks(prev);
            notify?.error?.(err?.response?.data?.message || "Failed to remove");
        }
    };

    const handleClearAll = async () => {
        if (!books.length || isClearing) return;
        const ok = await confirmDeleteAllBooks(books.length);
        if (!ok) return;

        setIsClearing(true);
        const prev = books.slice();
        setBooks([]);
        try {
            for (const b of prev) {
                try {
                    await deleteBook(b._id);
                } catch (e) {
                    console.warn("Failed to delete a book:", b._id, e);
                }
            }
            notify?.success?.("All your books were removed");
        } catch (err: any) {
            console.error("clear all failed:", err);
            setBooks(prev);
            notify?.error?.("Failed to clear all");
        } finally {
            setIsClearing(false);
        }
    };

return (
    <>
        <section className="my-books section-bg">
                <div className="container">
                    <h2 className="title-h">My Books</h2>
                    <p className="text-p">Manage your personal book collection</p>

                    <button onClick={() => setOpenModal(true)} className="btn-flip" type="button">
                        <span className="front">Add New Book</span>
                        <span className="back">
                            <FiBook />
                        </span>
                    </button>

                    {isLoading && <Loading />}

                    {!isLoading && !error && (
                        <>
                            {books.length > 0 ? (
                                <>
                                    <ul className="my-books-grid">
                                        {books.map((book) => {
                                            const imgSrc =
                                                typeof book.image === "string"
                                                    ? book.image
                                                    : (book as any)?.image?.url;

                                            const notesPreview =
                                                book.notes && book.notes.length > 180
                                                    ? `${book.notes.slice(0, 180)}…`
                                                    : book.notes || "";

                                            return (
                                                <li className="my-books-card" key={book._id}>
                                                    <Link to={`/details-book/${book._id}`} className="my-books-click">
                                                        <div className="my-books-img">
                                                            {imgSrc && (
                                                                <img src={imgSrc} alt={`${book.title}${book.author ? ` — ${book.author}` : ""} cover`}
                                                                    loading="lazy"
                                                                    decoding="async" />)}
                                                        </div>

                                                        <h3 className="my-books-title">{book.title}</h3>
                                                        {book.author && <p className="my-books-author">{book.author}</p>}
                                                        {book.readYear && <p className="my-books-readyear">Read Year: {book.readYear}</p>}
                                                    </Link>

                                                    <div className="my-books_info">
                                                        {book.notes && (
                                                            <p className="my-books-notes_text text-p">{notesPreview}</p>
                                                        )}
                                                    </div>

                                                    {book.notes && book.notes.length > 180 && (
                                                        <button
                                                            type="button"
                                                            className="notes-more"
                                                            onClick={() => showBookNotesModal(book.title, book.notes!)}>
                                                            More notes
                                                            <MdKeyboardArrowRight className="notes-more-icon" />
                                                        </button>
                                                    )}

                                                    <div className="my-books-actions">
                                                        <button className="my-books_btn my-books-edit"
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditId(book._id); }}>
                                                            Edit
                                                        </button>

                                                        <button className="my-books_btn my-books-remove" type="button"
                                                            onClick={() => handleRemove(book)}
                                                            title="Remove book">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <button className="btn-flip" type="button" onClick={handleClearAll} disabled={isClearing}
                                        aria-disabled={isClearing}
                                        title="Delete all my books">
                                        <span className="front">{isClearing ? "Clearing..." : "Clear all"}</span>
                                        <span className="back">
                                            <RiDeleteBin6Line />
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <div className="my-books-empty">
                                    <div className="my-books-empty-icon">📚</div>
                                    <p className="my-books-empty-text text-p">You haven’t added any books yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
            <AddNewBookModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    loadMyBooks();
                }}
            />
            <EditBookModal
                open={!!editId}
                bookId={editId}
                onClose={() => setEditId(null)}
                onUpdated={(updated) => {
                    setBooks(list => list.map(b => (b._id === updated._id ? { ...b, ...updated } : b)));
                }}
            />
        </>
    );
};

export default MyBooksPage;
