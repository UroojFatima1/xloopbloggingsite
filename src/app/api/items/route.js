export const runtime = "nodejs";

import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

let posts = [
  {
    id: 1,
    title: "Understanding Authentication in Next.js",
    content: "Learn how cookies, JWTs, and middleware help secure your Next.js apps.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    author: "Urooj Fatima",
  },
  {
    id: 2,
    title: "Top 5 React Optimization Tips",
    content: "Discover ways to enhance performance and efficiency in your React projects.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    author: "Tech Insights",
  },
];

export async function GET() {
  return Response.json(posts);
}

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const { title, content, imageUrl } = await req.json();

    if (!title || !content) {
      return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      imageUrl: imageUrl || "https://via.placeholder.com/300x180?text=Blog+Post",
      author: user.name || user.email || "Anonymous",
    };

    posts.push(newPost);

    return Response.json({ message: "Post created successfully", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
