import React from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const NewsCard = ({ news, large = false }) => {
  const imageUrl = news.image
    ? `${API_URL}${news.image}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  const date = new Date(news.createdAt).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (large) {
    return (
      <Link to={`/news/${news._id}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img
            src={imageUrl}
            alt={news.title}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            {news.category && (
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {news.category.name}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mt-3 leading-tight">
              {news.title}
            </h2>
            <div className="flex items-center mt-3 text-sm text-gray-200 space-x-4">
              <span>{news.author}</span>
              <span>{date}</span>
              <span>{news.views} views</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={news.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          {news.category && (
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-wide">
              {news.category.name}
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {news.content?.replace(/<[^>]+>/g, "").substring(0, 120)}...
          </p>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>{news.author}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
