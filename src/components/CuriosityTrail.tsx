"use client";

import { useState } from "react";
import { ListBulletIcon, ShareIcon } from "@heroicons/react/24/outline";
import { CuriosityNode } from "@/components/ExploreContent";
import { CuriosityList } from "@/components/CuriosityList";
import { CuriosityGraph } from "@/components/CuriosityGraph";

interface CuriosityTrailProps {
  trail: CuriosityNode[];
  viewMode: "list" | "graph";
  onViewModeChange: (mode: "list" | "graph") => void;
}

export function CuriosityTrail({ trail, viewMode, onViewModeChange }: CuriosityTrailProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ShareIcon className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🌐 Curiosity Trail
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("graph")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "graph"
                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {viewMode === "list" ? (
          <CuriosityList trail={trail} />
        ) : (
          <CuriosityGraph trail={trail} />
        )}
      </div>
    </div>
  );
}
