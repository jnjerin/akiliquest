interface TopicHeaderProps {
    topic: string;
  }
  
  export function TopicHeader({ topic }: TopicHeaderProps) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Topic: <span className="text-emerald-600 dark:text-emerald-400">{topic}</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
      </div>
    );
  }
  