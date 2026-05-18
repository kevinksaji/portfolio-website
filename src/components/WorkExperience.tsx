import { TechTool } from "@/data/techIcons";
import React from "react";

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
  const safeTools = tools ?? [];

  return (
    <section className="flex w-full justify-center">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-8">
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-5 text-center sm:space-y-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {role}
            </h2>

            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              {company}
            </h3>

            <p className="text-sm text-muted-foreground">
              {location} • {startDate} – {endDate}
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <h4 className="mb-3 text-lg font-semibold text-foreground">
                Key Responsibilities
              </h4>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                {description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {safeTools.length > 0 && (
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {safeTools.slice(0, 9).map((tool) => (
                    <div
                      key={tool.name}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="text-2xl text-foreground sm:text-3xl">
                        {React.createElement(tool.icon, {
                          className: "h-8 w-8 fill-current sm:h-10 sm:w-10",
                        })}
                      </div>
                      <div className="mt-1 text-xs font-medium text-muted-foreground">
                        {tool.name}
                      </div>
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
