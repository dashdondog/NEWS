import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser, categories }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MN<span className="text-gray-800">News</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Нүүр
            </Link>
            {categories?.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {cat.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Админ
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Гарах
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Нэвтрэх
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
              Нүүр
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`}
                className="block py-2 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" className="block py-2 text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                    Админ
                  </Link>
                )}
                <button onClick={handleLogout} className="block py-2 text-red-600">
                  Гарах
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                Нэвтрэх
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
