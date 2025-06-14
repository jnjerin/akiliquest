"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TopicHeader } from "@/components/TopicHeader";
import { AISummaryCard } from "@/components/AISummaryCard";
import { CuriosityTrail } from "@/components/CuriosityTrail";
import { ExploreActions } from "@/components/ExploreActions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export interface CuriosityNode {
  id: string;
  title: string;
  description: string;
  level: number;
  connections?: string[];
}

export interface ExploreData {
  topic: string;
  summary: string;
  trail: CuriosityNode[];
  totalConnections: number;
}

export function ExploreContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const [exploreData, setExploreData] = useState<ExploreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "graph">("list");

  useEffect(() => {
    if (topic) {
      generateExploreData(topic);
    }
  }, [topic]);

  const generateExploreData = async (searchTopic: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Google Cloud AI integration
      // For now, using mock data that simulates the AI response
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockData: ExploreData = {
        topic: searchTopic,
        summary: `${searchTopic} is a fascinating field that encompasses multiple interconnected concepts and applications. Through AI analysis, we've discovered several intriguing connections that span across different domains, revealing unexpected relationships and deeper insights into how this topic influences various aspects of knowledge and society.`,
        trail: [
          {
            id: "1",
            title: searchTopic,
            description: `The foundational concept of ${searchTopic}`,
            level: 0,
            connections: ["2"]
          },
          {
            id: "2",
            title: "Core Principles",
            description: `Fundamental principles that govern ${searchTopic}`,
            level: 1,
            connections: ["3", "4"]
          },
          {
            id: "3",
            title: "Practical Applications",
            description: `Real-world applications and implementations`,
            level: 2,
            connections: ["5"]
          },
          {
            id: "4",
            title: "Theoretical Framework",
            description: `Theoretical underpinnings and mathematical models`,
            level: 2,
            connections: ["5"]
          },
          {
            id: "5",
            title: "Future Implications",
            description: `Potential future developments and societal impact`,
            level: 3,
            connections: []
          }
        ],
        totalConnections: 6
      };

      setExploreData(mockData);
    } catch (err) {
      setError("Failed to generate exploration data. Please try again.");
      console.error("Error generating explore data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Topic Selected
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please go back and select a topic to explore.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner topic={topic} />;
  }

  if (error || !exploreData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Error Loading Content
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => generateExploreData(topic)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TopicHeader topic={exploreData.topic} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <AISummaryCard summary={exploreData.summary} />
        </div>
        
        <div className="lg:col-span-2">
          <CuriosityTrail 
            trail={exploreData.trail}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      <ExploreActions 
        topic={exploreData.topic}
        trail={exploreData.trail}
        onExploreDeeper={() => generateExploreData(exploreData.topic)}
      />
    </div>
  );
}
