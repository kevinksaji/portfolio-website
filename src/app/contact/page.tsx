"use client";

import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope
} from "react-icons/fa";

const socials = [
  { href: "https://www.linkedin.com/in/kevin-saji/", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://github.com/kevinksaji?tab=repositories/", label: "GitHub", icon: FaGithub },
  { href: "https://www.instagram.com/kevinksaji/", label: "Instagram", icon: FaInstagram },
  { href: "https://telegram.org/", label: "Telegram", icon: FaTelegram },
  { href: "https://wa.me/6590879293", label: "Whatsapp", icon: FaWhatsapp },
  { href: "/contact/email", label: "Email", icon: FaEnvelope, isInternal: true },
];

export default function Contact() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl px-8 gap-12">
        {/* Left Side - Let's Connect */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-6">
            Let&apos;s Connect.
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            I&apos;m actively looking for internships for the January - May 2026 period, as well as fresh graduate roles starting from May 2026.
          </p>
        </div>

        {/* Right Side - Social Icons */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {socials.map((social) => (
              social.isInternal ? (
                <Link key={social.href} href={social.href}>
                  <div
                    className="group flex flex-col items-center space-y-3 p-6 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <social.icon
                        className="w-8 h-8 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {social.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex flex-col items-center space-y-3 p-6 rounded-xl bg-card border border-border hover:border-ring hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                    <social.icon
                      className="w-8 h-8 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {social.label}
                  </span>
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
