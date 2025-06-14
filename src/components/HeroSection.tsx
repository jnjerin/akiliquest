'use client'

import { TopicInput } from "@/components/TopicInput";

export function HeroSection() {
  return (
    <section className="text-center space-y-6">
      <h1 className="text-3xl md:text-5xl font-bold text-blue-700 dark:text-yellow-400">
        🌟 Welcome to AkiliQuest – Where Curiosity Sparks Insight!
      </h1>
      <TopicInput />
    </section>
  );
}