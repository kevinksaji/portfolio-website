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
    if (name.includes("cpf") || name.includes("provident")) return "/cpf-logo.png";
    if (name.includes("accenture")) return "/github.png"; // placeholder
    if (name.includes("truly")) return "/next.svg"; // placeholder
    // default placeholder
    return "/vercel.svg";
  };

  const logo = logoForCompany(company);

  return (
    <section className="flex w-full justify-center">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <div className="flex items-center md:w-56 md:flex-col md:items-center">
            <img
              src={logo}
              alt={`${company} logo`}
              className="h-16 w-16 rounded-full object-cover md:mb-4"
            />
            <div className="ml-4 text-left md:ml-0">
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
