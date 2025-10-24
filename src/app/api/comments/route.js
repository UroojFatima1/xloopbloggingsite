import {connectDB} from "@/lib/dbconnect";
import Comment from "@/model/Comment";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const comments = await Comment.find();
  return NextResponse.json({ comments });
}

export async function POST(req) {
  await connectDB();
  const { blogId, author, text } = await req.json();

  if (!blogId || !author || !text)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const comment = await Comment.create({ blogId, author, text });
  return NextResponse.json({ comment }, { status: 201 });
}
