'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";

const suggestions = ["Black Holes", "Jazz", "Ancient Egypt", "AI Ethics"];

export function TopicInput() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSearch = (input: string) => {
    if (!input) return;
    router.push(`/explore?topic=${encodeURIComponent(input)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Input a topic..."
          className="px-4 py-2 border rounded-md w-full sm:w-80 bg-white dark:bg-gray-800 dark:border-gray-600"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={() => handleSearch(topic)}
          className="bg-blue-600 dark:bg-yellow-500 text-white dark:text-black font-semibold px-4 py-2 rounded-md hover:opacity-90"
        >
          Start My Quest
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-300">Or try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSearch(suggestion)}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
}