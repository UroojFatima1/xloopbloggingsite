export const runtime = "nodejs";

import {connectDB} from "@/lib/dbconnect";
import bcrypt from "bcryptjs";
import User from "@/model/User";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error("Signup Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
