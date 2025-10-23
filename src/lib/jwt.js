import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecret";

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name }, 
    SECRET,
    { expiresIn: "1d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
