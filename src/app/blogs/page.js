"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogCard from "@/app/components/BlogCard";

export default function AllBlogsPage()
{
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [search, setSearch] = useState("");
const [user, setUser] = useState(null);

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


    const dummyBlogs = [
        {
            _id: "1",
            title: "My First Blog",
            description: "This is the description of my first blog post.",
            content: "This is the content of the first blog post.",
            author: "Alice",
            imageUrl: "/dummy1.jpg",
        },
        {
            _id: "2",
            description: "This is the description of my first blog post.",

            title: "Learning Next.js",
            content: "Next.js is amazing for building React apps!",
            author: "Bob",
            imageUrl: "/dummy2.jpg",
        },
        {
            _id: "3",
            description: "This is the description of my first blog post.",

            title: "React Tips",
            content: "Some useful React tips and tricks.",
            author: "Charlie",
            imageUrl: "/dummy3.jpg",
        },
    ];

    useEffect(() =>
    {

        const fetchBlogs = async () =>
        {
            try
            {
                const res = await fetch("/api/items");
                let data = [];
                const text = await res.text();
                data = text ? JSON.parse(text) : [];
                if (!data || data.length === 0) data = dummyBlogs;
                setBlogs(data);
                setFilteredBlogs(data);
            } catch (err)
            {
                console.error("Failed to fetch blogs:", err);
                setBlogs(dummyBlogs);
                setFilteredBlogs(dummyBlogs);
            }
        };

        fetchBlogs();
    }, []);

    const handleSearch = (e) =>
    {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        setFilteredBlogs(
            blogs.filter(
                (b) =>
                    b.title.toLowerCase().includes(query) ||
                    b.content.toLowerCase().includes(query) ||
                    b.author.toLowerCase().includes(query)
            )
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0014] text-white flex flex-col">
            <Header user={user} />

            <main className="flex-1 max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-purple-400 mb-6">All Blogs</h1>

                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full mb-6 p-3 rounded bg-[#1a001f] border border-purple-700 text-white focus:outline-none"
                />

                {filteredBlogs.length === 0 ? (
                    <p className="text-gray-400">No blogs found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
