"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

// socials array of objects with href, label, and src for links tagged to social media icons
const socials = [
  {href: "https://www.linkedin.com/in/kevin-saji/", label: "LinkedIn", src: "linkedin.png"},
  {href: "https://github.com/kevinksaji?tab=repositories/", label: "GitHub", src: "github.png"},
  {href: "https://www.instagram.com/kevinksaji/", label: "Instagram", src: "instagram.png"},
  {href: "https://telegram.org/", label: "Telegram", src: "telegram.png"},
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (!query.trim()) return;
    // Pass the initial query through a search param and let /chat handle it.
    router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* Search Container */}
      <div className="relative w-full">
        <Input
            type="text"
            className="px-6 py-6 w-full border-black text-black placeholder:text-gray-500 focus:border-black focus:ring-black transition-colors pr-16"
            placeholder="Ask me anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
        />
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 text-black hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSearch} 
          disabled={!query.trim()}
        >
          {/* Search Icon */}
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      {/* Social Icons */}
      <div className="flex items-center justify-between w-full px-30">
        {socials.map((social) => (
            <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
            >
              <Avatar>
                <AvatarImage className="w-10 h-10" src={social.src} alt={social.label}/>
              </Avatar>
            </a>
        ))}
      </div>
    </div>
  );
}