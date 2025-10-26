import type { FunctionComponent } from "react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/burger.css";

interface BurgerMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const BurgerMenu: FunctionComponent<BurgerMenuProps> = ({
  isAuthenticated,
  isAdmin,
  onLogout,
}) => {
  const cbRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  const closeMenu = () => {
    if (cbRef.current) cbRef.current.checked = false;
  };

  // Автозакрытие при смене маршрута
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div className="burger-icon">
      {/* Кнопка-бургер */}
      <label className="burger" htmlFor="burger">
        <input className="line" type="checkbox" id="burger" ref={cbRef} />
      </label>

      {/* Оверлей для клика вне меню */}
      <label className="mobile-overlay" htmlFor="burger" />

      {/* Панель меню */}
      <nav className="mobile-menu" aria-label="Mobile">
        <ul className="mobile-menu_list">
          <li><Link to="/" onClick={closeMenu}>Library catalog</Link></li>

          {isAuthenticated && (
            <>
              <li><Link to="/my-library" onClick={closeMenu}>My library</Link></li>
              <li><Link to="/my-books" onClick={closeMenu}>My books</Link></li>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <li><Link to="/admin" onClick={closeMenu}>Admin panel</Link></li>
          )}

          <li className="mobile-menu_actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={closeMenu} className="_btn">Login</Link>
                <Link to="/register" onClick={closeMenu} className="_btn">Signup</Link>
              </>
            ) : (
              <>
                <button type="button" className="_btn" onClick={() => { onLogout(); closeMenu(); }}>
                  Logout
                </button>
              </>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default BurgerMenu;
