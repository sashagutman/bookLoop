import type { FunctionComponent } from "react";
import { PiBooksLight } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { GoVerified } from "react-icons/go";
import { LuFolderHeart } from "react-icons/lu";
import { useUserStats } from "../../hooks/useUserStat";
import StatCard from "./StatCard";
import "../../style/my-library/reading-stats.css";

const ReadingStats: FunctionComponent = () => {
  const { total, favorites, toRead, reading, finished, loading, error } = useUserStats();

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-header">
          <h2 className="stats-title title-h">Reading Statistics</h2>
          <p className="stats-subtitle text-p">
            Your Achievements {loading ? "" : `• ${total} in Library`}
          </p>
        </div>

        <div className="stats-cards">
          <StatCard iconClassName="icon-favorites" icon={<LuFolderHeart />} value={loading ? "…" : favorites} label="Favorites" sub="Liked Books" />
          <StatCard iconClassName="icon-time" icon={<IoTimerOutline />} value={loading ? "…" : toRead} label="To-Read" sub="In Plans" />
          <StatCard iconClassName="icon-books" icon={<PiBooksLight />} value={loading ? "…" : reading} label="Reading" sub="In Progress" />
          <StatCard iconClassName="icon-finished" icon={<GoVerified />} value={loading ? "…" : finished} label="Finished" sub="Completed" />
        </div>

        {!!error && <p className="text-p" style={{ opacity: 0.7, marginTop: 12 }}>Couldn’t load stats.</p>}
      </div>
    </section>
  );
};

export default ReadingStats;
