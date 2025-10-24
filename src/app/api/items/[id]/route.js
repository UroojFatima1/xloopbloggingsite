import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import POST from "@/model/Post";
import { verifyToken } from "@/lib/jwt";

// GET /api/items/:id - fetch single blog
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const blog = await POST.findById(id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json(blog);
  } catch (err) {
    console.error("Fetch blog error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/items/:id - delete blog
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = params;
    const blog = await POST.findById(id);

    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    if (blog.author !== payload.name && blog.author !== payload.email)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await POST.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete blog error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
