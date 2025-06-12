import { TopicInput } from "./TopicInput";
import { m as motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-blue-700 dark:text-yellow-400"
      >
        🌟 Welcome to AkiliQuest – Where Curiosity Sparks Insight!
      </motion.h1>
      <TopicInput />
    </section>
  );
}