import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ComplaintView() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [comment, setComment] = useState("");
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [newCommentIds, setNewCommentIds] = useState(new Set());

  // -------- FETCH DETAIL --------
  const fetchDetail = async () => {
    const res = await api.get(`/complaints/${id}`);
    setComplaint(res.data);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // -------- UPVOTE --------
  const handleUpvote = async () => {
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    setHasUpvoted(true);
    
    try {
      const res = await api.post(`/complaints/${id}/upvotes`);

      // Optimistic update with animation
      setComplaint(prev => ({
        ...prev,
        upvote_count: res.data.upvote_count
      }));

    } catch (err) {
      setHasUpvoted(false);
      alert(err.response?.data?.error || "Failed to upvote");
    } finally {
      setTimeout(() => setIsUpvoting(false), 300);
    }
  };

  // -------- COMMENT --------
  const handleComment = async () => {
    if (!comment.trim() || isCommenting) return;

    setIsCommenting(true);

    try {
      await api.post(`/complaints/${id}/comment`, {
        comment,
      });

      setComment("");
      
      // Fetch and mark new comment
      const prevCommentCount = complaint.comments.length;
      await fetchDetail();
      
      // Mark the new comment for animation
      setTimeout(() => {
        setNewCommentIds(new Set([prevCommentCount]));
        setTimeout(() => setNewCommentIds(new Set()), 2000);
      }, 100);
      
    } finally {
      setIsCommenting(false);
    }
  };

  // Handle Enter key for comment
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading complaint...</p>
        </div>
      </div>
    );
  }

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-10">
      
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 transform transition-all hover:shadow-xl">
        
        {/* Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[complaint.status] || statusColors.pending}`}>
            {complaint.status?.toUpperCase() || 'PENDING'}
          </span>
          <span className="text-sm text-gray-500">ID: #{id}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {complaint.title}
        </h1>

        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{complaint.description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 transform transition-all hover:scale-105 hover:bg-gray-100">
            <span className="text-2xl">🏷️</span>
            <div>
              <p className="text-xs text-gray-500">Issue Type</p>
              <p className="font-semibold">{complaint.issue_type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 transform transition-all hover:scale-105 hover:bg-gray-100">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs text-gray-500">Area</p>
              <p className="font-semibold">{complaint.area}</p>
            </div>
          </div>
        </div>

        {/* Image */}
        {complaint.image && (
          <div className="mb-6">
            <img
              src={`http://localhost:5000/uploads/${complaint.image}`}
              className={`w-full rounded-lg cursor-pointer transition-all duration-300 ${
                imageExpanded ? 'max-w-full' : 'max-w-md hover:shadow-lg'
              }`}
              onClick={() => setImageExpanded(!imageExpanded)}
              alt="Complaint"
            />
            <p className="text-xs text-gray-500 mt-2">Click to {imageExpanded ? 'shrink' : 'expand'}</p>
          </div>
        )}

        {/* UPVOTE Button */}
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className={`group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
            ${hasUpvoted ? 'from-green-500 to-green-600' : ''}`}
        >
          <span className={`inline-block transition-transform duration-300 ${isUpvoting ? 'scale-150' : 'scale-100'}`}>
            {hasUpvoted ? '✅' : '👍'}
          </span>
          <span className="ml-2">
            {hasUpvoted ? 'Upvoted' : 'Upvote'} ({complaint.upvote_count})
          </span>
          
          {/* Ripple effect */}
          {isUpvoting && (
            <span className="absolute inset-0 bg-white opacity-30 animate-ping"></span>
          )}
        </button>
      </div>

      {/* COMMENTS */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💬 Comments
            <span className="text-sm font-normal text-gray-500">({complaint.comments.length})</span>
          </h2>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {complaint.comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">💭</p>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            complaint.comments.map((c, i) => (
              <div
                key={i}
                className={`border-l-4 border-blue-500 bg-gray-50 rounded-lg p-4 transform transition-all duration-500
                  ${newCommentIds.has(i) ? 'scale-105 bg-blue-50 border-blue-600 shadow-md' : 'hover:shadow-md hover:bg-gray-100'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {c.user?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{c.user || 'Anonymous'}</p>
                    <p className="text-gray-700 mt-1">{c.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD COMMENT */}
        <div className="border-t pt-6">
          <div className="flex gap-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a comment... (Press Enter to post)"
              className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              rows="2"
            />
            <button
              onClick={handleComment}
              disabled={!comment.trim() || isCommenting}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 rounded-xl font-semibold
                transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCommenting ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                '📤 Post'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to post, or click the button</p>
        </div>
      </div>
    </div>
  );
}