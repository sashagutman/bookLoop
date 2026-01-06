import type { FunctionComponent } from "react";
import "../style/dashboard.css";

import Loading from "./Loading";
import { useDashboardStats } from "../hooks/useDashboardStats";

import { IoBookOutline } from "react-icons/io5";
import { GoGlobe } from "react-icons/go";
import { FaRegStar, FaLanguage } from "react-icons/fa";

const Dashboard: FunctionComponent = () => {
  const { stats, loading, hasLoaded, error, refetch } = useDashboardStats();
  const { total, languagesCount, genresCount, avgRating } = stats;

  return (
    <section className="section-dashboard section-bg">
      <div className="container">
        <div>
          <h1 className="dashboard-title">
            Welcome to the <span className="gradient-text">Book Loop</span>
          </h1>
        </div>

        <p className="dashboard-description">
          Your next literary journey awaits at Book Loop. Our collection is filled
          with hidden gems and timeless classics, creating an endless loop of
          discovery for every book lover. Start exploring now and find the perfect
          story to get lost in.
        </p>

        <div className="dashboard-stats">
          {loading ? (
            <div className="dashboard-loading">
              <Loading />
            </div>
          ) : error ? (
            <div style={{ marginTop: 16 }}>
              <p style={{ opacity: 0.85 }}>Problem loading dashboard stats</p>
              <p style={{ opacity: 0.75, marginTop: 8, maxWidth: 720 }}>{error}</p>

              <button className="btn" style={{ marginTop: 12 }} onClick={refetch}>
                Retry
              </button>
            </div>
          ) : hasLoaded ? (
            <ul className="dashboard-stats-list">
              <li className="dashboard-stat_item">
                <div className="stat_item-icon book-icon">
                  <IoBookOutline />
                </div>
                <p className="stat_item-label">{total}</p>
                <p className="stat_item-description">Total Books</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon trend-icon">
                  <FaLanguage />
                </div>
                <p className="stat_item-label">{languagesCount}</p>
                <p className="stat_item-description">Languages</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon globe-icon">
                  <GoGlobe />
                </div>
                <p className="stat_item-label">{genresCount}</p>
                <p className="stat_item-description">Genres</p>
              </li>

              <li className="dashboard-stat_item">
                <div className="stat_item-icon star-icon">
                  <FaRegStar />
                </div>
                <p className="stat_item-label">{avgRating}</p>
                <p className="stat_item-description">Average Rating</p>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
