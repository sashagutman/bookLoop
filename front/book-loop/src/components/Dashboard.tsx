import type { FunctionComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import "../style/dashboard.css";
import { IoBookOutline } from "react-icons/io5";
import { GoGlobe } from "react-icons/go";
import { FaRegStar, FaLanguage } from "react-icons/fa";

import type { Book } from "../interfaces/books/Book";
import { getAllBooks } from "../services/booksService";
import Loading from "./Loading";

const minDelay = <T,>(p: Promise<T>, ms = 600) =>
  Promise.all([p, new Promise((r) => setTimeout(r, ms))]).then(([res]) => res as T);

const Dashboard: FunctionComponent = () => {
  // список всех книг
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  // загружаем книги один раз
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await minDelay(getAllBooks(), 600);
        if (!mounted) return;
        setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Dashboard: failed to load books", e);
        if (mounted) setBooks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const { total, languagesCount, genresCount, avgRating } = useMemo(() => {
    const total = books.length;
    // собираем уникальные языки, игнорируя неизвестные
    const languages = new Set(
      books
        .map((b: any) => (b.language ?? b.lang ?? "").toString().toLowerCase().trim())
        .filter(Boolean)
    );
    const languagesCount = languages.size;
    const genresCount = new Set(books.map(b => b.genre)).size;
    const nums = books.map(b => Number(b.rating)).filter(n => Number.isFinite(n));
    const avgRating = nums.length ? (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1) : "—";

    return { total, languagesCount, genresCount, avgRating };
  }, [books]);

  return (
    <section className="section-dashboard section-bg">
      <div className="container">
        <div>
          <h1 className="dashboard-title">
            Welcome to the <span className="gradient-text">Book Loop</span>
          </h1>
        </div>

        <p className="dashboard-description">
          Your next literary journey awaits at Book Loop. Our collection is filled with hidden gems and timeless classics, creating an endless loop of discovery for every book lover. Start exploring now and find the perfect story to get lost in.
        </p>

        <div className="dashboard-stats">
          {loading ? (
            <div className="dashboard-loading"><Loading /></div>
          ) : (
            <ul className="dashboard-stats-list">
              <li className="dashboard-stat_item">
                <div className="stat_item-icon book-icon"><IoBookOutline /></div>
                <p className="stat_item-label">{total}</p>
                <p className="stat_item-description">Total Books</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon trend-icon"><FaLanguage /></div>
                <p className="stat_item-label">{languagesCount}</p>
                <p className="stat_item-description">Languages</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon globe-icon"><GoGlobe /></div>
                <p className="stat_item-label">{genresCount}</p>
                <p className="stat_item-description">Genres</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon star-icon"><FaRegStar /></div>
                <p className="stat_item-label">{avgRating}</p>
                <p className="stat_item-description">Average Rating</p>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
