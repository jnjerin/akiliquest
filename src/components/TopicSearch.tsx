"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function TopicSearch() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      // Navigate to explore page with the topic
      router.push(`/explore?topic=${encodeURIComponent(topic.trim())}`);
    } catch (error) {
      console.error("Error starting quest:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-emerald-500" />
            </div>
            
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Input a topic..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-emerald-200 dark:border-emerald-800 rounded-xl 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900
                         transition-all duration-200 outline-none"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500     
                       hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600
                       disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                       text-white font-semibold py-4 px-8 rounded-xl text-lg
                       transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 outline-none
                       shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Starting Quest...</span>
              </div>
            ) : (
              "Start My Quest"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
