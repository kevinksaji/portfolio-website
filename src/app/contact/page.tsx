"use client";

import { motion } from "framer-motion";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaTelegram,
  FaWhatsapp
} from "react-icons/fa";

const socials = [
  {href: "https://www.linkedin.com/in/kevin-saji/", label: "LinkedIn", icon: FaLinkedin},
  {href: "https://github.com/kevinksaji?tab=repositories/", label: "GitHub", icon: FaGithub},
  {href: "https://www.instagram.com/kevinksaji/", label: "Instagram", icon: FaInstagram},
  {href: "https://telegram.org/", label: "Telegram", icon: FaTelegram},
  {href: "https://wa.me/6590879293", label: "Whatsapp", icon: FaWhatsapp},
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

export default function Contact() {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-background pt-14">
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-8 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Left Side - Let's Connect */}
        <motion.div 
          className="flex-1 text-center md:text-left"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Let&apos;s Connect.
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-md"
            variants={itemVariants}
          >
            I&apos;m always open to new opportunities, collaborations, and interesting conversations. 
            Feel free to reach out through any of my social channels!
          </motion.p>
        </motion.div>

        {/* Right Side - Social Icons */}
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center space-y-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-2 gap-8">
            {socials.map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group flex flex-col items-center space-y-3 p-6 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center dark:group-hover:bg-foreground transition-colors duration-300">
                  <social.icon 
                    className="w-8 h-8 text-muted-foreground group-hover:text-black dark:group-hover:text-black transition-colors duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
