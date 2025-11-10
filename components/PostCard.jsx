"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import CommentSection from "./CommentSection";
import VoteButton from "./VoteButton";

export default function PostCard({ post, onUpdate }) {
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    fetchVotes();
  }, [post.id, user?.id]);

  async function fetchVotes() {
    const res = await fetch(`/api/posts/${post.id}/votes`);
    if (res.ok) {
      const data = await res.json();
      setVoteCount(data.total);
      setUserVote(data.userVote);
    }
  }

  function formatTimeAgo(date) {
    const now = new Date();
    const postDate = new Date(date);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Vote and Content Container */}
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-2">
          <VoteButton
            postId={post.id}
            userVote={userVote}
            onVoteChange={fetchVotes}
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
            {voteCount}
          </span>
        </div>

        {/* Post Content */}
        <div className="flex-1 p-4">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-2">
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {(post.author?.name || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {post.author?.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              • {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* Post Content */}
          <p className="text-gray-900 dark:text-gray-100 mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-3 rounded-md overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full h-auto max-h-96 object-cover rounded-md"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post._count?.comments ?? post.comments?.length ?? 0} Comments</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

