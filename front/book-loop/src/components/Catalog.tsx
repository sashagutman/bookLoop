import type { FunctionComponent } from "react";
import { useEffect, useMemo, useRef } from "react";
import { GrBook } from "react-icons/gr";
import "../style/catalog.css";

import { useAuth } from "../context/AuthContext";
import type { Book } from "../interfaces/books/Book";
import Loading from "./Loading";
import PaginationBar from "./PaginationBar";

import { useBooksList } from "../hooks/useBooksList";
import { useCatalogParams } from "../hooks/useCatalogParams";
import { useBookActions } from "../hooks/useBookActions";

import BookCard from "./BookCard";
import { booksLoadErrorModal } from "../helpers/modals";

const PAGE_SIZE = 8;

const Catalog: FunctionComponent = () => {
  const { user: decoded, isAuthenticated } = useAuth();
  const userId = decoded?._id ?? null;

  const { params, handlePageChange } = useCatalogParams(PAGE_SIZE);
  const { page, limit, debouncedQ, genre, lang } = params;

  const { books, setBooks, loading, total, error, refetch, hasLoaded } = useBooksList({
    q: debouncedQ || undefined,
    genre: genre || undefined,
    language: lang || undefined,
    page,
    limit,
  });

  const { onToggleFavorite, onToggleWant } = useBookActions({
    isAuthenticated,
    userId,
    setBooks,
  });

  const totalCount = useMemo(() => {
    if (Number.isFinite(total) && total > 0) return total;
    return books.length;
  }, [total, books.length]);

  const isEmpty = useMemo(() => {
    return hasLoaded && !loading && !error && books.length === 0;
  }, [hasLoaded, loading, error, books.length]);

  // SweetAlert — один раз на ошибку
  const shownErrorRef = useRef(false);

  useEffect(() => {
    if (!error) {
      shownErrorRef.current = false;
      return;
    }
    if (shownErrorRef.current) return;

    shownErrorRef.current = true;

    (async () => {
      const action = await booksLoadErrorModal(error);
      if (action === "retry") refetch();
      if (action === "reload") window.location.reload();
    })();
  }, [error, refetch]);

  return (
    <section id="catalog" className="catalog-section">
      <div className="container">
        <div className="catalog-header">
          <h2 className="catalog-title title-h">Catalog Books</h2>

          <div className="catalog-count">
            <span className="count-number">{loading ? "..." : `(${totalCount})`}</span>
            <span className="count-label">Books</span>
          </div>
        </div>

        {loading ? (
          <div className="catalog-list-loader">
            <Loading />
          </div>
        ) : error ? (
          // можно оставить пустым, потому что модал уже показалась,
          // но на всякий случай оставим inline блок
          <div className="catalog-empty" role="alert">
            <div className="catalog-empty_icon">
              <GrBook />
            </div>
            <p className="catalog-empty_title">Problem loading books</p>
            <p style={{ opacity: 0.75, marginTop: 8, maxWidth: 720 }}>{error}</p>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button className="btn" onClick={() => refetch()}>
                Retry
              </button>
              <button className="btn btn--ghost" onClick={() => window.location.reload()}>
                Reload page
              </button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="catalog-empty">
            <div className="catalog-empty_icon">
              <GrBook />
            </div>
            <p className="catalog-empty_title">No books found</p>
          </div>
        ) : (
          <>
            <ul className="catalog-list">
              {books.map((b: Book) => (
                <BookCard
                  key={b._id}
                  book={b}
                  userId={userId}
                  onToggleFavorite={onToggleFavorite}
                  onToggleWant={onToggleWant}
                />
              ))}
            </ul>

            {totalCount > limit ? (
              <PaginationBar
                page={page}
                limit={limit}
                total={totalCount}
                onChange={handlePageChange}
                className="catalog-pagination"
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default Catalog;
