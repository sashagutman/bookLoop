import type { FunctionComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import "../../style/catalog.css";

import { FaUserPen } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { GrBook } from "react-icons/gr";

import { VALID_STATUSES, type RouteStatus } from "../../helpers/statuses";
import StatusActionsButton, { type ActionKey } from "../my-library/StatusActionsButton";

import {
  getMyBooksByRouteStatus,
  toggleFavorite,
  toggleWant,
  setBookStatus,
  clearBookStatus,
} from "../../services/libraryService";

type MyBook = {
  _id: string;
  title?: string;
  author?: string;
  image?: string;
  genre?: string;
  rating?: number | string;
  pages?: number;
  publishedYear?: number;
};

const LibraryStatus: FunctionComponent = () => {
  const { status: raw } = useParams<{ status?: string }>();
  const status = (VALID_STATUSES as readonly string[]).includes(raw || "")
    ? (raw as RouteStatus)
    : null;

  if (!status) return <Navigate to="/my-library/reading" replace />;

  const [items, setItems] = useState<MyBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const disabledKeys = useMemo<Partial<Record<ActionKey, boolean>>>(() => ({
    "to-read": status === "to-read",
    reading: status === "reading",
    finished: status === "finished",
  }), [status]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getMyBooksByRouteStatus(status);
      setItems(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [status]);

  const removeFromView = (id: string) => setItems(prev => prev.filter(x => x._id !== id));

  const handleAction = async (bookId: string, action: ActionKey) => {
    const snapshot = items;
    try {
      switch (action) {
        case "delete": {
          removeFromView(bookId);
          if (status === "favorites") await toggleFavorite(bookId);
          else if (status === "to-read") await toggleWant(bookId);
          else await clearBookStatus(bookId);
          break;
        }
        case "to-read": { removeFromView(bookId); await setBookStatus(bookId, "unread"); await toggleWant(bookId); break; }
        case "reading": { removeFromView(bookId); await setBookStatus(bookId, "reading"); break; }
        case "finished": { removeFromView(bookId); await setBookStatus(bookId, "finished"); break; }
      }
    } catch (e) {
      // откат и свежая загрузка
      setItems(snapshot);
      await load();
      console.error("[handleAction]", e);
    }
  };

  if (loading) return <div className="catalog-list-loader" />;

  if (!items.length) {
    return (
      <div className="empty-library">
        <div className="empty-library-icon"><GrBook /></div>
        <p className="empty-library-text">No books in this section yet.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="tabs-cards">
        {items.map((b) => {
          const rating = b.rating != null ? Number(b.rating) : null;

          return (
            <li key={b._id} className="tabs-card">
              <Link to={`/details-book/${b._id}`} className="tabs-card_img">
                <img src={b.image || ""} alt={b.title || "Book Cover"} loading="lazy" decoding="async" />
              </Link>

              <div className="tabs-card_body">
                <div className="tabs-card_info">
                  <h3 className="tabs-card_title">{b.title}</h3>

                  {b.author && (
                    <p className="tabs-card_author">
                      <FaUserPen className="author-icon" />
                      {b.author}
                    </p>
                  )}

                  {rating !== null && !Number.isNaN(rating) && (
                    <span className="tabs-card_rating"><IoMdStar /> {rating.toFixed(1)}</span>
                  )}

                  {b.genre && <span className="tabs-card_genre-badge">{b.genre}</span>}
                </div>

                <div className="tabs-card_meta">
                  <StatusActionsButton
                    bookId={b._id}
                    onAction={handleAction}
                    disabledKeys={disabledKeys}
                    ariaLabel="More actions"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LibraryStatus;
