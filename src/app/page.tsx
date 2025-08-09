'use client';

import { useRouter } from 'next/navigation';
import ProfileImage from "@/components/ProfileImage";
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import ChatInput from "@/components/ChatInput";

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
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <ProfileImage />
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
