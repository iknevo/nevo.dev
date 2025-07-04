import { IProject } from "@/app/_types";

export const GENERAL_INFO = {
  email: "iknevo.dev@gmail.com",
  resume: "/resume.pdf",
};

export const SOCIAL_LINKS = [
  { name: "github", url: "https://github.com/iknevo" },
  { name: "linkedin", url: "https://www.linkedin.com/in/ahmed-abdelhafiez" },
  { name: "RESUME", url: GENERAL_INFO.resume },
];

export const MY_STACK = {
  frontend: [
    {
      name: "HTML",
      icon: "/logo/html.png",
    },
    {
      name: "CSS",
      icon: "/logo/css.png",
    },
    {
      name: "JavaScript",
      icon: "/logo/js.png",
    },
    {
      name: "TypeScript",
      icon: "/logo/ts.png",
    },
    {
      name: "React",
      icon: "/logo/react.png",
    },
    {
      name: "Redux",
      icon: "/logo/redux.png",
    },
    {
      name: "Zustand",
      icon: "/logo/zustand.png",
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
  backend: [
    {
      name: "Supabase",
      icon: "/logo/supabase.png",
    },
    // {
    //   name: "Node.js",
    //   icon: "/logo/node.png",
    // },
    // {
    //   name: "Nest.js",
    //   icon: "/logo/nest.svg",
    // },
    // {
    //   name: "Express.js",
    //   icon: "/logo/express.png",
    // },
  ],
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
    {
      name: "GitHub",
      icon: "/logo/github.png",
    },
    {
      name: "Postman",
      icon: "/logo/postman.png",
    },
    {
      name: "VSCODE",
      icon: "/logo/vscode.png",
    },
    {
      name: "VIM",
      icon: "/logo/vim.png",
    },
    {
      name: "NPM",
      icon: "/logo/npm.png",
    },
    {
      name: "PNPM",
      icon: "/logo/pnpm.png",
    },
    {
      name: "Yarn",
      icon: "/logo/yarn.png",
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

  studying: [
    {
      name: "Next.js",
      icon: "/logo/next.png",
    },
    {
      name: "GSAP",
      icon: "/logo/gsap.png",
    },
    {
      name: "Frammer Motion",
      icon: "/logo/framer-motion.png",
    },
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
        <li>An AI chatbot to answer questions about trains schedules</li>
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
      <p>As a Front-End Developer, I was responsible for building responsive user interface with Tailwind CSS, managing server-state efficiently using React Query, and integrating Supabase for authentication and real-time data handling. I implemented dynamic forms with Formik and enforced robust validations using Yup to ensure a smooth user experience and data integrity.</p>
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
    thumbnail: "/projects/egyrailway/thumbnail/egyrailway.png",
    sourceCode: "https://github.com/iknevo/egy-railway",
    images: [
      "/projects/egyrailway/thumbnail/egyrailway.png",
      "/projects/egyrailway/images/11.png",
      "/projects/egyrailway/images/1.png",
      "/projects/egyrailway/images/2.png",
      "/projects/egyrailway/images/3.png",
      "/projects/egyrailway/images/4.png",
      "/projects/egyrailway/images/5.png",
      "/projects/egyrailway/images/6.png",
      "/projects/egyrailway/images/7.png",
      "/projects/egyrailway/images/8.png",
      "/projects/egyrailway/images/9.png",
      "/projects/egyrailway/images/10.png",
    ],
  },
  {
    title: "Green Shop",
    slug: "greenshop",
    liveUrl: "https://green-shop-nevo.vercel.app",
    sourceCode: "https://github.com/iknevo/green-shop",
    year: 2025,
    description: `
      My first react application. An e-shop plants web app<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>A clean modern design.</li>
        <li>Products filteration By Discount, Category, Size and Price range.</li>
        <li>Products Pagination to make browsing products more easier.</li>
        <li>Cart with the ability to apply a discount code (try "disc50" or "free") codes</li>
        <li>Authentication with Google or Facebook, and normal email & password</li>
        <li>User's profile</li>
      </ul><br/>
      <p>Didn't have the time to finish it unfortunately, But i did enjoy and learn a lot during the development of this app.</p>
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
    thumbnail: "/projects/greenshop/thumbnail/greenshop.png",
    images: [
      "/projects/greenshop/thumbnail/greenshop.png",
      "/projects/greenshop/images/1.png",
      "/projects/greenshop/images/2.png",
      "/projects/greenshop/images/3.png",
      "/projects/greenshop/images/4.png",
    ],
  },
  {
    title: "Foodie",
    slug: "foodie",
    liveUrl: "https://nevo-foodie.vercel.app/",
    sourceCode: "https://github.com/iknevo/foodie",
    year: 2024,
    description: `
      A food recipies web application<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>simple & easy to use design.</li>
        <li>Search & Select recipies.</li>
        <li>The ability to bookmark a recipe and change servings.</li>
        <li>Directions on how to cook the selected recipe.</li>
        <li>Responsive Design.</li>
        <li>Upload your custom recipies.</li>
      </ul><br/>
      `,
    techStack: ["JavaScript", "OOP", "RESTFull api", "SCSS", "Parcel"],
    thumbnail: "/projects/foodie/thumbnail/foodie.png",
    images: [
      "/projects/foodie/thumbnail/foodie.png",
      "/projects/foodie/images/1.png",
      "/projects/foodie/images/2.png",
      "/projects/foodie/images/3.png",
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
