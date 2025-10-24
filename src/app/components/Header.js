"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header({ user }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dp, setDp] = useState("/uploads/default-dp.png");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setDp(user.profilePic || "/uploads/default-dp.png");
    }
  }, [user]);

 const handleLogout = async () => {
  try {
    await fetch("/api/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout failed:", err);
  }
  localStorage.removeItem("token");
  router.push("/");

};


  const handleProfileSave = async () => {
    setErrorMsg("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (file) formData.append("image", file);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setDp(data.user.profilePic || "/uploads/default-dp.png");
        setName(data.user.name);
        setEmail(data.user.email);
        setProfileOpen(false);
        setFile(null);
        setFileName("");
      } else {
        setErrorMsg(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while updating profile");
    }
  };

  return (
    <header className="bg-[#1a001f] border-b border-purple-700 p-4 flex justify-between items-center">
      <div
        className="text-purple-400 text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Blogify
      </div>

      <nav className="flex items-center gap-4">
        <button
          className="text-purple-200 hover:text-white"
          onClick={() => router.push("/dashboard")}
        >
          Home
        </button>

        <button
          className="text-purple-200 hover:text-white"
          onClick={() => router.push("/blogs")}
        >
          All Blogs
        </button>


        <div className="relative">
          <img
            src={dp}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-500 object-cover"
            onClick={() => setProfileOpen(!profileOpen)}
          />

          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-[#0a0014] p-4 rounded-lg shadow-lg w-72 border border-purple-700 z-50">
              <h3 className="text-purple-300 font-semibold mb-2">
                Edit Profile
              </h3>

              {errorMsg && (
                <p className="text-red-500 mb-2 text-sm">{errorMsg}</p>
              )}

  
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-2 rounded bg-[#1a001f] border border-purple-600 text-white"
                placeholder="Your Name"
              />

    
              <input
                type="email"
                value={email}
                readOnly
                className="w-full p-2 mb-2 rounded bg-[#1a001f] border border-purple-600 text-gray-400 cursor-not-allowed"
                placeholder="Your Email"
              />

      
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0]?.name || "");
                }}
                className="w-full mb-1 text-white"
              />
              {fileName && (
                <p className="text-gray-400 text-sm mb-2">
                  Selected: {fileName}
                </p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleProfileSave}
                  className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    setErrorMsg("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
