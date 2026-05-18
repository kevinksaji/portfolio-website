import experiences from "@/data/experiences";
import WorkExperience from "@/components/WorkExperience";

export default function ExperiencePage() {
  return (
    <div className="w-full bg-background px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        {experiences.map((experience) => (
          <WorkExperience
            key={`${experience.company}-${experience.role}`}
            {...experience}
          />
        ))}
      </div>
    </div>
  );
}
