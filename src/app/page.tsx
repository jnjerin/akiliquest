import TopicInput from "../components/TopicInput";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-sky-50 px-4 py-10 text-gray-800">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        <Header />
        <TopicInput />
      </div>
    </main>
  );
}