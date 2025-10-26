import type { FC } from "react";
import "../style/header.css";
import logo from "../image/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import DarkModeToggle from "./DarkModeToggle";
import BurgerMenu from "./BurgerMenu";
import { useAuth } from "../context/AuthContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { modals } from "../helpers/modals";

const Header: FC = () => {

  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { user: me } = useCurrentUser(isAuthenticated);
  const navigate = useNavigate();

  async function handleLogoutClick() {
    const ok = await modals();
    if (ok) {
      logout();
      navigate("/login", { replace: true });
    }
  }

  const displayAlt =
    me?.image?.alt ||
    [me?.name?.first, me?.name?.last].filter(Boolean).join(" ").trim() ||
    (isAdmin ? "Admin" : "User");

  const profileHref = isAuthenticated ? "/user/me" : "/login";
  const roleIconSrc = isAdmin ? "/icons/admin.png" : "/icons/user.png";

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">

          <div className="header-logo body-logo">
            <Link className="header-logo_link" to="/">
              <img src={logo} alt="Book Loop" width={50} height={50} style={{ borderRadius: "30%" }} />
            </Link>
            <span className="header-title">Book Loop</span>
          </div>

          <nav className="header-nav" aria-label="primary navigation">
            <ul className="header-nav-list">
              <li className="header-nav-item">
                <Link to="/" className="header-nav-link">Library Catalog</Link>
              </li>

              {isAuthenticated && (
                <>
                  <li className="header-nav-item">
                    <Link to="/my-library" className="header-nav-link">My library</Link>
                  </li>
                  <li className="header-nav-item">
                    <Link to="/my-books" className="header-nav-link">My books</Link>
                  </li>
                </>
              )}

              {isAuthenticated && isAdmin && (
                <li className="header-nav-item">
                  <Link to="/admin" className="header-nav-link">
                    Admin Panel <RiAdminLine style={{ verticalAlign: "middle" }} />
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-actions">
            <DarkModeToggle />

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="header-actions_btn _btn">Login</Link>
                <Link to="/register" className="header-actions_btn _btn">Signup</Link>
              </>
            ) : (
              <>
                <Link
                  to={profileHref}
                  className="avatar-badge role-icon-link"
                  title={displayAlt}
                  aria-label={`${displayAlt} profile`}
                >
                  <img src={roleIconSrc} alt={displayAlt} />
                </Link>

                <button type="button" className="header-actions_btn _btn" onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            )}

            <BurgerMenu
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              onLogout={handleLogoutClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
