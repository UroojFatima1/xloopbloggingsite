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
        if (!res.ok) {
          console.error("Error fetching blogs:", res.statusText);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("Invalid blogs data:", data);
          return;
        }
        setBlogs(data.filter((b) => b.author === (user.name || user.email)));
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, [user]);

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
          <p className="text-gray-400 text-lg">
            You haven’t posted any blogs yet.
          </p>
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
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
