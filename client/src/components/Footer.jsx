import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ categories }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white">
              MN<span className="text-blue-500">News</span>
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              Монголын мэдээллийн портал. Шинэ мэдээ, технологи, спорт, боловсрол болон бусад мэдээллийг цаг тухайд нь хүргэнэ.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Ангилал</h4>
            <div className="space-y-2">
              {categories?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat._id}`}
                  className="block text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Холбоо барих</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: info@mnnews.mn</p>
              <p>Утас: +976 9999-9999</p>
              <p>Улаанбаатар, Монгол</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MNNews. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
