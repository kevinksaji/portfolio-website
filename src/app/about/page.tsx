"use client"

import { motion } from "framer-motion"

/* ---------- variants copied from Experience ---------- */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
}

/* ---------- heading that morphs from button ---------- */
const Heading = () => (
    <motion.h1
        layoutId="about-title"                               /* 👈 same ID */
        className="
  fixed left-1/2 top-16 sm:top-20 md:top-24
  -translate-x-1/2 z-50
  text-4xl md:text-5xl font-bold text-gray-900
"
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      About
    </motion.h1>
)

/* ---------- reusable full-screen slide --------------- */
type SlideProps = {
  imgSrc: string
  imgAlt: string
  title: string
  description: string
  reverse?: boolean
}

function Slide({
                 imgSrc,
                 imgAlt,
                 title,
                 description,
                 reverse = false,
               }: SlideProps) {
  return (
      <motion.section
          className={`flex h-screen snap-start flex-col items-center justify-center
                  px-6 py-10 md:flex-row ${reverse ? "md:flex-row-reverse" : ""}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.6 }}
      >
        <motion.img
            src={imgSrc}
            alt={imgAlt}
            className="mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl
                   md:mb-0 md:mr-12 md:h-80 md:w-80"
            variants={itemVariants}
        />
        <motion.div
            className="max-w-xl space-y-4 text-center md:text-left"
            variants={itemVariants}
        >
          <h2 className="text-4xl font-bold">{title}</h2>
          <p className="text-lg text-gray-700">{description}</p>
        </motion.div>
      </motion.section>
  )
}

export default function About() {
  return (
      <main
          className="h-screen snap-y snap-mandatory overflow-y-scroll bg-white/50"
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

        {/* slide #1 */}
        <Slide
            imgSrc="/kevin-big.jpeg"
            imgAlt="Portrait of Kevin"
            title="Hello, I’m Kevin 👋"
            description="I am a third-year Computer Science student at SMU specialising in AI and product development."
        />

        {/* slide #2 */}
        <Slide
            imgSrc="/kevin-floorball.jpg"
            imgAlt="Kevin playing hockey"
            title="Off the screen 🏑"
            description="Outside of coding I love staying active – you’ll often find me playing hockey or trying new sports with friends."
            reverse
        />
      </main>
  )
}