"use client";

import { useRouter } from "next/navigation";

const suggestedTopics = [
  { name: "Black Holes", emoji: "🕳️" },
  { name: "Jazz", emoji: "🎷" },
  { name: "Ancient Egypt", emoji: "🏺" },
  { name: "AI Ethics", emoji: "🤖" },
];

export function SuggestedTopics() {
  const router = useRouter();

  const handleTopicClick = (topic: string) => {
    router.push(`/explore?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <section className="pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          👇 Or try:
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {suggestedTopics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => handleTopicClick(topic.name)}
              className="inline-flex items-center space-x-2 px-6 py-3 
                         bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800
                         hover:border-emerald-400 dark:hover:border-emerald-600
                         hover:bg-emerald-50 dark:hover:bg-emerald-950
                         text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300
                         rounded-lg font-medium transition-all duration-200
                         transform hover:scale-105 active:scale-95
                         focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 outline-none"
            >
              <span className="text-lg">{topic.emoji}</span>
              <span>{topic.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
