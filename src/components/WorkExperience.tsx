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
  void location;

  return (
    <section className="flex w-full justify-center">
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card/95 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:w-[19rem] lg:shrink-0">
            <div className="min-w-0 space-y-1">
              <h2 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                {role}
              </h2>
              <p className="text-base font-semibold leading-snug text-muted-foreground sm:text-lg">
                {company}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1">
                {startDate} – {endDate}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-5 sm:space-y-6">
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
