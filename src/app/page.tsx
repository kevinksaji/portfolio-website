"use client"

import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import NavigationButtons from "@/components/NavigationButtons";
import GreetingText from "@/components/GreetingText";
import ChatInput from "@/components/ChatInput";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import ProfilePicture from "@/components/ProfilePicture";
import TechStack from "@/components/TechStack";
import { motion, AnimatePresence } from 'framer-motion';

// define sections data
const sections = [
  'hero', // Main hero section
  'chat'  // Ask away section
];

export default function Home() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Touch handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isScrolling) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50; // Swipe up threshold
    const isSwipeDown = distance < -50; // Swipe down threshold

    if (isSwipeDown && currentSection > 0) {
      // Swipe down - go to previous section
      setCurrentSection(currentSection - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    } else if (isSwipeUp && currentSection < sections.length - 1) {
      // Swipe up - go to next section
      setCurrentSection(currentSection + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    }

    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Wheel event handler with non-passive behavior
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrolling) return; // Prevent rapid scrolling
    
    if (currentSection === 0) {
      // In hero section - check scroll boundaries
      const heroElement = heroRef.current;
      if (heroElement) {
        const { scrollTop, scrollHeight, clientHeight } = heroElement;
        
        if (e.deltaY > 0) {
          // Scrolling down
          if (scrollTop + clientHeight >= scrollHeight) {
            // At bottom of hero section, transition to next section
            e.preventDefault();
            setCurrentSection(1);
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 500);
          }
        } else if (e.deltaY < 0) {
          // Scrolling up
          if (scrollTop <= 0) {
            // At top of hero section, prevent further scrolling
            e.preventDefault();
            // Don't call setCurrentSection(0) since we're already in section 0
          }
        }
      }
    } else if (currentSection === 1) {
      // In chat section - check scroll boundaries
      e.preventDefault();
      if (e.deltaY < 0) {
        // Scrolling up, transition to hero section
        setCurrentSection(0);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500);
      }
    }
  }, [currentSection, isScrolling]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return; // Prevent rapid key presses
      
      if (e.key === 'ArrowUp' && currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
      } else if (e.key === 'ArrowDown' && currentSection > 0) {
        setCurrentSection(currentSection - 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, isScrolling, handleWheel]);

  const handleSearch = useCallback(async (text: string) => {
    if (text.trim()) {
      // Redirect to chat page with the search query
      router.push(`/chat?q=${encodeURIComponent(text.trim())}`);
    }
  }, [router]);

  return (
    <main 
      className="h-screen w-full bg-background overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Current section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full flex items-center justify-center"
        >
          {currentSection === 0 ? (
            // Main Hero Section - Scrollable
            <div 
              ref={heroRef}
              className="h-full w-full overflow-y-auto px-4 pt-8 pb-8"
              style={{ scrollbarWidth: 'none' }}
            >
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
                `
              }} />
              <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto py-8 lg:py-0 min-h-full">
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
                
                {/* Bouncing chevron indicator */}
                <div className="mt-12 animate-bounce">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <svg 
                      className="w-12 h-12" 
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
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Section
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
                Ask away.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Have questions about Kevin&apos;s experience, skills, or just want to chat? I&apos;m here to help!
              </p>
              <div className="w-full max-w-2xl mx-auto">
                <ChatInput onSendAction={handleSearch} placeholder="Ask me anything about Kevin..." />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
