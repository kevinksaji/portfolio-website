import { techTools } from "./techIcons";

const experiences = [
  {
    role: "Cloud Engineer Intern",
    company: "Central Provident Fund Board",
    location: "Singapore",
    startDate: "December 2025",
    endDate: "Present",
    description: [
      "Full stack development using Java Spring Boot and Angular for the Citizen Disbursement Web Portal",
      "Designed and developed CI/CD pipeline improvements by incorporating functional regression testing using Playwright",
      "Integrated Oobee into the CI/CD pipeline to enforce WCAG 2.1/2.2 A–AA accessibility standards for web applications, delivering a more inclusive browsing experience for persons with disabilities"
    ],
    tools: [techTools.github, techTools.java, techTools.aws, techTools.springboot, techTools.angular, techTools.selenium],
  },
  {
    role: "Software Developer Intern",
    company: "Accenture",
    location: "Singapore",
    startDate: "May 2025",
    endDate: "November 2025",
    description: [
      "Designed, developed, and optimized Java Spring Batch jobs for large-scale data processing, and gathered business requirements in collaboration with cross-functional teams for a government client",
      "Configured batch workflows with AWS Step Functions, resolved production level defects and supported deployments across DEV, SIT, UAT, and PROD environments for different microservices in the backend system",
      "Improved backend system performance by optimising SQL queries and database indexing, achieving 40% reduction in runtimes",
      "Built Python-based AWS Lambda functions to automate API execution from S3-stored inputs, accelerating data processing workflows and eliminating manual intervention"
    ],
    tools: [techTools.github, techTools.java, techTools.aws, techTools.springboot, techTools.angular],
  },
  {
    role: "Web Developer",
    company: "Truly Community",
    location: "Singapore",
    startDate: "June 2024",
    endDate: "August 2024",
    description: [
      "Designed and developed a Telegram Mini App for anonymous direct messaging utilising Python, Vue.js and Supabase",
      "Developed the app for the SMU Confess platform for anonymous interactions between over 2000+ students",
    ],
    tools: [techTools.vue, techTools.python, techTools.supabase, techTools.flask, techTools.heroku, techTools.telegram],
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
    tools: [techTools.mysql, techTools.mamp],
  },
];

export default experiences;