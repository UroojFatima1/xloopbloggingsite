"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import sanitizeHtml from "sanitize-html";
import { Eye, EyeOff } from "lucide-react";
import Popup from "@/app/components/Popup";

export default function Home() {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false); 
  const [showLogin, setShowLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const blogs = [
    {
      id: 1,
      title: "Embracing the Night Sky",
      desc: "How darkness inspires creativity and reflection.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "The Beauty of Minimalism",
      desc: "Simplicity isn’t about lack — it’s about clarity and purpose.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "Digital Balance",
      desc: "Disconnect to reconnect with your inner self.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const schema = Yup.object().shape({
    name: showLogin
      ? Yup.string().notRequired()
      : Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        passwordRules,
        "Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters"
      )
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setMessage("");

    const sanitized = {
      name: sanitizeHtml(data.name || ""),
      email: sanitizeHtml(data.email),
      password: sanitizeHtml(data.password),
    };

    const endpoint = showLogin ? "/api/login" : "/api/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(result.message || "Success!");

  
      reset();

      if (showLogin) {
        router.push("/dashboard");

      } else {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setShowLogin(true);
        }, 2000);
      }
    } else {
      setMessage(result.error || "Something went wrong");
    }
  };

  return (
    <>
      {showPopup && (
        <Popup
          message="Signup successful! Redirecting to login..."
          onClose={() => setShowPopup(false)}
        />
      )}

      
      <div className="min-h-screen bg-gradient-to-b from-[#0a0014] via-[#1a0026] to-[#0a0014] text-gray-100 flex flex-col items-center justify-center px-4 py-10 overflow-y-auto">
        <div className="w-full max-w-4xl bg-[#1a001f]/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-700 overflow-hidden mb-16 mt-10">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 flex flex-col justify-center items-center p-10 text-center bg-gradient-to-b from-purple-900/30 to-black">
              <h1 className="text-5xl font-extrabold text-purple-400 mb-4 tracking-wide">
                Blogify
              </h1>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Where words meet imagination — share your thoughts, stories, and
                ideas.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    showLogin
                      ? "bg-purple-700 text-white"
                      : "bg-transparent border border-purple-700 text-purple-400 hover:bg-purple-800/40"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    !showLogin
                      ? "bg-purple-700 text-white"
                      : "bg-transparent border border-purple-700 text-purple-400 hover:bg-purple-800/40"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#0f0015]/70 p-10 flex flex-col justify-center relative">
              <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
                {showLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 transition-all duration-300"
              >
                {!showLogin && (
                  <>
                    <input
                      {...register("name")}
                      placeholder="Full Name"
                      className="w-full p-3 bg-[#1a1a1a] border border-purple-700 text-white rounded-md focus:ring-2 focus:ring-purple-600"
                    />
                    <p className="text-red-500 text-sm">
                      {errors.name?.message}
                    </p>
                  </>
                )}

                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full p-3 bg-[#1a1a1a] border border-purple-700 text-white rounded-md focus:ring-2 focus:ring-purple-600"
                />
                <p className="text-red-500 text-sm">{errors.email?.message}</p>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Password"
                    className="w-full p-3 bg-[#1a1a1a] border border-purple-700 text-white rounded-md focus:ring-2 focus:ring-purple-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-white hover:text-purple-400"
                  >
                    {showPassword ? (
                      <EyeOff size={20} strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>

                <button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {showLogin ? "Login" : "Sign Up"}
                </button>

                {message && (
                  <p className="text-center text-sm mt-3 text-gray-300">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        <section className="max-w-6xl w-full text-center mt-10">
          <h2 className="text-3xl font-bold text-purple-400 mb-8">
            Featured Blogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-xl overflow-hidden bg-[#1a001f] border border-purple-800 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5 text-left">
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{blog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 text-sm text-gray-500 text-center mb-6">
          © {new Date().getFullYear()} Blogify — Built with 💜 using Next.js &
          TailwindCSS
        </p>
      </div>
    </>
  );
}
