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
    // {
    //   name: "GSAP",
    //   icon: "/logo/gsap.png",
    // },
    // {
    //   name: "Frammer Motion",
    //   icon: "/logo/framer-motion.png",
    // },
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
    title: "Egy-Railway",
    slug: "egyrailway",
    liveUrl: "https://egy-railway.vercel.app",
    year: 2025,
    description: `
       my graduation project , A web application designed to provide a seamless user experience for railway services. It allows users to search for train schedules, book tickets, and manage their travel plans efficiently. The application is built with a focus on performance, scalability, and user-friendly design. <br/> <br/>

      Key Features:<br/>
      <ul>
        <li>Easy and Fast train search using origin and arrival stations</li>
        <li>Booking a ticket</li>
        <li>Download a PDF format ticket</li>
        <li>Easy login and signup with email & password , Google and Facebook</li>
        <li>Responsive design supporting various devices</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Simplifies server-state management with powerful caching, background syncing, and automatic re-fetching using TanstackQuery.</li>
        <li>A full Postgres backend with real-time data, auth, and storage through a simple JavaScript client using supabase.</li>
        <li>Utility-first CSS framework enabling rapid, responsive UI development with consistent design tokens using TailwindCSS.</li>
        <li>Streamlines form state management in React with easy handling of inputs, validation, and submission using Formik.</li>
        <li>Schema-based validation library that integrates seamlessly with Formik for robust and reusable form validations using Yup.</li>
      </ul>
      `,
    role: `
      <p>As a Front-End Developer, I was responsible for building responsive user interfaces with Tailwind CSS, managing server-state efficiently using React Query, and integrating Supabase for authentication and real-time data handling. I implemented dynamic forms with Formik and enforced robust validations using Yup to ensure a smooth user experience and data integrity.</p>
      `,
    techStack: [
      "React",
      "React Query",
      "Supabase",
      "JavaScript",
      "TailwindCSS",
      "motion",
      "Formik + Yup",
      "MUI",
    ],
    thumbnail: "/projects/thumbnail/egyrailway.png",
    longThumbnail: "/projects/long/egyrailway.png",
    images: [
      "/projects/thumbnail/egyrailway.png",
      "/projects/images/egyrailway12.png",
      "/projects/images/egyrailway2.png",
      "/projects/images/egyrailway3.png",
      "/projects/images/egyrailway4.png",
      "/projects/images/egyrailway5.png",
      "/projects/images/egyrailway6.png",
      "/projects/images/egyrailway7.png",
      "/projects/images/egyrailway8.png",
      "/projects/images/egyrailway9.png",
      "/projects/images/egyrailway10.png",
      "/projects/images/egyrailway11.png",
    ],
  },
  {
    title: "Green Shop",
    slug: "greenshop",
    liveUrl: "https://green-shop-nevo.vercel.app",
    year: 2025,
    description: `
      A complete agency portfolio platform built for MTI Electronics to showcase their services, blog content, and product offerings. <br/> <br/>

      Key Features:<br/>
      <ul>
        <li>🛠️ Service Display System: Interactive service showcase with synchronized sliders</li>
        <li>✍️ Blog Management: SEO-friendly blog with categorization and search</li>
        <li>🛒 Product Catalog: Organized product display with filtering capabilities</li>
        <li>📱 Fully Responsive: Optimized for all device sizes</li>
        <li>⚡ Fast Performance: Optimized Next.js frontend with ISR (Incremental Static Regeneration)</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Implemented complex slider synchronization logic using Swiper.js</li>
        <li>Customized Payload CMS admin panel for intuitive content management</li>
        <li>Developed reusable UI components with shadcn for design consistency</li>
        <li>Configured efficient data fetching strategies in Next.js</li>
      </ul>
      `,
    role: `
      Full-Stack Developer <br/>
      Owned the entire development lifecycle:
      <ul>
        <li>✅ Backend: Configured Payload CMS with custom collections for services, blogs, and products</li>
        <li>🎨 Frontend: Built all UI components using Tailwind CSS and shadcn</li>
        <li>🔄 State Management: Implemented client-side data fetching and caching</li>
        <li>🖥️ CMS Customization: Created admin interfaces for content editors</li>
        <li>🚀 Deployment: Set up CI/CD pipeline for Vercel hosting</li>
        <li>🧩 Third-Party Integration: Added Swiper.js for interactive sliders</li>
      </ul>
      `,
    techStack: [
      "React",
      "React Query",
      "Supabase",
      "JavaScript",
      "TailwindCSS",
      "react-hook-form",
      "MUI",
    ],
    thumbnail: "/projects/thumbnail/greenshop.png",
    longThumbnail: "/projects/long/greenshop.png",
    images: [
      "/projects/thumbnail/greenshop.png",
      "/projects/images/greenshop2.png",
      "/projects/images/greenshop3.png",
      "/projects/images/greenshop4.png",
      "/projects/images/greenshop5.png",
      "/projects/images/greenshop6.png",
    ],
  },
];

export const MY_EXPERIENCE = [
  {
    title: "Frontend Developer",
    company: "All-Safe",
    duration: "04/2025 - present",
  },
];
