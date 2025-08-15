// the about page component that displays the about me section

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const containerVariants = {
  // for animating each section of the page
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  // for animating each item in the section
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

// reusable full-screen slide component (declared as a type which is similar to an interface)
type SlideProps = {
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
};

function Slide({ // destructuring the props, each prop becomes a local variable
  imgSrc,
  imgAlt,
  title,
  description,
  reverse = false,
}: SlideProps) {
  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:flex-row lg:justify-center"
      variants={containerVariants} // for animating the section
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.6 }}
    >
      {reverse ? (
        <>
          <motion.div
            className="max-w-xl space-y-4 text-center sm:text-left sm:mr-12"
            variants={itemVariants} // for animating the text
          >
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </motion.div>
          <motion.img
            src={imgSrc}
            alt={imgAlt}
            className="mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl sm:mb-0 sm:h-80 sm:w-80"
            variants={itemVariants} // for animating the image
          />
        </>
      ) : (
        <>
          <motion.img
            src={imgSrc}
            alt={imgAlt}
            className="mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl sm:mb-0 sm:h-80 sm:w-80 sm:mr-12"
            variants={itemVariants} // for animating the image
          />
          <motion.div
            className="max-w-xl space-y-4 text-center sm:text-left"
            variants={itemVariants} // for animating the text
          >
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </motion.div>
        </>
      )}
    </motion.section>
  );
}

// define slides data
const slides = [
  {
    imgSrc: "/kevin-big.jpeg",
    imgAlt: "Portrait of Kevin",
    title: "Hello, I'm Kevin 👋",
    description:
      "I am a Computer Science student at SMU specialising in AI and product development.",
    reverse: false,
  },
  {
    imgSrc: "/kevin-floorball.jpg",
    imgAlt: "Kevin playing hockey",
    title: "Off the screen 🏑",
    description:
      "Outside of coding I love staying active – you'll often find me playing floorball or trying new sports with friends.",
    reverse: true,
  },
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0); // state to track the current slide  
  const [touchStart, setTouchStart] = useState(0); // state to track the touch start position
  const [touchEnd, setTouchEnd] = useState(0); // state to track the touch end position
  const [isScrolling, setIsScrolling] = useState(false); // state to track if the user is scrolling

  // Touch handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };
 
  const onTouchMove = (e: React.TouchEvent) => { 
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isScrolling) return; // if the touch start or touch end is not defined, or the isScrolling state is true, then return
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50; // Swipe up threshold - if the distance is greater than 50, then it is a swipe up
    const isSwipeDown = distance < -50; // Swipe down threshold - if the distance is less than -50, then it is a swipe down

    if (isSwipeDown && currentSlide > 0) {
      // Swipe down - go to previous slide
      setCurrentSlide(currentSlide - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown - set the isScrolling state to false after 500ms
    } else if (isSwipeUp && currentSlide < slides.length - 1) {
      // Swipe up - go to next slide
      setCurrentSlide(currentSlide + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown - set the isScrolling state to false after 500ms
    }

    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse wheel navigation for desktop with debouncing
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (isScrolling) return; // Prevent rapid scrolling
    
    if (e.deltaY > 0 && currentSlide < slides.length - 1) {
      // Scroll down - go to next slide
      setCurrentSlide(currentSlide + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    } else if (e.deltaY < 0 && currentSlide > 0) {
      // Scroll up - go to previous slide
      setCurrentSlide(currentSlide - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return; // Prevent rapid key presses
      
      if (e.key === 'ArrowDown' && currentSlide < slides.length - 1) { // if the arrow down key is pressed and the current slide is less than the length of the slides, then go to the next slide
        setCurrentSlide(currentSlide + 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown - set the isScrolling state to false after 500ms
      } else if (e.key === 'ArrowUp' && currentSlide > 0) { // if the arrow up key is pressed and the current slide is greater than 0, then go to the previous slide
        setCurrentSlide(currentSlide - 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500); // 500ms cooldown - set the isScrolling state to false after 500ms
      }
    };

    window.addEventListener('keydown', handleKeyDown); // add the event listener for the keydown event
    return () => window.removeEventListener('keydown', handleKeyDown); // remove the event listener for the keydown event when the component unmounts
  }, [currentSlide, isScrolling]);

  return (
    <main 
      className="h-screen w-full bg-background overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      {/* Slide indicator */}
      <div className="fixed top-1/2 right-6 z-50 flex flex-col space-y-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-foreground scale-125' 
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Current slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full flex items-center justify-center"
        >
          <Slide
            imgSrc={slides[currentSlide].imgSrc}
            imgAlt={slides[currentSlide].imgAlt}
            title={slides[currentSlide].title}
            description={slides[currentSlide].description}
            reverse={slides[currentSlide].reverse}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
