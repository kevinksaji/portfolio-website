"use client"

import { useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import ChatInput from "@/components/ChatInput";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import ProfilePicture from "@/components/ProfilePicture";
import TechStack from "@/components/TechStack";
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const chatSectionRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (text: string) => {
    if (text.trim()) {
      // Redirect to chat page with the search query
      router.push(`/chat?q=${encodeURIComponent(text.trim())}`);
    }
  }, [router]);

  const scrollToChat = useCallback(() => {
    chatSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-background overflow-y-auto" style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-y-auto::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            display: none !important;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            display: none !important;
          }
          body::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
          }
          html::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
          }
        `
      }} />
      {/* Main Hero Section */}
      <main className="min-h-screen w-full flex flex-col items-center px-4 pt-20 pb-8 justify-start lg:justify-center bg-background">
        <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto py-8 lg:py-0">
          <div className="flex flex-col sm:flex-row justify-center w-full gap-4 lg:gap-6 mb-12">
            <div className="flex flex-col gap-4 lg:gap-6">
              <LeetCodeStats />
              <TechStack />
            </div>
            <GitHubStats />
            <ProfilePicture />
          </div>
          
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <GreetingText />
          </div>
          
          <NavigationButtons />
          
          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <button
              onClick={scrollToChat}
              className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Scroll to Ask Me Anything section"
            >
              <svg 
                className="w-10 h-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5" 
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Chat Section */}
      <section 
        ref={chatSectionRef}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8"
          >
            Ask away.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Have questions about Kevin&apos;s experience, skills, or just want to chat? I&apos;m here to help!
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full max-w-2xl mx-auto"
          >
            <ChatInput 
              onSendAction={handleSearch}
              placeholder="Ask me anything about Kevin&apos;s..."
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
