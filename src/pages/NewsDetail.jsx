import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, relatedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}blog/get/${slug}`),
        
        ]);
        console.log("blogsss",articleRes.data )
        setArticle(articleRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load article");
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link 
          to="/news" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Article not found
        </div>
        <Link 
          to="/news" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate reading time
  const wordCount = article.description.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <Link 
                to="/news" 
                className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to News
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {article.title}
              </h1>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>{formattedDate}</span>
                </div>
                
              </div>
            </div>
           
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.description }}
        ></div>

        {/* Author Info (if available) */}
        {article.author && (
  <div className="mt-12 pt-8 border-t border-gray-200">
    <div className="flex items-center">
      <img 
        src={article.author.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
        alt={article.author.name || 'Admin'} 
        className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-100"
      />
      <div>
        <h4 className="font-bold text-gray-900">
          {article.author.name || 'Admin'}
        </h4>
        <p className="text-gray-600 text-sm mt-1">
          {article.author.bio || 'Content author and administrator'}
        </p>
      </div>
    </div>
  </div>
)}
      </div>

     
    </div>
  );
}

export default NewsDetail;