"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CommentSection({ postId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatTimeAgo(date) {
    const now = new Date();
    const commentDate = new Date(date);
    const seconds = Math.floor((now - commentDate) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || "You"}
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">
            {(user?.fullName || "U")[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "..." : "Reply"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {comment.author?.image ? (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name || "User"}
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                  {(comment.author?.name || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {comment.author?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

