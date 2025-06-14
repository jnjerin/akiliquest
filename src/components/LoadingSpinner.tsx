interface LoadingSpinnerProps {
    topic: string;
  }
  
  export function LoadingSpinner({ topic }: LoadingSpinnerProps) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Exploring {topic}...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI is analyzing connections and generating your curiosity trail
            </p>
          </div> 
                  
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>🔍 Analyzing topic relationships...</p>
              <p>🧠 Generating AI summary...</p>
              <p>🌐 Building curiosity connections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
