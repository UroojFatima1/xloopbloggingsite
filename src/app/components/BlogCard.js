"use client";

import { useRouter } from "next/navigation";

export default function BlogCard({ blog, user, onDelete, onEdit }) {
  const router = useRouter();
  const isOwner = user && (user.name === blog.author || user.email === blog.author);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/items/${blog._id}`, { method: "DELETE" });
      if (res.ok && onDelete) onDelete();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div
      onClick={() => router.push(`/blogs/${blog._id}`)}
      className="bg-[#1a001f] p-4 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-600 transition relative"
    >
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      <h2 className="text-xl font-semibold text-purple-400">{blog.title}</h2>
      <p className="text-gray-400 text-sm mt-2">{blog.description}</p>
      <p className="text-gray-500 text-xs mt-3 italic">— {blog.author}</p>

      {isOwner && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
