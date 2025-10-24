import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import User from "@/model/User";
import { verifyToken } from "@/lib/jwt";
import path from "path";
import fs from "fs/promises";

export const PUT = async (req) => {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ status: "error", message: "Invalid token" }, { status: 401 });

  const userId = payload.id;

  const formData = await req.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const image = formData.get("image");

  if (!name || !email)
    return NextResponse.json({ status: "error", message: "Name and email are required" }, { status: 400 });

  try {
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });

    user.name = name;
    user.email = email;


    if (image && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");


      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, filename);


      await fs.writeFile(filePath, buffer);

  
      user.profilePic = `/uploads/${filename}`;
    }

    await user.save();

    return NextResponse.json({
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to update profile" },
      { status: 500 }
    );
  }
};
