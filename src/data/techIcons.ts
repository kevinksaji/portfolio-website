import { SimpleIcon, siSupabase, siPython, siC, siVuedotjs, siJavascript, siAngular, siAmazonwebservices, siSpringboot, siGithub, siFlask, siVercel, siHeroku, siTelegram, siMysql, siPostgresql, siNotion, siSpring, siMamp, siWinamp} from 'simple-icons';

export type TechTool = {
  name: string;
  icon: SimpleIcon;
};

export const techTools: Record<string, TechTool> = {
  supabase: { name: 'Supabase', icon: siSupabase },
  aws: { name: 'AWS', icon:  siAmazonwebservices},
  vue: { name: 'Vue.js', icon: siVuedotjs },
  python: { name: 'Python', icon: siPython },
  c: { name: 'C', icon: siC },
  java: { name: 'JavaScript', icon: siJavascript },
  angular: {name: 'Angular', icon: siAngular},
  springboot: {name: "SpringBoot", icon: siSpringboot},
  github: {name: "GitHub", icon: siGithub},
  flask: {name: "Flask", icon: siFlask},
  vercel: {name: "Vercel", icon: siVercel},
  heroku: {name: "Heroku", icon: siHeroku},
  telegram: {name:"Telegram", icon: siTelegram},
  mysql: {name: "MySQL", icon: siMysql},
  postgreql: {name: "Postgresql" , icon:siPostgresql},
  notion: {name: "Notion", icon: siNotion},
  spring: {name: "Spring", icon: siSpring},
  mamp: {name: "MAMP", icon: siMamp},

};