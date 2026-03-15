import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNews,
  deleteNews,
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/api";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [activeTab, setActiveTab] = useState("news");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, catRes] = await Promise.all([
        getNews({ limit: 100 }),
        getCategories(),
      ]);
      setNews(newsRes.data.news);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Энэ мэдээг устгах уу?")) return;
    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createCategory(newCategory);
      setCategories((prev) => [...prev, data]);
      setNewCategory({ name: "", description: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Энэ ангилалыг устгах уу?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
        <button
          onClick={() => navigate("/admin/create")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Шинэ мэдээ
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("news")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "news"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Мэдээ ({news.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "categories"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ангилал ({categories.length})
        </button>
      </div>

      {/* News Tab */}
      {activeTab === "news" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Гарчиг</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ангилал</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Зохиогч</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Огноо</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.category?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => navigate(`/admin/edit/${item._id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {news.length === 0 && (
            <p className="text-center py-8 text-gray-500">Мэдээ байхгүй байна.</p>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div>
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Шинэ ангилал нэмэх</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ангилалын нэр"
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Тайлбар (заавал биш)"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Нэмэх
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Нэр</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Тайлбар</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{cat.description}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
