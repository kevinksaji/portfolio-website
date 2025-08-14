"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback, useMemo } from 'react'

export default function ProfilePicture() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const profiles = useMemo(() => [
    {
      image: "/kevin-headshot.jpg",
      alt: "Kevin Saji",
      title: "Software Engineer"
    },
    {
      image: "/kevin-floorball-homepage.jpg",
      alt: "Kevin Saji - Sportsman",
      title: "Sportsman"
    },
    {
      image: "/kevin-family.jpg",
      alt: "Kevin Saji - Family",
      title: "Family Guy"
    }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [profiles.length]);

  const typeText = useCallback((title: string) => {
    setIsTyping(true);
    setDisplayText("");
    
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < title.length) {
        setDisplayText(title.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 100); // Type each character every 100ms

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (profiles[currentIndex]) {
      const cleanup = typeText(profiles[currentIndex].title);
      return cleanup;
    }
  }, [currentIndex, profiles, typeText]);

  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px] sm:min-w-[220px] md:min-w-[260px]">
      <div className="text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 md:mb-6">Profile</h3>
        
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6">
          <div className="w-48 sm:w-52 md:w-56 h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Image
                  src={profiles[currentIndex].image}
                  alt={profiles[currentIndex].alt}
                  width={224}
                  height={192}
                  className="w-full h-full object-cover"
                  priority={currentIndex === 0}
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 208px, 224px"
                  quality={85}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Kevin Saji
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground min-h-[1.5rem] flex items-center justify-center">
              <span className="inline-block">
                {displayText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="ml-1 inline-block w-0.5 h-4 bg-muted-foreground"
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
