"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { TechTool } from "@/data/techIcons";
import React from "react"; // Added missing import for React

type WorkExperienceProps = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  tools: TechTool[];
};

export default function WorkExperience({
  role,
  company,
  location,
  startDate,
  endDate,
  description,
  tools,
}: WorkExperienceProps) {
  const [currentTechIndex, setCurrentTechIndex] = useState(0);

  useEffect(() => {
    if (tools && tools.length > 0) {
      const interval = setInterval(() => {
        setCurrentTechIndex((prev) => (prev + 1) % tools.length);
      }, 2500); // Change every 2.5 seconds

      return () => clearInterval(interval);
    }
  }, [tools]);

  const currentTech = tools && tools.length > 0 ? tools[currentTechIndex] : null;

  return (
    <section
      className="h-screen snap-start flex items-center justify-center px-6 py-10"
    >
      <motion.div
        className="bg-card border border-border rounded-xl p-8 shadow-lg hover:shadow-xl max-w-4xl w-full"
        whileHover={{ 
          y: -8,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'none', // Override global transitions
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          transformOrigin: '50% 50%'
        }}
      >
        <div 
          className="grid md:grid-cols-2 gap-8 items-center"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Left side - Company logo and info */}
          <div
            className="text-center space-y-8"
          >
            <h2 
              className="text-3xl font-bold text-foreground"
            >
              {role}
            </h2>
            
            <h3 
              className="text-xl font-semibold text-foreground"
            >
              {company}
            </h3>
            
            <p 
              className="text-sm text-muted-foreground"
            >
              {location} • {startDate} – {endDate}
            </p>
          </div>

          {/* Right side - Description and tech stack */}
          <div
            className="space-y-6"
          >
            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Key Responsibilities</h4>
              <ul
                className="list-disc list-inside text-muted-foreground text-sm space-y-2"
              >
                {description.map((item, i) => (
                  <li
                    key={i}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Section */}
            {tools && tools.length > 0 && (
              <div className="border-t border-border pt-6">
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {currentTech && (
                      <motion.div
                        key={currentTechIndex}
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.8 }}
                        transition={{ 
                          duration: 0.6,
                          ease: "easeInOut"
                        }}
                        className="flex flex-col items-center"
                      >
                        {/* Tech Icon */}
                        <motion.div
                          initial={{ rotate: 360, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.8,
                            ease: "easeOut",
                            delay: 0.1
                          }}
                          className="text-5xl mb-3 text-foreground"
                        >
                          {React.createElement(currentTech.icon, {
                            className: "w-16 h-16 fill-current"
                          })}
                        </motion.div>
                        
                        {/* Tech Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.5,
                            delay: 0.3
                          }}
                          className="text-sm text-muted-foreground font-medium"
                        >
                          {currentTech.name}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
