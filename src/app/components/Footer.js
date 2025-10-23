export default function Footer() {
  return (
    <footer className="bg-[#1a001f] text-gray-400 py-8 mt-auto border-t border-purple-800">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="text-purple-400 font-semibold">PurpleVerse</span>. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Crafted with 💜 using Next.js & TailwindCSS.
        </p>
      </div>
    </footer>
  );
}
