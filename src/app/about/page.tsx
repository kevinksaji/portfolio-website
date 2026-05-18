import Image from "next/image";

type SectionProps = {
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
};

function AboutSection({
  imgSrc,
  imgAlt,
  title,
  description,
  reverse = false,
}: SectionProps) {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 py-12 sm:flex-row lg:justify-center">
      {reverse ? (
        <>
          <div className="max-w-xl space-y-4 text-center sm:mr-12 sm:text-left">
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={320}
            height={320}
            className="mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl sm:mb-0 sm:h-80 sm:w-80"
          />
        </>
      ) : (
        <>
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={320}
            height={320}
            className="mb-8 h-72 w-72 rounded-2xl object-cover shadow-xl sm:mb-0 sm:mr-12 sm:h-80 sm:w-80"
          />
          <div className="max-w-xl space-y-4 text-center sm:text-left">
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
        </>
      )}
    </section>
  );
}

const sections = [
  {
    imgSrc: "/kevin-big.jpeg",
    imgAlt: "Portrait of Kevin",
    title: "Hello, I'm Kevin 👋",
    description:
      "I am a Computer Science student at SMU specialising in AI and product development.",
    reverse: false,
  },
  {
    imgSrc: "/kevin-floorball.jpg",
    imgAlt: "Kevin playing hockey",
    title: "Off the screen 🏑",
    description:
      "Outside of coding I love staying active – you'll often find me playing floorball or trying new sports with friends.",
    reverse: true,
  },
];

export default function About() {
  return (
    <div className="w-full bg-background">
      {sections.map((section) => (
        <AboutSection key={section.title} {...section} />
      ))}
    </div>
  );
}
