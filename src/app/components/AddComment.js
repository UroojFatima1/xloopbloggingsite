"use client";

import { useState } from "react";

export default function AddComment({ postId, existingComments = [] }) {
  const [comments, setComments] = useState(existingComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        text: newComment,
        user: "Anonymous", // Replace with logged-in user if available
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setComments([data, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="mt-6">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full bg-transparent border border-gray-600 p-2 rounded text-white"
      />
      <button
        onClick={handleAddComment}
        className="mt-2 px-4 py-2 bg-purple-500 rounded hover:bg-purple-600"
      >
        Post Comment
      </button>

      <div className="mt-4 space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="border-b border-gray-700 pb-2">
            <p className="text-gray-300">{c.text}</p>
            <p className="text-sm text-gray-500">– {c.user}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
