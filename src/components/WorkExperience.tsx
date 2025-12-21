"use client";
import { useMemo } from "react";
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
  const safeTools = useMemo(() => tools ?? [], [tools]);

  return (
    <section
      className="flex items-center justify-center px-6 py-10 min-h-screen"
    >
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg hover:shadow-xl max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
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
            {safeTools.length > 0 && (
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-3 gap-4">
                  {safeTools.slice(0, 9).map((tool) => (
                    <div key={tool.name} className="flex flex-col items-center text-center">
                      <div className="text-3xl text-foreground">
                        {React.createElement(tool.icon, { className: "w-10 h-10 fill-current" })}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground font-medium">{tool.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
