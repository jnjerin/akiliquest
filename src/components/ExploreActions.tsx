"use client";

import { ArrowPathIcon, ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline";
import { CuriosityNode } from "@/components/ExploreContent";

interface ExploreActionsProps {
  topic: string;
  trail: CuriosityNode[];
  onExploreDeeper: () => void;
}

export function ExploreActions({ topic, trail, onExploreDeeper }: ExploreActionsProps) {
  const handleDownloadTrail = () => {
    const trailData = {
      topic,
      timestamp: new Date().toISOString(),
      trail: trail.map(node => ({
        title: node.title,
        description: node.description,
        level: node.level
      }))
    };

    const blob = new Blob([JSON.stringify(trailData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_curiosity_trail.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${topic} - Curiosity Trail`,
      text: `Check out this fascinating curiosity trail about ${topic}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Unable to copy link. Please copy the URL manually.');
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={onExploreDeeper}
        className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
                   hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600
                   text-white font-semibold py-3 px-6 rounded-xl
                   transform transition-all duration-200 hover:scale-105 active:scale-95
                   focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 outline-none
                   shadow-lg hover:shadow-xl"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span>↻ Explore Deeper</span>
      </button>

      <button
        onClick={handleDownloadTrail}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800
                   hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950
                   text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300
                   font-semibold py-3 px-6 rounded-xl
                   transform transition-all duration-200 hover:scale-105 active:scale-95
                   focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 outline-none"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        <span>⬇ Download Trail</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800
                   hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950
                   text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300
                   font-semibold py-3 px-6 rounded-xl
                   transform transition-all duration-200 hover:scale-105 active:scale-95
                   focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 outline-none"
      >
        <ShareIcon className="h-5 w-5" />
        <span>🔗 Share</span>
      </button>
    </div>
  );
}
