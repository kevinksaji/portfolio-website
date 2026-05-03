export interface ResumeSection {
    name: string;
    content: string;
    keywords: string[];
}

export const resumeData: ResumeSection[] = [
    {
        name: "EDUCATION",
        content: "Singapore Management University (Jul 2022 – May 2026) — BSc Computer Science with majors in IT Solution Development (Artificial Intelligence track) and IT Solution Management (Product Development track). Raffles Institution (Jan 2018 – Dec 2019) — Singapore-Cambridge GCE 'A' Level. Victoria School (Jan 2014 – Dec 2017) — Singapore-Cambridge GCE 'O' Level.",
        keywords: ["SMU", "Singapore Management University", "Computer Science", "Artificial Intelligence", "Product Development", "Raffles Institution", "Victoria School", "Education"]
    },
    {
        name: "EXPERIENCE",
        content: "Cloud Engineer Intern at Central Provident Fund Board (Dec 2025 – May 2026) — built full-stack features with Java Spring Boot and Angular for the Citizen Disbursement Web Portal, integrated Playwright regression tests into CI/CD, embedded accessibility checks with Oobee, automated report sharing with AWS S3 and Lambda, and developed a generative AI proof of concept that converts natural-language user stories into Playwright tests.",
        keywords: ["CPF", "Central Provident Fund Board", "Cloud Engineer Intern", "Java", "Spring Boot", "Angular", "Playwright", "CI/CD", "Oobee", "AWS", "Lambda", "Accessibility", "Generative AI"]
    },
    {
        name: "EXPERIENCE",
        content: "Software Developer Intern at Accenture (May 2025 – Nov 2025) — designed and optimized Java Spring Batch jobs for large-scale government data processing, configured workflows with AWS Step Functions, resolved production defects across DEV, SIT, UAT, and PROD, improved SQL query runtimes by 40% with indexing, and built Python AWS Lambda automations driven from S3 inputs.",
        keywords: ["Accenture", "Software Developer Intern", "Spring Batch", "AWS Step Functions", "SQL", "Indexing", "Lambda", "S3", "Production Support", "Java", "Python"]
    },
    {
        name: "EXPERIENCE",
        content: "Teaching Assistant at Singapore Management University (Jun 2025 – Aug 2025) — taught data management, ER modeling, database design, normalisation, and advanced SQL, while mentoring 45 students and supporting class administration and software setup.",
        keywords: ["Teaching Assistant", "SMU", "Data Management", "ER Modeling", "Database Design", "Normalisation", "Advanced SQL", "Mentoring"]
    },
    {
        name: "EXPERIENCE",
        content: "Software Developer at Truly Community (Jun 2024 – Aug 2024) — designed and shipped new features for a messaging platform used by around 3000 university students and built a Telegram Mini App for anonymous interactions using Flask and Vue.js.",
        keywords: ["Truly Community", "Software Developer", "Telegram Mini App", "Flask", "Vue.js", "Messaging Platform", "University Students"]
    },
    {
        name: "PROJECTS",
        content: "Final Year Project – PayPal (Aug 2025 – Dec 2025) — created an AI-powered VS Code extension in TypeScript to integrate PayPal APIs with contextual code generation through an MCP server, real-time diff tracking, and autonomous tool-calling. Built a FastAPI backend for agent tool-calling loops, vector retrieval, and multi-LLM orchestration, and engineered a CLI full-stack app generator using OpenCode CLI to scaffold frontend, backend, and auth flows from a single prompt.",
        keywords: ["PayPal", "Final Year Project", "TypeScript", "VS Code Extension", "MCP", "FastAPI", "Multi-LLM", "OpenCode CLI", "AI", "Agentic Workflows"]
    },
    {
        name: "PROJECTS",
        content: "CS301 IT Solution Architecture – UBS Group AG (Aug 2024 – Dec 2024) — designed a cloud-native CRM platform on AWS with CloudFormation, ECS microservices, API Gateway, and RDS. Implemented Multi-AZ resilience with Route 53 failover routing and health checks for 99.9% uptime targets, and strengthened durability and recovery with cross-region replication and CloudWatch observability.",
        keywords: ["UBS", "CS301", "AWS", "CloudFormation", "ECS", "API Gateway", "RDS", "Route 53", "Multi-AZ", "CloudWatch", "High Availability", "Cross-region Replication"]
    },
    {
        name: "TECHNICAL SKILLS",
        content: "Programming Languages: Python, Java, SQL, C, C++, Golang, TypeScript, JavaScript, HTML, CSS. Frameworks & Libraries: React.js, Next.js, React Native, Vue.js, Java Spring, Flask, Node.js, TensorFlow. Databases: Firebase, Supabase, MySQL, PostgreSQL, NoSQL. Cloud & DevOps: AWS, SHIP-HATS, GCP, Terraform, GitLab CI/CD, Jira, Confluence. Tools & Middleware: Git, Docker, Kubernetes, Kafka, Redis, RabbitMQ, Figma, REST API, Telegram API, VS Code API.",
        keywords: ["Python", "Java", "SQL", "C++", "Golang", "TypeScript", "JavaScript", "React", "Next.js", "Vue.js", "Spring", "Flask", "Node.js", "TensorFlow", "MySQL", "PostgreSQL", "AWS", "GCP", "Terraform", "Docker", "Kubernetes", "Kafka", "Redis", "RabbitMQ"]
    },
    {
        name: "CERTIFICATIONS",
        content: "AWS Certified Solutions Architect – Associate (SAA-C03) (Nov 2024), Google Data Analytics Professional Certificate (Jul 2024), and Google IT Automation Professional Certificate (Aug 2023).",
        keywords: ["AWS Certified Solutions Architect", "SAA-C03", "Google Data Analytics", "Google IT Automation", "Certifications"]
    },
    {
        name: "LEADERSHIP & ACTIVITIES",
        content: "Team Member, Singapore Men's National Hockey Team; Vice-Captain, SMU Men's Floorball Team; Co-Leader, Project Floorish Community Service Program; Team Member, HashTech Google Hackathon 2023 – 1st Place; Team Member, Raffles Hockey Team; Captain, Victoria School Cross Country Team; Vice-Captain, Victoria School Hockey Team.",
        keywords: ["Singapore Men's National Hockey Team", "SMU Men's Floorball Team", "Project Floorish", "HashTech", "Hackathon", "Raffles Hockey", "Victoria School", "Leadership", "Sports"]
    },
    {
        name: "CONTACT",
        content: "Mobile: +65 90879293 | Email: kevin.saji.k@gmail.com | LinkedIn, Website, and GitHub available on request or through the portfolio.",
        keywords: ["Phone", "Email", "LinkedIn", "Website", "GitHub", "Contact"]
    }
];

export const getResumeContext = (query: string): string => {
    const relevantSections = resumeData.filter(section => 
        section.keywords.some(keyword => 
            query.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(query.toLowerCase())
        )
    );

    if (relevantSections.length === 0) {
        return "No specific resume information found for this query.";
    }

    let context = "**Relevant Resume Information:**\n\n";
    
    relevantSections.forEach(section => {
        context += `**${section.name}:**\n${section.content}\n\n`;
    });

    return context;
};

export const getAllResumeContext = (): string => {
    let context = "📋 **Full Resume Information:**\n\n";
    
    resumeData.forEach(section => {
        context += `🎯 **${section.name}:**\n${section.content}\n\n`;
    });

    return context;
};
