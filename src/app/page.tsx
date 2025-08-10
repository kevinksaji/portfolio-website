'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import ChatInput from "@/components/ChatInput";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import ProfilePicture from "@/components/ProfilePicture";
import TechStack from "@/components/TechStack";

export default function Home() {
  const router = useRouter();
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  const handleSearch = async (text: string) => {
    if (text.trim()) {
      // Redirect to chat page with the search query
      router.push(`/chat?q=${encodeURIComponent(text.trim())}`);
    }
  };

  // Calculate dynamic spacing based on viewport height
  const getDynamicSpacing = () => {
    if (viewportHeight < 600) return 'gap-2 mb-2';
    if (viewportHeight < 800) return 'gap-3 mb-3';
    if (viewportHeight < 1000) return 'gap-4 mb-4';
    return 'gap-6 mb-6';
  };

  const getDynamicMargin = () => {
    if (viewportHeight < 600) return 'mt-2';
    if (viewportHeight < 800) return 'mt-3';
    if (viewportHeight < 1000) return 'mt-4';
    return 'mt-6';
  };

  return (
    <main className="h-screen-navbar w-full flex flex-col items-center px-4 pt-navbar-safe pb-6 justify-center overflow-hidden bg-background">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto h-full">
        <div className={`flex justify-center w-full gap-4 lg:gap-6 ${getDynamicSpacing()}`}>
          <div className={`flex flex-col gap-4 lg:gap-6`}>
            <LeetCodeStats />
            <TechStack />
          </div>
          <GitHubStats />
          <ProfilePicture />
        </div>
        <div className={`flex flex-col items-center justify-center text-center ${getDynamicSpacing()}`}>
          <GreetingText />
        </div>
        <NavigationButtons />
        <div className={`w-full max-w-2xl ${getDynamicMargin()}`}>
          <ChatInput 
            onSendAction={handleSearch}
            placeholder="Ask me anything about Kevin..."
          />
        </div>
      </div>
    </main>
  );
}
