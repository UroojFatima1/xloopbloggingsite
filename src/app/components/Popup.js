"use client";

export default function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-[#1a001f] border border-purple-700 text-purple-200 px-8 py-6 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] text-center">
        <h2 className="text-2xl font-semibold mb-2">Success 🎉</h2>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );
}
