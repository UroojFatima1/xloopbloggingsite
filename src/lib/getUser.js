import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getLoggedInUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload;
}
