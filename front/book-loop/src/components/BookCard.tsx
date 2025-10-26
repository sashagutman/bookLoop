import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../interfaces/books/Book";
import { FaUserPen } from "react-icons/fa6";
import { FiBookOpen } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { LiaStarSolid } from "react-icons/lia";
import { IoHeartOutline, IoHeart, IoBookOutline, IoBook } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi";
import ShareButton from "./ShareButton";

type Props = {
  book: Book;
  userId: string | null;
  onToggleFavorite: (id: string) => void;
  onToggleWant: (id: string) => void;
};

const BookCard: FunctionComponent<Props> = ({ book, userId, onToggleFavorite, onToggleWant }) => {
  const isLiked =
    book._personal?.liked ??
    (Array.isArray(book.likes) && !!userId && book.likes.some(id => String(id) === String(userId)));

  const isWanted =
    book._personal?.want ??
    (Array.isArray(book.wants) && !!userId && book.wants.some(id => String(id) === String(userId)));

  const rating =
    typeof book.rating === "number"
      ? book.rating
      : book.rating != null
      ? Number(book.rating)
      : null;

  return (
    <li className="catalog-item">
      <div className="catalog-item_img">
        <img
          src={book.image}
          alt={book.title || "Book Cover"}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />

        {rating !== null && !Number.isNaN(rating) && (
          <span className="catalog-item_rating">
            <LiaStarSolid /> {rating.toFixed(1)}
          </span>
        )}

        {book.genre && <span className="catalog-item_genre-badge">{book.genre}</span>}

        <ShareButton
          actions={[
            {
              id: "fav",
              label: isLiked ? "In favorites" : "Add to favorites",
              icon: isLiked ? <IoHeart className="is-active" /> : <IoHeartOutline />,
              onClick: () => onToggleFavorite(book._id),
            },
            {
              id: "details",
              label: "Details",
              icon: <HiOutlineInformationCircle />,
              to: `/details-book/${book._id}`,
            },
            {
              id: "want-to-read",
              label: isWanted ? "In Want to Read" : "Want to read",
              icon: isWanted ? <IoBook className="is-active" /> : <IoBookOutline />,
              onClick: () => onToggleWant(book._id),
            },
          ]}
        />
      </div>

      <div className="catalog-item_body">
        <Link to={`/details-book/${book._id}`} className="catalog-item_title">
          {book.title}
        </Link>

        {book.author && (
          <p className="catalog-item_author">
            <FaUserPen className="author-icon" />
            {book.author}
          </p>
        )}

        <div className="catalog-item_meta">
          {book.publishedYear && (
            <p className="catalog-item_published">
              <LuCalendarDays className="published-icon" />
              {book.publishedYear}
            </p>
          )}
          {book.pages && (
            <p className="catalog-item_pages">
              <FiBookOpen className="pages-icon" /> {book.pages} pages
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

export default BookCard;
