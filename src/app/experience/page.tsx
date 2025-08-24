"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import experiences from "@/data/experiences"
import WorkExperience from "@/components/WorkExperience"

export default function ExperiencePage() {
  const [currentExperience, setCurrentExperience] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

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

    if (isSwipeDown && currentExperience > 0) {
      // Swipe down - go to previous experience
      setCurrentExperience(currentExperience - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    } else if (isSwipeUp && currentExperience < experiences.length - 1) {
      // Swipe up - go to next experience
      setCurrentExperience(currentExperience + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    }

    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse wheel navigation for desktop - no preventDefault
  const onWheel = (e: React.WheelEvent) => {
    if (isScrolling) return; // Prevent rapid scrolling
    
    if (e.deltaY > 0 && currentExperience < experiences.length - 1) {
      // Scroll down - go to next experience
      setCurrentExperience(currentExperience + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    } else if (e.deltaY < 0 && currentExperience > 0) {
      // Scroll up - go to previous experience
      setCurrentExperience(currentExperience - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    }
  };



  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return; // Prevent rapid key presses
      
      if (e.key === 'ArrowUp' && currentExperience < experiences.length - 1) {
        setCurrentExperience(currentExperience + 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
      } else if (e.key === 'ArrowDown' && currentExperience > 0) {
        setCurrentExperience(currentExperience - 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentExperience, isScrolling]);

  return (
    <main 
      className="h-screen w-full bg-background overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      {/* Experience indicator */}
      <div className="fixed top-1/2 right-6 z-50 flex flex-col space-y-2">
        {experiences.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentExperience 
                ? 'bg-foreground scale-125' 
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Current experience */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExperience}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full flex items-center justify-center"
        >
          <WorkExperience {...experiences[currentExperience]} />
        </motion.div>
      </AnimatePresence>
    </main>
  )
}