"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AddPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await fetch("/api/items", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.post) {
        router.push("/dashboard");
      } else {
        setError(data.error || data.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0014] text-white flex flex-col">
      <Header />
      <main className="flex-1 p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          Add New Post
        </h1>

        {error && (
          <p className="bg-red-900 text-red-300 p-3 mb-4 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded bg-[#1a001f] border border-purple-800 text-white"
            required
          />

          <input
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded bg-[#1a001f] border border-purple-800 text-white"
            required
          />

          <textarea
            placeholder="Full Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-2 rounded bg-[#1a001f] border border-purple-800 text-white"
            rows={6}
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-sm text-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 py-2 rounded hover:bg-purple-600 transition font-medium"
          >
            {loading ? "Saving..." : "Add Post"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
