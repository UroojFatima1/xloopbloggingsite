"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const token = document.cookie.includes("token=");
    setIsLoggedIn(token);
  }, []);

  function handleLogout() {
    document.cookie = "token=; Max-Age=0; path=/;";
    router.push("/");
  }

  return (
    <nav className="bg-[#0a0a0a]/90 backdrop-blur-lg sticky top-0 z-50 border-b border-purple-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-500">
          Blogify
        </Link>

        <div className="flex gap-5 text-gray-300 items-center">
          <Link href="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-purple-400 transition">
            Dashboard
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-white text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-white text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
