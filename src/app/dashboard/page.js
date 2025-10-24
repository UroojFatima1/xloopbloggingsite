"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogCard from "@/app/components/BlogCard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingBlog, setEditingBlog] = useState(null); // blog being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/verify");
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to verify user:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  // Fetch user's blogs
  useEffect(() => {
    if (!user) return;

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/items");
        if (!res.ok) return;
        const data = await res.json();
        setBlogs(data.filter((b) => b.author === (user.name || user.email)));
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, [user]);

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditContent(blog.content);
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editContent) return;

    try {
      const res = await fetch(`/api/items/${editingBlog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          content: editContent,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBlogs((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
        setEditingBlog(null); // close modal
      }
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0014]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0014] text-gray-300">
        <p>You must log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0014] text-white flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-4xl font-bold text-purple-400">
            Welcome, {user?.name || user?.email || "Blogify User"}!
          </h1>

          <button
            onClick={() => router.push("/dashboard/add-post")}
            className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-lg transition shadow-lg text-lg font-medium"
          >
            Add Blog
          </button>
        </div>

        {blogs.length === 0 ? (
          <p className="text-gray-400 text-lg">You haven’t posted any blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                user={user}
                onDelete={() =>
                  setBlogs((prev) => prev.filter((b) => b._id !== blog._id))
                }
                onEdit={() => openEditModal(blog)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {editingBlog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a001f] p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl text-purple-400 mb-4">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 rounded bg-[#2a0030] border border-purple-700 text-white"
              />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 rounded bg-[#2a0030] border border-purple-700 text-white"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                rows={6}
                className="w-full p-2 rounded bg-[#2a0030] border border-purple-700 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
