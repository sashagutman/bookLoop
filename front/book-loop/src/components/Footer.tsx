import type { FunctionComponent } from "react";
import "../style/footer.css";
import logo from "../image/logo.png";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo body-logo">
              <Link to="/" className="footer-logo_link body-logo_link">
                <img
                  src={logo}
                  alt="Book Loop"
                  width={50}
                  height={50}
                  style={{ borderRadius: "30%" }}
                />
              </Link>
              <span className="footer-title">Book Loop</span>
            </div>

            <div className="footer-links">
                <Link to="/#catalog" className="footer-link">Catalog</Link>

              {isAuthenticated && (
                <>
                  <Link to="/my-library" className="footer-link">My Library</Link>
                  <Link to="/my-books" className="footer-link">My Books</Link>
                </>
              )}

              {isAuthenticated && isAdmin && (
                <Link to="/admin" className="footer-link">Admin Panel</Link>
              )}
            </div>

            <div className="footer-social">
              <p className="footer-social_title">Follow us:</p>
              <div className="footer-social_body">
                <a href="https://twitter.com" className="footer-social_link">
                  <FaInstagram id="instagram" className="icons-social-media" />
                </a>
                <a href="https://facebook.com" className="footer-social_link">
                  <FaFacebook id="facebook" className="icons-social-media" />
                </a>
                <a href="https://youtube.com" className="footer-social_link">
                  <FiYoutube id="youtube" className="icons-social-media" />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-info">
              <p>© {year} Book Loop. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
