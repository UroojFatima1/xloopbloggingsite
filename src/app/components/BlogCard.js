export default function BlogCard({ blog }) {
  return (
    <div className="card hover:shadow-purple-700/30 hover:scale-[1.02] transition-all">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="text-xl font-bold text-purple-300 mb-1">{blog.title}</h3>
      <p className="text-gray-400 text-sm mb-2">
        By {blog.author} • {blog.date}
      </p>
      <p className="text-gray-300 text-sm">{blog.excerpt}</p>
      <button className="mt-3 btn text-sm w-full">Read More</button>
    </div>
  );
}
