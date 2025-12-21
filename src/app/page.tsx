"use client"

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import ChatInput from "@/components/ChatInput";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import ProfilePicture from "@/components/ProfilePicture";
import TechStack from "@/components/TechStack";

export default function Home() {
  const router = useRouter();

  // Prefetch blog data when homepage loads
  useEffect(() => {
    const prefetchBlogData = async () => {
      try {
        // Import dynamically to avoid server-side issues
        const { getBlogPosts } = await import('@/lib/notion');
        await getBlogPosts();
      } catch {
        // non-critical prefetch
      }
    };

    // Start prefetching immediately
    prefetchBlogData();
  }, []);

  const handleSearch = useCallback(async (text: string) => {
    if (text.trim()) {
      // Redirect to chat page with the search query
      router.push(`/chat?q=${encodeURIComponent(text.trim())}`);
    }
  }, [router]);

  return (
    <div className="w-full bg-background min-h-[calc(100dvh-3.5rem)] flex items-center">
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 w-full items-stretch lg:auto-rows-[220px] xl:auto-rows-[240px] lg:grid-flow-dense">
          <ProfilePicture className="h-full min-w-0 sm:col-span-2 lg:col-span-2 lg:row-span-2" />
          <GitHubStats className="h-full min-w-0" />
          <TechStack className="h-full min-w-0" />
          <LeetCodeStats className="h-full min-w-0 sm:col-span-2 lg:col-span-2" />
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <ChatInput onSendAction={handleSearch} placeholder="Ask me anything about Kevin..." />
        </div>
      </div>
    </div>
  );
}
