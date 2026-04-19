import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById, getComments, addComment } from "../services/api";

const API_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await getNewsById(id);
        setNews(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await getComments(id);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setCommentError("");
    if (!form.name.trim() || !form.content.trim()) {
      setCommentError("Нэр болон сэтгэгдэл бөглөнө үү");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await addComment(id, form);
      setComments([data, ...comments]);
      setForm({ name: "", content: "" });
    } catch (err) {
      setCommentError(err.response?.data?.message || "Алдаа гарлаа");
    }
    setSubmitting(false);
  };

  const formatCommentDate = (d) =>
    new Date(d).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Мэдээ олдсонгүй</h2>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          Нүүр хуудас руу буцах
        </Link>
      </div>
    );
  }

  const date = new Date(news.createdAt).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const imageUrl = news.image
    ? (news.image.startsWith("http") ? news.image : `${API_URL}${news.image}`)
    : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-blue-600">Нүүр</Link>
        {news.category && (
          <>
            {" / "}
            <Link to={`/category/${news.category._id}`} className="hover:text-blue-600">
              {news.category.name}
            </Link>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {news.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-6">
        <span className="font-medium text-gray-700">{news.author}</span>
        <span>Огноо: {date}</span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {news.views}
        </span>
        {news.category && (
          <span>
            Төрөл:{" "}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {news.category.name}
            </span>
          </span>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={news.title}
          className="w-full rounded-xl mb-8 shadow-lg"
        />
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* Comments */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Сэтгэгдэл ({comments.length})
        </h2>

        <form onSubmit={handleSubmitComment} className="bg-gray-50 p-5 rounded-xl mb-8 space-y-3">
          {commentError && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
              {commentError}
            </div>
          )}
          <input
            type="text"
            placeholder="Таны нэр"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Сэтгэгдлээ бичнэ үү..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            maxLength={1000}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {submitting ? "Илгээж байна..." : "Илгээх"}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Эхний сэтгэгдлийг үлдээгээрэй
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-400">{formatCommentDate(c.createdAt)}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Back */}
      <div className="mt-12 pt-6 border-t">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          &larr; Нүүр хуудас руу буцах
        </Link>
      </div>
    </article>
  );
};

export default NewsDetail;
