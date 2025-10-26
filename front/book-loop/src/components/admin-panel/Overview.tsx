import type { FunctionComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Book } from "../../interfaces/books/Book";
import type { User } from "../../interfaces/users/User";

import { getAllBooks } from "../../services/booksService";
import { getAllUsers } from "../../services/userService";

interface OverviewProps {}

const Overview: FunctionComponent<OverviewProps> = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      try {
        // книги
        const br = await getAllBooks();
        const bPayload = br?.data as any;
        const bData: Book[] = Array.isArray(bPayload)
          ? bPayload
          : Array.isArray(bPayload?.books)
          ? bPayload.books
          : [];

        // пользователи
        const ur = await getAllUsers();
        const uPayload = ur?.data as any;
        const uData: User[] = Array.isArray(uPayload)
          ? uPayload
          : Array.isArray(uPayload?.users)
          ? uPayload.users
          : [];

        if (!ignore) {
          setBooks(bData);
          setUsers(uData);
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401) {
          navigate("/login", { replace: true });
          return;
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const totalBooks = books.length;

  const genresCount = useMemo(() => {
    if (!books.length) return 0;
    const s = new Set<string>();
    for (const b of books) if (b?.genre) s.add(String(b.genre));
    return s.size;
  }, [books]);

  const averageRating = useMemo(() => {
    const vals = books
      .map((b) => Number(b?.rating))
      .filter((n) => Number.isFinite(n));
    if (!vals.length) return null;
    const sum = vals.reduce((a, b) => a + b, 0);
    return +(sum / vals.length).toFixed(2);
  }, [books]);

  const totalUsers = users.length;

  return (
    <div id="admin-dashboard" className="admin-section">
      <h2 className="section-title">Overview</h2>

      <div className="stats-lists">
        <div className="stat-list">
          <div className="stat-list-icon" aria-hidden>📖</div>
          <div className="stat-meta">
            <div className="stat-value">{isLoading ? "…" : totalBooks || "—"}</div>
            <div className="stat-label">Total Books</div>
          </div>
        </div>

        <div className="stat-list">
          <div className="stat-list-icon" aria-hidden>🏷️</div>
          <div className="stat-meta">
            <div className="stat-value">{isLoading ? "…" : genresCount || "—"}</div>
            <div className="stat-label">Genres</div>
          </div>
        </div>

        <div className="stat-list">
          <div className="stat-list-icon" aria-hidden>⭐</div>
          <div className="stat-meta">
            <div className="stat-value">
              {isLoading ? "…" : (averageRating ?? "—")}
            </div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>

        <div className="stat-list">
          <div className="stat-list-icon" aria-hidden>👤</div>
          <div className="stat-meta">
            <div className="stat-value">{isLoading ? "…" : totalUsers || "—"}</div>
            <div className="stat-label">Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
