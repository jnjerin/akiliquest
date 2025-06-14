import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CuriosityNode } from "@/components/ExploreContent";

interface CuriosityListProps {
  trail: CuriosityNode[];
}

export function CuriosityList({ trail }: CuriosityListProps) {
  const getIndentClass = (level: number) => {
    const indents = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16"];
    return indents[level] || "ml-16";
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
      "border-teal-500 bg-teal-50 dark:bg-teal-950",
      "border-cyan-500 bg-cyan-50 dark:bg-cyan-950",
      "border-blue-500 bg-blue-50 dark:bg-blue-950",
      "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
    ];
    return colors[level] || colors[colors.length - 1];
  };

  return (
    <div className="space-y-4">
      {trail.map((node, index) => (
        <div key={node.id} className={getIndentClass(node.level)}>
          <div className={`p-4 rounded-lg border-l-4 ${getLevelColor(node.level)} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {node.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {node.description}
                </p>
              </div>
              
              {index < trail.length - 1 && (
                <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-4 mt-1" />
              )}
            </div>
          </div>
          
          {/* Connection arrow for visual flow */}
          {index < trail.length - 1 && (
            <div className="flex justify-center py-2">
              <div className="w-px h-4 bg-gradient-to-b from-emerald-300 to-transparent dark:from-emerald-600"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
