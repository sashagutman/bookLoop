import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/my-books/book-details.css";

import type { Book } from "../interfaces/books/Book";
import { getBookById, likeDislikeBook, toggleWant } from "../services/booksService";
import Loading from "../components/Loading";
import { LuLibrary } from "react-icons/lu";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { LANGUAGE_LABELS } from "../helpers/languageLabels";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext"; 

const BookDetailsPage: FunctionComponent = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { user: decoded, isAuthenticated } = useAuth();           
  const userId = decoded?._id ?? null;                            

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // локальные лоадеры на кнопках
  const [favLoading, setFavLoading] = useState(false);
  const [wantLoading, setWantLoading] = useState(false);

  // флаги состояния для текста кнопок
  const [isFav, setIsFav] = useState(false);     
  const [isWant, setIsWant] = useState(false);   

  useEffect(() => {
    if (!bookId) return;
    setIsLoading(true);
    setError(null);

    getBookById(bookId)
      .then((res) => setBook(res.data as Book))
      .catch(() => setError("Error loading book"))
      .finally(() => setIsLoading(false));
  }, [bookId]);

  // инициализируем флаги после загрузки книги
  useEffect(() => {
    if (!book) return;
    const liked =
      book._personal?.liked ??
      (Array.isArray(book.likes) && !!userId && book.likes.some(id => String(id) === String(userId)));

    const wanted =
      book._personal?.want ??
      (Array.isArray(book.wants) && !!userId && book.wants.some(id => String(id) === String(userId)));

    setIsFav(!!liked);
    setIsWant(!!wanted);
  }, [book, userId]);

  const showLoader = isLoading || !!error || !book;

  // actions с оптимистичным апдейтом 
  const goFavorite = async () => {
    if (!book?._id || favLoading) return;
    if (!isAuthenticated) return toast.error("Please login to use favorites");

    const prev = isFav;
    setIsFav(!prev); // оптимистично
    try {
      setFavLoading(true);
      await likeDislikeBook(book._id); // PATCH /api/books/:id/like (toggle)
      toast.success(!prev ? "Added to favorites" : "Removed from favorites");
    } catch (e: any) {
      setIsFav(prev); // откат
      console.error("[likeDislikeBook] FAIL", e?.response?.status, e?.response?.data);
      toast.error(e?.response?.data?.message ?? "Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  const goWantToRead = async () => {
    if (!book?._id || wantLoading) return;
    if (!isAuthenticated) return toast.error("Please login to use 'Want to read'");

    const prev = isWant;
    setIsWant(!prev); // оптимистично
    try {
      setWantLoading(true);
      await toggleWant(book._id); // PATCH /api/books/:id/want (toggle)
      toast.success(!prev ? "Added to 'Want to read'" : "Removed from 'Want to read'");
    } catch (e: any) {
      setIsWant(prev); // откат
      console.error("[toggleWant] FAIL", e?.response?.status, e?.response?.data);
      toast.error(e?.response?.data?.message ?? "Failed to update 'Want to read'");
    } finally {
      setWantLoading(false);
    }
  };

  return (
    <section className="details-section">
      <div className="container">
        {showLoader ? (
          <Loading />
        ) : (
          <>
            <h1 className="details-title title-h">{book.title}</h1>

            <div className="details-inner">
              <div className="details-cover">
                <img src={book.image} alt={book.title || "Book Cover"} loading="lazy"/>
              </div>

              <div className="details-info">
                <p className="details-author">{book.author}</p>

                <div className="details-meta">
                  <span className="details-rating">⭐ {Number(book.rating ?? 0).toFixed(1)}</span>
                  <span className="details-genre">{book.genre}</span>
                  {book.pages ? <span className="details-pages">{book.pages} pages</span> : null}
                  {book.publishedYear ? <span className="details-year">{book.publishedYear}</span> : null}
                </div>

                {book.description ? (
                  <p className="details-description text-p">{book.description}</p>
                ) : null}
                {book.language ? (
                  <p className="details-language text-p">
                    <strong>Language:</strong> {LANGUAGE_LABELS[book.language] ?? book.language}
                  </p>
                ) : null}
              </div>
            </div>

            {/* две кнопки действий */}
            <div className="details-actions">
              <button
                className="btn-flip"
                onClick={goWantToRead}
                disabled={wantLoading}
                aria-busy={wantLoading}
                title={isWant ? "Remove from 'Want to read'" : "Add to 'Want to read'"}
              >
                <span className="front">{isWant ? "Remove" : "Want to read"}</span>
                <span className="back"><LuLibrary /></span>
              </button>

              <button
                className="btn-flip"
                onClick={goFavorite}
                disabled={favLoading}
                aria-busy={favLoading}
                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
              >
                <span className="front">{isFav ? "Unfav" : "To Fav"}</span>
                <span className="back"><MdOutlineFavoriteBorder /></span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BookDetailsPage;
