import type { FunctionComponent } from "react";
import "../../style/my-library/my-libraryIntro.css";
import { useAuth } from "../../context/AuthContext";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const MyLibraryIntroAnimated: FunctionComponent = () => {
  const { isAuthenticated } = useAuth();
  const { user: me, loading } = useCurrentUser(isAuthenticated);

  const name =
    loading
      ? "..."
      : [me?.name?.first, me?.name?.last].filter(Boolean).join(" ").trim() || "User";

  return (
    <section className="intro-section my-library-intro section-bg">
      <div className="container">
        <div className="intro-inner">
          <div className="intro-text">
            <h2 className="section-title">
              Welcome back, <span className="intro-username">{name}</span>
            </h2>
            <p className="section-description text-p">
              Here is your personal library. Track your books, keep favorites, and
              see your reading progress in one place.
            </p>
            <p className="intro-subtitle text-p">Ready to discover your next story?</p>
          </div>

          <div className="intro-avatar">
            {loading ? (
              <p>Loading...</p>
            ) : me?.image?.url ? (
              <img
                src={me.image.url}
                alt={me.image.alt || "User avatar"}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyLibraryIntroAnimated;
