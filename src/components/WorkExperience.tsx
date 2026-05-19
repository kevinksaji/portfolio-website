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

  const logoForCompany = (companyName: string) => {
    const name = (companyName || "").toLowerCase();
    if (name.includes("cpf") || name.includes("provident")) {
      return "/cpf-logo.png";
    }
    if (name.includes("accenture")) {
      return "/accenture-logo.svg";
    }

    return "/company-placeholder.svg";
  };

  const logo = logoForCompany(company);

  return (
    <section className="flex w-full justify-center">
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card/95 p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex flex-col gap-4 lg:w-[19rem] lg:shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-3 shadow-sm">
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {company}
                </p>
                <h2 className="mt-1 text-xl font-bold leading-tight text-foreground sm:text-2xl">
                  {role}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1">
                {location}
              </span>
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
