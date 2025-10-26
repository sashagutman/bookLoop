import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Routes, Navigate } from "react-router-dom";

import "./style/index.css";
import "./style/global.css";
import "./style/dark-mode.css";

import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyLibraryLayout from "./components/my-library/MyLibraryLayout";
import LibraryStatus from "./components/my-library/LibraryStatus";
import MyBooksPage from "./pages/MyBooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AdminPanel from "./components/admin-panel/AdminPanel";

// + Sonner
import SonnerToaster from "./helpers/SonnerToaster";

// защищённые маршруты
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";
import UserDetailsPage from "./pages/UserDetailsPage";

function App() {
  return (
    <>
      <SonnerToaster />

      <div className="layout">
        <Header />
        <div className="content">
          <Routes>
            {/* public */}
            <Route path="/" element={<MainLayout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/details-book/:bookId" element={<BookDetailsPage />} />

            {/* auth-only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-library" element={<MyLibraryLayout />}>
                <Route index element={<Navigate to="reading" replace />} />
                <Route path=":status" element={<LibraryStatus />} />
              </Route>

              <Route path="/my-books" element={<MyBooksPage />} />
                 <Route path="/user/me" element={<UserDetailsPage />} /> 
            </Route>

            {/* admin-only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/user/:id" element={<UserDetailsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="page-404">Page not found</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
