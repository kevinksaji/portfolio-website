"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";

const socials = [
  {href: "https://www.linkedin.com/feed/", label: "LinkedIn", src: "linkedin.png"},
  {href: "https://github.com/kevinksaji?tab=repositories/", label: "GitHub", src: "github.png"},
  {href: "https://www.instagram.com/", label: "Instagram", src: "instagram.png"},
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

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* Search Container */}
      <div className="flex items-center space-x-2 w-full">
        <Input
            type="text"
            className="px-3 py-2 w-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} // updates the query state on input change
            onKeyDown={(e) => e.key === "Enter" && onSearch()} // allows search on either search button click or enter key press
        />
        <Button className="px-3 py-2" onClick={onSearch}>
          {/* Search Icon */}
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Button>
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