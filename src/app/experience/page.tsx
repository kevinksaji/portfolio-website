"use client";

import WorkExperience from "@/components/WorkExperience";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import experiences from "@/data/experiences";

export default function Experience() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) return;

      if (e.deltaY > 50 && current < experiences.length - 1) {
        setDirection(1);
        setCurrent((prev) => prev + 1);
        isAnimating.current = true;
      } else if (e.deltaY < -50 && current > 0) {
        setDirection(-1);
        setCurrent((prev) => prev - 1);
        isAnimating.current = true;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [current]);

  // Unlock after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      isAnimating.current = false;
    }, 400); // match motion.duration + buffer
    return () => clearTimeout(timeout);
  }, [current]);

  return (
    <div className="h-screen w-full overflow-hidden relative">
        <div className="flex justify-center item-center text-center mt-30"><h1 className="text-5xl font-semibold">My Experiences</h1></div>
      {/* Dots navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
        {experiences.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-black scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <WorkExperience {...experiences[current]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
