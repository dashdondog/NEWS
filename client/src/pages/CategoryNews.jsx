import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNews, getCategories } from "../services/api";
import NewsCard from "../components/NewsCard";

const CategoryNews = () => {
  const { categoryId } = useParams();
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    fetchNews();
  }, [categoryId, page]);

  const fetchCategory = async () => {
    try {
      const { data } = await getCategories();
      const cat = data.find((c) => c._id === categoryId);
      setCategoryName(cat?.name || "");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await getNews({ page, limit: 12, category: categoryId });
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {categoryName || "Ангилал"}
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Энэ ангилалд мэдээ олдсонгүй.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Өмнөх
              </button>
              <span className="px-4 py-2 text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Дараах
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryNews;
