import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById } from "../services/api";

const API_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <span>Үзэлт: {news.views}</span>
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
