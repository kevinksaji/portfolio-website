"use client";
import { motion } from "framer-motion";
import Ticker from "framer-motion-ticker";
import { TechTool } from "@/data/techIcons";

type WorkExperienceProps = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  logo: string;
  tools: TechTool[];
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

export default function WorkExperience({
  role,
  company,
  location,
  startDate,
  endDate,
  description,
  logo,
  tools,
}: WorkExperienceProps) {
  return (
    <motion.section
      className="h-screen snap-start flex flex-col md:flex-row items-center justify-center px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex justify-center items-center mb-6 md:mb-0 mr-10"
        variants={itemVariants}
      >
        <img
          src={logo}
          alt={`${company} logo`}
          className="w-64 h-64 object-contain"
        />
        {/* Ticker Integration */}
      </motion.div>

      <motion.div
        className="max-w-xl text-center md:text-left space-y-3"
        variants={itemVariants}
      >
        <motion.h2 className="text-3xl font-bold" variants={itemVariants}>
          {role}
        </motion.h2>
        <motion.h3 className="text-xl font-semibold" variants={itemVariants}>
          {company}
        </motion.h3>
        <motion.p className="text-sm text-gray-500" variants={itemVariants}>
          {location} • {startDate} – {endDate}
        </motion.p>

        <motion.ul
          className="list-disc list-inside text-gray-70 text-sm space-y-1"
          variants={containerVariants}
        >
          {description.map((item, i) => (
            <motion.li key={i} variants={itemVariants}>
              {item}
            </motion.li>
          ))}
        </motion.ul>
        {tools && tools.length > 0 && (
          <motion.div className="mt-6 w-full overflow-hidden">
            <Ticker duration={5}>
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center mx-3"
                  title={tool.name}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={`#${tool.icon.hex}`}
                  >
                    <title>{tool.name}</title>
                    <path d={tool.icon.path} />
                  </svg>
                </div>
              ))}
            </Ticker>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
