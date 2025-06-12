"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopicInput() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!topic.trim()) return;
    router.push("/explore"); // later: pass topic as query param or context
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Enter a topic you're curious about..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        onClick={handleSubmit}
        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg shadow-md transition"
      >
        Start My Quest
      </button>
    </div>
  );
}