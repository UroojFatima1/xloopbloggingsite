"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function SingleBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState(""); // added for comment author
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch blog and comments
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/items/${id}`, { cache: "no-store" });
        if (!res.ok) {
          setError("Failed to fetch blog.");
          return;
        }
        const blogData = await res.json();
        setBlog(blogData);
      } catch (err) {
        console.error(err);
        setError("Error fetching blog.");
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comments", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const filtered = data.comments.filter((c) => c.blogId === id);
        setComments(filtered);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return alert("Enter your name and comment!");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: id,
          author: name.trim(),
          text: text.trim(),
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment.comment]);
        setName("");
        setText("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!blog) return <p className="text-center text-gray-400 mt-10">Loading...</p>;

  const isOwner = user?.name === blog.author || user?.email === blog.author;

  return (
    <>
      <Header user={user} />

      <div className="max-w-3xl mx-auto py-8 text-white">
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-purple-400 mb-2">{blog.title}</h1>
        <p className="text-gray-400 italic mb-6">by {blog.author}</p>
        <p className="text-gray-300 leading-relaxed mb-8">{blog.description}</p>
        <p className="text-gray-300 leading-relaxed mb-8">{blog.content}</p>

        {isOwner && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => router.push(`/dashboard/edit-post/${id}`)}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteBlog}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        <div className="bg-[#1a001f] p-5 rounded-lg shadow-md">
          <h2 className="text-xl text-purple-300 mb-3">Comments</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-[#2a0030] p-3 rounded-lg border border-purple-800 flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm text-gray-200">{c.text}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      — {c.author}
                    </p>
                  </div>
                  {name === c.author && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleComment} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-[#2a0030] border border-purple-700 text-white placeholder-gray-500"
            />
            <textarea
              placeholder="Write your comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded bg-[#2a0030] border border-purple-700 text-white placeholder-gray-500"
              rows="3"
            />
            <button
              type="submit"
              className="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700 transition"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
