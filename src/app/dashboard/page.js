import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { GET as getPosts } from "@/app/api/items/route"; 

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? verifyToken(token) : null;


  const postsResponse = await getPosts();
  const postsData = await postsResponse.json();

  return (
    <div className="min-h-screen bg-[#0a0014] text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-purple-400">
        {user ? `Welcome, ${user.name || user.email}` : "Welcome to Blogify!"}
      </h1>

      <h2 className="text-2xl mb-4">Your Blogs</h2>

      {postsData.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {postsData.map((post) => (
            <div
              key={post.id}
              className="bg-[#1a001f] border border-purple-800 p-4 rounded-xl"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="rounded-md mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-purple-300">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{post.content}</p>
              <p className="text-gray-500 text-xs mt-2 italic">— {post.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
