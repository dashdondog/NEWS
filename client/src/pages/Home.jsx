import React, { useState, useEffect } from "react";
import { getNews, getTrending } from "../services/api";
import NewsCard from "../components/NewsCard";

const Home = () => {
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNews();
    fetchTrending();
  }, [page]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await getNews({ page, limit: 12, search: search || undefined });
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchTrending = async () => {
    try {
      const { data } = await getTrending();
      setTrending(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Мэдээ хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Хайх
          </button>
        </div>
      </form>

      {/* Featured News */}
      {news.length > 0 && (
        <section className="mb-12">
          <NewsCard news={news[0]} large />
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Trending мэдээ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trending.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>
        </section>
      )}

      {/* All News */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Шинэ мэдээ</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(1).map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>

            {/* Pagination */}
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
      </section>
    </div>
  );
};

export default Home;
