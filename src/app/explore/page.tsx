"use client";

import { Suspense } from "react";
import { ExploreContent } from "@/components/ExploreContent";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 opacity-60" />
        
        <div className="relative z-10">
          <Suspense fallback={<ExplorePageSkeleton />}>
            <ExploreContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function ExplorePageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );
}
