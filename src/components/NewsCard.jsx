import React from "react";
import { Link } from "react-router-dom";

function NewsCard({ newsItem }) {
  return (
    <div className="news-card">
      <img src={newsItem.image} alt={newsItem.title} />
      <h3>{newsItem.title}</h3>
      <p>{newsItem.description.substring(0, 100)}...</p>
      <Link to={`/news/${newsItem.id}`}>Read More</Link>
    </div>
  );
}

export default NewsCard;
