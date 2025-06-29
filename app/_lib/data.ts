import { IProject } from "@/app/_types";

export const GENERAL_INFO = {
  email: "iknevo.dev@gmail.com",
  emailSubject: "Let's collaborate on a project",
  emailBody: "Hi NEVO, I am reaching out to you because...",
  cv: "/resume.pdf",
};

export const SOCIAL_LINKS = [
  { name: "github", url: "https://github.com/iknevo" },
  { name: "linkedin", url: "https://www.linkedin.com/in/ahmed-abdelhafiez" },
  { name: "CV", url: GENERAL_INFO.cv },
];

export const MY_STACK = {
  frontend: [
    {
      name: "Javascript",
      icon: "/logo/js.png",
    },
    {
      name: "Typescript",
      icon: "/logo/ts.png",
    },
    {
      name: "React",
      icon: "/logo/react.png",
    },
    {
      name: "Next.js",
      icon: "/logo/next.png",
    },
    {
      name: "Redux",
      icon: "/logo/redux.png",
    },
    {
      name: "Tailwind CSS",
      icon: "/logo/tailwind.png",
    },
    {
      name: "GSAP",
      icon: "/logo/gsap.png",
    },
    {
      name: "Frammer Motion",
      icon: "/logo/framer-motion.png",
    },
    {
      name: "SASS",
      icon: "/logo/sass.png",
    },
  ],
  // backend: [
  //   {
  //     name: "Node.js",
  //     icon: "/logo/node.png",
  //   },
  //   {
  //     name: "Nest.js",
  //     icon: "/logo/nest.svg",
  //   },
  //   {
  //     name: "Express.js",
  //     icon: "/logo/express.png",
  //   },
  // ],
  // database: [
  //   {
  //     name: "MySQL",
  //     icon: "/logo/mysql.svg",
  //   },
  //   {
  //     name: "PostgreSQL",
  //     icon: "/logo/postgreSQL.png",
  //   },
  //   {
  //     name: "MongoDB",
  //     icon: "/logo/mongodb.svg",
  //   },
  //   {
  //     name: "Prisma",
  //     icon: "/logo/prisma.png",
  //   },
  // ],
  tools: [
    {
      name: "Git",
      icon: "/logo/git.png",
    },
    // {
    //   name: "Docker",
    //   icon: "/logo/docker.svg",
    // },
    // {
    //   name: "AWS",
    //   icon: "/logo/aws.png",
    // },
  ],
};

export const PROJECTS: IProject[] = [
  {
    title: "MTI Electronics",
    slug: "mti-electronics",
    liveUrl: "https://mti-electronics.vercel.app/",
    year: 2025,
    techStack: [
      "Next.js",
      "Payload CMS",
      "Tailwind CSS",
      "shadcn",
      "Swiper.js",
      "React Hook Form",
      "Vercel",
    ],
    thumbnail: "/projects/thumbnail/mti-electronics.webp",
    longThumbnail: "/projects/long/mti-electronics.webp",
    images: [
      "/projects/images/mti-electronics-1.webp",
      "/projects/images/mti-electronics-2.webp",
    ],
  },
  {
    title: "Epikcart",
    slug: "epikcart",
    techStack: [
      "React",
      "Redux",
      "React i18n",
      "Tailwind CSS",
      "Framer Motion",
      "debouncing",
      "Api Integration",
    ],
    thumbnail: "/projects/thumbnail/epikcart.jpg",
    longThumbnail: "/projects/long/epikcart.jpg",
    images: [
      "/projects/images/epikcart-1.png",
      "/projects/images/epikcart-2.png",
      "/projects/images/epikcart-3.png",
      "/projects/images/epikcart-4.png",
      "/projects/images/epikcart-5.png",
    ],
    liveUrl: "https://demo.epikcart.siphertech.com/",
    year: 2023,
  },
  {
    title: "Resume Roaster",
    slug: "resume-roaster",
    techStack: ["GPT-4", "Next.js", "Postgressql", "Prisma", "Tailwind CSS"],
    thumbnail: "/projects/thumbnail/resume-roaster.jpg",
    longThumbnail: "/projects/long/resume-roaster.jpg",
    images: [
      "/projects/images/resume-roaster-1.png",
      "/projects/images/resume-roaster-2.png",
      "/projects/images/resume-roaster-3.png",
    ],
    liveUrl: "https://resume-roaster.vercel.app/",
    year: 2023,
  },
  {
    title: "Real Estate",
    slug: "property-pro",
    techStack: [
      "React.js",
      "Redux",
      "Tailwind CSS",
      "React i18n",
      "Framer Motion",
    ],
    thumbnail: "/projects/thumbnail/property-pro.jpg",
    longThumbnail: "/projects/long/property-pro.jpg",
    images: [
      "/projects/images/property-pro-1.png",
      "/projects/images/property-pro-2.png",
      "/projects/images/property-pro-3.png",
    ],
    liveUrl: "https://demo.propertypro.siphertech.com/",
    year: 2023,
  },
  {
    title: "Consulting Finance",
    slug: "crenotive",
    techStack: ["HTML", "CSS & SCSS", "Javascript", "Bootstrap"],
    thumbnail: "/projects/thumbnail/consulting-finance.jpg",
    longThumbnail: "/projects/long/consulting-finance.jpg",
    images: [
      "/projects/images/consulting-finance-1.png",
      "/projects/images/consulting-finance-2.png",
      "/projects/images/consulting-finance-3.png",
    ],
    sourceCode: "https://github.com/Tajmirul/crenotive",
    liveUrl: "https://crenotive.netlify.app/",
    year: 2023,
  },
  {
    title: "devLinks",
    slug: "devLinks",
    techStack: ["Next.js", "Formik", "Drag & Drop", "Tailwind CSS"],
    thumbnail: "/projects/thumbnail/devLinks.jpg",
    longThumbnail: "/projects/long/devLinks.jpg",
    images: [
      "/projects/images/devLinks-1.png",
      "/projects/images/devLinks-2.png",
      "/projects/images/devLinks-3.png",
    ],
    sourceCode: "https://github.com/Tajmirul/devsLink",
    liveUrl: "https://devlinks-demo.vercel.app/auth/signin",
    year: 2023,
  },
];

export const MY_EXPERIENCE = [
  {
    title: "Frontend Developer",
    company: "All-Safe",
    duration: "04/2025 - present",
  },
];
