import Image from "next/image";

// This TypeScript type describes the props that the AboutSection component accepts.
type SectionProps = {
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
};

function AboutSection(props: SectionProps) {
  const imgSrc = props.imgSrc;
  const imgAlt = props.imgAlt;
  const title = props.title;
  const description = props.description;
  const reverse = props.reverse ?? false;

  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 py-12 sm:flex-row lg:justify-center">
      {/* reverse switches the order of the image and text to alternate the layout between sections. */}
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

// This array is the page content source. Each object becomes one rendered AboutSection.
const sections = [
  {
    imgSrc: "/kevin-big.jpeg",
    imgAlt: "Portrait of Kevin",
    title: "Hello, I'm Kevin 👋",
    description:
      "I am a recently graduated Computer Science major from SMU specialising in AI and product development ",
    reverse: false,
  },
  {
    imgSrc: "/kevin-floorball.jpg",
    imgAlt: "Kevin playing floorball",
    title: "Off the screen 🏑",
    description:
      "Outside of coding I love staying active – you'll often find me playing various sports like floorball or hockey.",
    reverse: true,
  },
];

export default function About() {
  return (
    <div className="w-full bg-background">
      {/* map iterates over the data array and returns one AboutSection component per item. */}
      {sections.map((section) => (
        <AboutSection key={section.title} {...section} />
      ))}
    </div>
  );
}
