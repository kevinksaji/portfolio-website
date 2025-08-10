'use client';

import { useRouter } from 'next/navigation';
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import ChatInput from "@/components/ChatInput";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import VisitorsCount from "@/components/VisitorsCount";

export default function Home() {
  const router = useRouter();

  const handleSearch = (text: string) => {
    if (text.trim()) {
      // Redirect to chat page with the search query
      router.push(`/chat?q=${encodeURIComponent(text.trim())}`);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col items-center px-4 py-6 justify-center overflow-hidden bg-background">
      <div className="flex flex-col items-center justify-center text-center gap-16 w-full max-w-4xl mx-auto">
        <div className="flex justify-center w-full gap-6">
          <div className="flex flex-col gap-6">
            <LeetCodeStats />
            <VisitorsCount />
          </div>
          <GitHubStats />
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <GreetingText />
        </div>
        <NavigationButtons />
        <div className="w-full max-w-2xl">
          <ChatInput 
            onSendAction={handleSearch}
            placeholder="Ask me anything about Kevin..."
          />
        </div>
      </div>
    </main>
  );
}
