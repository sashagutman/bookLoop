import type { FunctionComponent } from "react";
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

const PAGE_SIZE = 8;

const Catalog: FunctionComponent = () => {
  const { user: decoded, isAuthenticated } = useAuth();
  const userId = decoded?._id ?? null;

  const { params, handlePageChange } = useCatalogParams(PAGE_SIZE);
  const { page, limit, debouncedQ, genre, lang } = params;

  const { books, setBooks, loading, total } = useBooksList({
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

  const totalCount = Number.isFinite(total) ? total : 0;
  const isEmpty = !loading && totalCount === 0;

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
          <div className="catalog-list-loader"><Loading /></div>
        ) : isEmpty ? (
          <div className="catalog-empty">
            <div className="catalog-empty_icon"><GrBook /></div>
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

            {totalCount > limit && (
              <PaginationBar
                page={page}
                limit={limit}
                total={totalCount}
                onChange={handlePageChange }
                className="catalog-pagination"
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Catalog;
