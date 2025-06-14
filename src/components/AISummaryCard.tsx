import { SparklesIcon } from "@heroicons/react/24/outline";

interface AISummaryCardProps {
  summary: string;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-800 p-6 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <SparklesIcon className="h-6 w-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          🧠 AI Summary
        </h2>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {summary}
      </p>
      
      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border-l-4 border-emerald-500">
        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
          💡 This summary was generated using Google Cloud AI to identify key concepts and connections.
        </p>
      </div>
    </div>
  );
}
