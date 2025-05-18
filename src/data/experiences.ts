import { siPython } from "simple-icons";
import { siAmazonwebservices } from "simple-icons";
import { siSupabase } from "simple-icons";
import { siReact} from "simple-icons";
import { siFlask } from "simple-icons";
import { siAngular } from "simple-icons";
import { siSpringboot } from "simple-icons";
import { siNodedotjs } from "simple-icons";
import { siC } from "simple-icons";
import { siVuedotjs } from "simple-icons";
import { siNotion } from "simple-icons";
import { siPostgresql } from "simple-icons";
import { siMysql } from "simple-icons";
import { techTools } from "./techIcons";


const experiences = [
  {
    role: "Software Developer Intern",
    company: "Accenture",
    location: "Raffles Place, Singapore",
    startDate: "May 2025",
    endDate: "Present",
    description: [
      "Hands-on experience with Angular, Java, and Python, enhancing my expertise in full-stack development",
      "Insight into the complete software development lifecycle, from design to deployment",
      "Exposure to industry-standard tools and methodologies for software development and deployment"
    ],
    logo: "/accenture.png",
    tools: [techTools.github, techTools.spring, techTools.aws, techTools.springboot, techTools.angular, techTools.python],
  },
  {
    role: "Web Developer",
    company: "Truly Community",
    location: "Remote",
    startDate: "June 2024",
    endDate: "August 2024",
    description: [
      "Designed and developed a Telegram Mini App for anonymous direct messaging utilising Python, Vue.js and Supabase",
      "Developed the app for the SMU Confess platform for anonymous interactions between over 2000+ students",
    ],
    logo: "/truly community.jpeg",
    tools: [techTools.vue, techTools.python, techTools.supabase, techTools.flask, techTools.vercel, techTools.heroku, techTools.telegram, techTools.notion],
  },
  {
    role: "Teaching Assistant",
    company: "Singapore Management University",
    location: "Bras Basah, Singapore",
    startDate: "January 2024",
    endDate: "May 2024",
    description: [
      "Course covered concepts in data management, database modeling, and logical design, progressing to advanced SQL operations",
      "Mentored 45 students and managed class administration and software set up, offering academic guidance to those in need",
    ],
    logo: "/smu.jpg",
    tools: [techTools.mysql, techTools.mamp],
  },
];

export default experiences;