export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import Post from "@/model/Post";
import { verifyToken } from "@/lib/jwt";
import fs from "fs";

export async function POST(req) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split("token=")[1]?.split(";")[0];

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const content = formData.get("content");
    const imageFile = formData.get("image");

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "All fields (title, description, content) are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadPath = `./public/uploads/${imageFile.name}`;
      fs.writeFileSync(uploadPath, buffer);
      imageUrl = `/uploads/${imageFile.name}`;
    }

    const post = await Post.create({
      title,
      description,
      content,
      imageUrl,
      author: user.name || user.email,
      authorId: user.id, 
    });

    return NextResponse.json({ message: "Post created", post }, { status: 201 });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
