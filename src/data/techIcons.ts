import { 
  SiSupabase, SiPython, SiC, SiVuedotjs, SiJavascript, SiAngular, 
  SiAmazonwebservices, SiSpringboot, SiGithub, SiFlask, SiVercel, 
  SiHeroku, SiTelegram, SiMysql, SiPostgresql, SiNotion, SiSpring, 
  SiMamp, SiReact, SiTypescript, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiMongodb, SiDocker, SiKubernetes, SiJenkins, SiGit,
  SiFigma, SiAdobexd, SiPostman, SiJira, SiConfluence
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';

export type TechTool = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const techTools: Record<string, TechTool> = {
  supabase: { name: 'Supabase', icon: SiSupabase },
  aws: { name: 'AWS', icon: SiAmazonwebservices },
  vue: { name: 'Vue.js', icon: SiVuedotjs },
  python: { name: 'Python', icon: SiPython },
  c: { name: 'C', icon: SiC },
  java: { name: 'Java', icon: DiJava },
  javascript: { name: 'JavaScript', icon: SiJavascript },
  angular: { name: 'Angular', icon: SiAngular },
  springboot: { name: "Spring Boot", icon: SiSpringboot },
  github: { name: "GitHub", icon: SiGithub },
  flask: { name: "Flask", icon: SiFlask },
  vercel: { name: "Vercel", icon: SiVercel },
  heroku: { name: "Heroku", icon: SiHeroku },
  telegram: { name: "Telegram", icon: SiTelegram },
  mysql: { name: "MySQL", icon: SiMysql },
  postgresql: { name: "PostgreSQL", icon: SiPostgresql },
  notion: { name: "Notion", icon: SiNotion },
  spring: { name: "Spring", icon: SiSpring },
  mamp: { name: "MAMP", icon: SiMamp },
  react: { name: "React", icon: SiReact },
  typescript: { name: "TypeScript", icon: SiTypescript },
  nextjs: { name: "Next.js", icon: SiNextdotjs },
  tailwind: { name: "Tailwind CSS", icon: SiTailwindcss },
  nodejs: { name: "Node.js", icon: SiNodedotjs },
  mongodb: { name: "MongoDB", icon: SiMongodb },
  docker: { name: "Docker", icon: SiDocker },
  kubernetes: { name: "Kubernetes", icon: SiKubernetes },
  jenkins: { name: "Jenkins", icon: SiJenkins },
  git: { name: "Git", icon: SiGit },
  figma: { name: "Figma", icon: SiFigma },
  adobexd: { name: "Adobe XD", icon: SiAdobexd },
  postman: { name: "Postman", icon: SiPostman },
  jira: { name: "Jira", icon: SiJira },
  confluence: { name: "Confluence", icon: SiConfluence },
};