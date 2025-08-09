export interface ResumeSection {
    name: string;
    content: string;
    keywords: string[];
}

export const resumeData: ResumeSection[] = [
    {
    name: "EDUCATION",
    content: "Singapore Management University (SMU) — Bachelor of Science (Computer Science), 2022–2026. Raffles Institution — Singapore-Cambridge GCE 'A' Level Certificate, 2018–2019.",
    keywords: ["SMU", "Computer Science", "Bachelor", "Raffles Institution", "Education", "University"]
    },
    {
    name: "EXPERIENCE",
    content: "Application Developer Intern at Accenture, Singapore (2025–Present) — Designed, developed, and optimized Spring Batch jobs for the Citizen Disbursement IT (CDIT) project. Configured batch workflows on AWS and supported deployments across DEV, SIT, UAT, and Production. Resolved production defects and collaborated with cross-functional teams. Researched dependency management and conducted impact analyses for framework upgrades.",
    keywords: ["Accenture", "Application Developer Intern", "Spring Batch", "AWS", "Batch Processing", "CDIT", "DevOps", "Production Support"]
    },
    {
    name: "EXPERIENCE",
    content: "Web Developer at Truly Community, Singapore (2024) — Built a Telegram Mini App for anonymous direct messaging using Python, Vue.js, and Supabase for SMU Confess, enabling anonymous interactions among 2000+ students.",
    keywords: ["Truly Community", "Web Developer", "Telegram Mini App", "Python", "Vue.js", "Supabase", "SMU Confess"]
    },
    {
    name: "EXPERIENCE",
    content: "Teaching Assistant (IS112 Data Management) at Singapore Management University, Singapore (2024) — Covered data management, database modeling, logical design, and advanced SQL. Mentored 45 students, managed class administration and software setup, and provided academic guidance.",
    keywords: ["Teaching Assistant", "SMU", "IS112", "Data Management", "Database Modeling", "SQL", "Mentoring"]
    },
    {
    name: "PROJECTS",
    content: "IT Solution Architecture (CS301) — CRM System (2024): Designed a resilient multi-region CRM with disaster recovery and high availability using AWS ECS, RDS, and CloudFront with cross-region failover. Implemented ElastiCache, SQS, and ECS autoscaling for performance. Built RBAC with OAuth 2.0 and AWS Cognito. Developed React.js admin and agent UIs.",
    keywords: ["AWS", "ECS", "RDS", "CloudFront", "ElastiCache", "SQS", "OAuth 2.0", "Cognito", "React.js", "High Availability", "Disaster Recovery"]
    },
    {
    name: "PROJECTS",
    content: "IT Solution Lifecycle Management (CS302) — Animeet (2024): Built a microservices web app for group formation, events, and collaborative payments. Used GraphQL as API gateway and composite services. Implemented CI/CD for static analysis, integration testing, release, and deployment to a Minikube Kubernetes cluster. Integrated RabbitMQ (AMQP) for async email notifications and Stripe for payments.",
    keywords: ["Microservices", "GraphQL", "CI/CD", "Kubernetes", "Minikube", "RabbitMQ", "AMQP", "Stripe", "Payments"]
    },
    {
    name: "PROJECTS",
    content: "SMU Confess Platform — Telegram Mini App enabling anonymous messaging for 2000+ students using Python, Vue.js, and Supabase.",
    keywords: ["SMU Confess", "Telegram Mini App", "Python", "Vue.js", "Supabase"]
    },
    {
    name: "TECHNICAL SKILLS",
    content: "Languages: C, Java, Python, SQL, Golang. Frameworks & Libraries: React.js, React Native, Vue.js, Java Spring Boot, Spring Batch, Flask, TensorFlow, NumPy, Pandas. Databases & Cloud: Firebase, Supabase, MySQL, AWS. Tools: Git, Docker, Kubernetes, RabbitMQ, Figma, Tableau, REST API, Telegram API, Microsoft Office Suite.",
    keywords: ["C", "Java", "Python", "SQL", "Golang", "React", "React Native", "Vue.js", "Spring Boot", "Spring Batch", "Flask", "TensorFlow", "NumPy", "Pandas", "Firebase", "Supabase", "MySQL", "AWS", "Git", "Docker", "Kubernetes", "RabbitMQ", "Figma", "Tableau", "REST API", "Telegram API", "Microsoft Office"]
    },
    {
    name: "LEADERSHIP",
    content: "Vice-Captain, SMU Floorball Men's Team. Co-Leader, Project Floorish 2 Community Service Programme. Marketing Director, ExploreSCIS 2023.",
    keywords: ["Leadership", "SMU Floorball", "Project Floorish", "ExploreSCIS", "Student Leadership"]
    },
    {
    name: "ACHIEVEMENTS",
    content: "HashTech Hackathon 2023 — 1st Place. Singapore Hockey — VIE vs SGP 2025 Test Series. 2018 & 2019 National School Games 'A' Division (Hockey) — 1st Place. 2017 Asian Schools U-18 Hockey Championships — 3rd Place.",
    keywords: ["Hackathon", "Awards", "Singapore Hockey", "National School Games", "Asian Schools"]
    },
    {
    name: "CERTIFICATIONS",
    content: "AWS Certified Solutions Architect – Associate (SAA-C03). Google Data Analytics Professional Certificate. Google IT Automation with Python Professional Certificate.",
    keywords: ["AWS Certified Solutions Architect", "SAA-C03", "Google Data Analytics", "Google IT Automation with Python", "Certifications"]
    },
    {
    name: "LANGUAGES",
    content: "English (Fluent), Malayalam (Native), Mandarin (Basic)",
    keywords: ["English", "Malayalam", "Mandarin", "Languages"]
    },
    {
    name: "INTERESTS",
    content: "Software Development, Web Technologies, Cloud Computing, Database Design, Teaching and Mentoring, Floorball, Hockey",
    keywords: ["Software Development", "Web Technologies", "Cloud Computing", "Database Design", "Teaching", "Mentoring", "Floorball", "Hockey"]
    },
    {
    name: "CONTACT",
    content: "Phone: +65 9087 9293 | Email: kevink.saji.2022@scis.smu.edu.sg | LinkedIn: linkedin.com/in/kevin-saji",
    keywords: ["Phone", "Email", "LinkedIn", "Contact"]
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
