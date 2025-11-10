"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function VoteButton({ postId, userVote, onVoteChange }) {
  const { isSignedIn } = useUser();
  const [isVoting, setIsVoting] = useState(false);

  async function handleVote(value) {
    if (!isSignedIn) {
      alert("Please sign in to vote");
      return;
    }

    setIsVoting(true);
    try {
      // If clicking the same vote, remove it
      if (userVote === value) {
        await fetch(`/api/posts/${postId}/votes`, {
          method: "DELETE",
        });
      } else {
        await fetch(`/api/posts/${postId}/votes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
      }
      if (onVoteChange) {
        onVoteChange();
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          userVote === 1
            ? "text-orange-500"
            : "text-gray-400 hover:text-orange-500"
        }`}
        title="Upvote"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          userVote === -1
            ? "text-blue-500"
            : "text-gray-400 hover:text-blue-500"
        }`}
        title="Downvote"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

