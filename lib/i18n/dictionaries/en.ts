import type { Dictionary } from "../types";

const en: Dictionary = {
  meta: {
    title: "Yahya Tamda | Full-Stack Web Developer",
    description:
      "Portfolio of Yahya Tamda, a full-stack web developer in Rabat, Morocco — web applications with React, Next.js, Laravel and Node.js, REST APIs, databases, and selected mobile development work.",
  },
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    journey: "Journey",
    cv: "CV",
    contact: "Contact",
    downloadCv: "Download CV",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitcher: "Change language",
    progressLabel: "Journey progress",
    returnToLaunch: "Return to launch",
    skipIntro: "Skip intro",
  },
  hero: {
    availability: "Rabat, Morocco — open to web & product opportunities",
    role: "Junior Full Stack Web Developer",
    intro:
      "I design robust, elegant, product-driven web platforms — with a precise attention to architecture, user experience and code quality.",
    ctaExplore: "Explore my universe",
    ctaProjects: "View my projects",
    ctaCv: "Download my CV",
    scrollHint: "Scroll to travel",
  },
  about: {
    label: "Act 01 — The developer",
    heading: "The developer behind the screen.",
    lead: "From a business need to a shipped interface — I build the whole path.",
    paragraphs: [
      "I'm a junior full stack web developer, graduate of a Bachelor's degree in Computer Engineering, with hands-on experience gained during an internship at ŠKODA and through more than fifteen personal projects.",
      "I work across the entire stack: REST APIs with Node.js, Express or Laravel, frontends with React and Next.js, and relational or document databases like MySQL, PostgreSQL and MongoDB.",
      "My approach is quality-driven: clear architecture (MVC, OOP), maintainable code, and interfaces that help people understand and act quickly.",
    ],
    facts: [
      { label: "Based in", value: "Rabat, Morocco" },
      { label: "Degree", value: "B.Sc. Computer Engineering" },
      { label: "Languages", value: "French · Arabic · English" },
      { label: "Focus", value: "Full stack web products" },
    ],
  },
  projects: {
    label: "Act 02 — The worlds",
    heading: "Every project is a world of its own.",
    intro:
      "A selection among more than fifteen projects across web, mobile and AI — covering EdTech, marketplaces, e-commerce, inventory and computer vision.",
    supportingHeading: "More from the lab",
    supportingIntro:
      "Additional work available on request or on my GitHub profile.",
    viewProject: "Enter this world",
    github: "View on GitHub",
    demo: "Live demo",
    privateLabel: "Private project — available on request",
    nextLabel: "Next world",
    items: {
      edtech: {
        name: "EdTech",
        kicker: "AI Exams · Exam platform",
        summary:
          "Complete school exam management platform with AI-assisted generation, question bank, dashboards and an integrated exam environment.",
        description:
          "A full exam-management platform built for schools: multi-role authentication (administrators, teachers, students), dedicated dashboards per profile, grade, group and exam management, and real-time notifications on a modular, REST-API-oriented architecture.",
        features: [
          "AI-generated exams",
          "Manual exam creation",
          "Question bank",
          "Student management",
        ],
        role: "Full stack developer",
      },
      crafthub: {
        name: "CraftHUB",
        kicker: "Marketplace · Artisans",
        summary:
          "Marketplace connecting artisans and clients with service booking, public profiles, messaging, reviews and full request management.",
        description:
          "A platform that connects artisans with businesses and clients: artisan profiles, service booking by time slot or full day, client–artisan messaging and a REST API for matchmaking — with a responsive interface on both client and provider sides. The development environment is fully containerized with Docker.",
        features: [
          "Artisan & service booking",
          "Hourly or full-day slots",
          "Client–artisan messaging",
          "Public profiles",
        ],
        role: "Full stack developer",
      },
      velora: {
        name: "VELORA",
        kicker: "Luxury commerce · Perfumes",
        summary:
          "Luxury perfume e-commerce platform with a complete purchase journey, customer accounts, catalog, orders and invoice generation.",
        description:
          "An e-commerce experience for luxury perfumes: product catalog with filters, shopping cart, checkout, customer accounts, order management and invoice generation — wrapped in a modern, responsive, conversion-oriented interface.",
        features: [
          "Cart & checkout",
          "Invoice generation",
          "Authentication",
          "Product catalog",
        ],
        role: "Full stack developer",
      },
      autotrack: {
        name: "AutoTrack",
        kicker: "Škoda · Inventory system",
        summary:
          "Inventory management platform built for Škoda, focused on office-equipment traceability, transfers and reporting.",
        description:
          "Developed during my internship at Škoda: a multi-site inventory platform covering article management and stock movements (inflows, outflows, available quantities), transfer signatures, movement history and an administration space — on a structured MVC architecture, with automated PHPUnit tests validating the key features.",
        features: [
          "Equipment stock management",
          "Multi-site transfers",
          "Movement history",
          "Transfer signatures",
        ],
        role: "Web developer — internship, Škoda",
      },
      facedetector: {
        name: "Face Detector",
        kicker: "Computer vision · AI detection",
        summary:
          "Python GUI application detecting human and animal faces on image or webcam, with age, gender and animal-classification estimation.",
        description:
          "An experimental computer-vision desktop app: human and animal face detection from imported images or a live webcam stream, age and gender estimation, and animal classification with a confidence score.",
        features: [
          "Human & animal detection",
          "Age & gender estimation",
          "Animal classification with confidence score",
          "Image import or webcam stream",
        ],
        role: "Developer",
      },
      scholvia: {
        name: "Scholvia",
        kicker: "School website · Showcase",
        summary:
          "WordPress showcase website for a private school, structured to inform families and streamline enrollment requests.",
        description:
          "A WordPress showcase site for a private school: presentation of the school, services and classes, enrollment requests and payment information.",
        features: [
          "School presentation",
          "Services & classes",
          "Enrollment",
          "Payment information",
        ],
      },
      autonova: {
        name: "Auto Nova",
        kicker: "Dealership suite · Automotive",
        summary:
          "Premium car-dealership management platform with vehicle search, detailed sheets, appointments and reservation requests.",
        description:
          "A premium dealership-management platform: catalog of available vehicles, advanced search, detailed vehicle pages, appointments and reservation requests.",
        features: [
          "Available-vehicle catalog",
          "Advanced search",
          "Detailed vehicle pages",
          "Dealership contact",
        ],
      },
    },
  },
  skills: {
    label: "Act 03 — The constellation",
    heading: "A technical landscape, mapped by purpose.",
    intro:
      "Every technology I use, grouped the way I actually work — from languages to deployment tools.",
    groups: {
      languages: {
        title: "Languages",
        blurb: "The grammar of everything I build.",
      },
      frontend: {
        title: "Frontend",
        blurb: "Interfaces that are fast, readable and responsive.",
      },
      backend: {
        title: "Backend",
        blurb: "APIs and services designed to stay maintainable.",
      },
      data: {
        title: "Databases",
        blurb: "Relational and document stores, modeled to fit the product.",
      },
      architecture: {
        title: "API & Architecture",
        blurb: "The patterns that keep systems clean as they grow.",
      },
      tools: {
        title: "DevOps & Tools",
        blurb: "The everyday toolchain behind shipping.",
      },
    },
  },
  journey: {
    label: "Act 04 — The path",
    heading: "The journey so far.",
    intro:
      "Education and experience milestones — a progression built around software quality.",
    education: "Education",
    experience: "Experience",
    items: {
      licence: {
        title: "Bachelor's degree in Computer Engineering",
        org: "HIGH TECH, Rabat",
        period: "2025 — 2026",
        summary:
          "Undergraduate degree focused on software engineering, architecture and modern development practices.",
      },
      skoda: {
        title: "Web Developer — Stock Management Project",
        org: "ŠKODA, Rabat — internship",
        period: "Mar 2025 — Apr 2025",
        summary:
          "Designed and built a stock-management and tracking solution with Laravel and MySQL: article management, stock movements, an administration space and an optimized MVC database — inside an Agile team with sprints and follow-up meetings.",
      },
      dts: {
        title: "DTS in Digital Development, Full Stack option",
        org: "ISTAG Yaacoub El Mansour, Rabat",
        period: "2023 — 2025",
        summary:
          "Specialized technician diploma covering the full web development cycle, from databases to deployed applications.",
      },
      bac: {
        title: "Baccalauréat, Physical Sciences",
        org: "Lycée Abi Dar Elghifari, Rabat",
        period: "2023",
        summary:
          "Scientific baccalaureate — the starting point of the journey into engineering.",
      },
    },
  },
  cv: {
    label: "Act 05 — The portal",
    heading: "Take the full story with you.",
    text: "The complete resume — education, experience, projects and skills — in a single document, ready to open or download.",
    download: "Download the CV",
    open: "Open in a new tab",
  },
  contact: {
    label: "Act 06 — The destination",
    heading: "Let's build something worth exploring.",
    intro:
      "Available for serious, elegant web products ready to grow. Every important channel is one click away.",
    availability: "Open to opportunities, collaborations and ambitious projects.",
    emailLabel: "Email",
    phoneLabel: "Phone / WhatsApp",
    locationLabel: "Location",
    formTitle: "Send a message",
    formName: "Your name",
    formEmail: "Your email",
    formMessage: "Your message",
    formSend: "Open in your email app",
    formHint:
      "This form opens your email client with the message pre-filled — nothing is stored on this site.",
    closing: "Thanks for traveling this far.",
  },
  footer: {
    tagline: "Designed & built as a journey — not a page.",
    rights: "All rights reserved.",
  },
  chat: {
    sectionLabel: "Epilogue — The signal",
    heading: "Ask the universe anything.",
    intro:
      "An AI version of me — ask it anything about my projects, my stack, my background, or how to reach me.",
    title: "Chat with me",
    greeting:
      "Hey, I'm Yahya — well, the AI version of me. Ask me anything about my projects, my stack, or how to reach me.",
    placeholder: "Ask about a project, a skill, contact…",
    send: "Send message",
    open: "Open chat",
    close: "Close chat",
    errorMsg: "The signal was lost — try again.",
  },
  projectPage: {
    overview: "Overview",
    stack: "Technology stack",
    features: "Highlights",
    links: "Links",
    github: "Repository on GitHub",
    privateNote:
      "This project's source code is private. Details and a walkthrough are available on request.",
    back: "Back to the journey",
    otherProjects: "Other worlds",
  },
  a11y: {
    skipToContent: "Skip to content",
    sceneAlt: "Decorative 3D journey scene",
  },
  notFound: {
    title: "Lost in the void",
    text: "This coordinate doesn't exist in this universe.",
    cta: "Back to the beginning",
  },
};

export default en;
