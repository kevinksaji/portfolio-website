// the about page component that displays the about me section

"use client";

import { motion } from "framer-motion";

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

// heading component that morphs from the button on click of the About button from homnepage
const Heading = () => (
  // motion is a wrapper around standard html that make them animatable and accept animation specific properties
  <motion.h1
    layoutId="about-title"
    className="
  fixed left-1/2 top-16 sm:top-20 md:top-24
  -translate-x-1/2 z-50
  text-4xl md:text-5xl font-bold text-foreground
"
    transition={{ type: "spring", stiffness: 120, damping: 14 }}
  >
    About
  </motion.h1>
);

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
      className={`flex h-screen snap-start flex-col items-center justify-center
                  px-6 py-10 md:flex-row ${
                    reverse ? "md:flex-row-reverse" : ""
                  }`}
      variants={containerVariants} // for animating the section
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.6 }}
    >
      <motion.img
        src={imgSrc}
        alt={imgAlt}
        className={`mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl
                   md:mb-0 md:h-80 md:w-80 ${
                     reverse ? "md:ml-12" : "md:mr-12"
                   }`}
        variants={itemVariants} // for animating the image
      />
      <motion.div
        className="max-w-xl space-y-4 text-center md:text-left"
        variants={itemVariants} // for animating the text
      >
        <h2 className="text-4xl font-bold text-foreground">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </motion.div>
    </motion.section>
  );
}

export default function About() {
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

  return (
    <main
      className="h-screen snap-y snap-mandatory overflow-y-scroll bg-background/50"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Chrome / Edge scrollbar hide */}
      <style jsx global>{`
        main::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* morphing heading */}
      <Heading />

      {/* render slides dynamically */}
      {slides.map((slide, index) => (
        <Slide
          key={index}
          imgSrc={slide.imgSrc}
          imgAlt={slide.imgAlt}
          title={slide.title}
          description={slide.description}
          reverse={slide.reverse}
        />
      ))}
    </main>
  );
}
