import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { TopicSearch } from "@/components/TopicSearch";
import { SuggestedTopics } from "@/components/SuggestedTopics";

export default function HomePage() {
  console.log("HomePage is rendering");
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 opacity-60" />
        
        <div className="relative z-10">
          <HeroSection />
          <TopicSearch />
          <SuggestedTopics />
        </div>
      </main>
    </div>
  );
}
