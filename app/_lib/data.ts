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
    {
      name: "Styled-Components",
      icon: "/logo/styled-components.png",
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
    title: "Meowney",
    slug: "meowney",
    liveUrl: "https://meowney.vercel.app",
    sourceCode: "https://github.com/iknevo/meowney.git",
    year: 2025,
    description: `
      Finance tracking app<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>A clean modern fully responsive design.</li>
        <li>Dynamic dashboard displaying finance summary with charts and the ability to select the prefered chart type.</li>
        <li>Filter dashboard summary with date range and account.</li>
        <li>All tables have column sort functionality, search, pagination, and selecting multiple rows.</li>
        <li>Transactions table displaying the transactions and the ability add, edit, delete transactions.</li>
        <li>chunk add transactions via CSV files.</li>
        <li>chunk delete transactions.</li>
        <li>Accounts table displaying the current accounts and the ability add, edit, delete accounts.</li>
        <li>chunk delete accounts.</li>
        <li>Categories table displaying the current categories and the ability add, edit, delete categories.</li>
        <li>chunk delete categories.</li>
        <li>User's profile with the ability to edit user's information</li>
      </ul><br/>`,
    techStack: [
      "Next",
      "TypeScript",
      "Neon Postgres",
      "Drizzle ORM",
      "Hono",
      "Shadcn",
      "TailwindCSS",
      "recharts",
      "zustand",
    ],
    thumbnail: "/projects/meowney/thumbnail/meowney.png",
    images: [
      "/projects/meowney/images/1.png",
      "/projects/meowney/thumbnail/meowney.png",
      "/projects/meowney/images/3.png",
      "/projects/meowney/images/2.png",
      "/projects/meowney/images/4.png",
      "/projects/meowney/images/5.png",
      "/projects/meowney/images/6.png",
      "/projects/meowney/images/7.png",
      "/projects/meowney/images/8.png",
      "/projects/meowney/images/9.png",
      "/projects/meowney/images/10.png",
      "/projects/meowney/images/11.png",
      "/projects/meowney/images/12.png",
      "/projects/meowney/images/13.png",
    ],
  },
  {
    title: "The Wild Oasis - Website",
    slug: "the-wild-oasis-website",
    liveUrl: "https://nevo-the-wild-oasis-website.vercel.app",
    sourceCode: "https://github.com/iknevo/the-wild-oasis-website.git",
    year: 2025,
    description: `
      A hotel reservations website<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>A clean modern design.</li>
        <li>View available cabins with the ability to reserve any cabins in it's available dates.</li>
        <li>Filtering cabins by the number of guests.</li>
        <li>Admins's profile and the ability to add other admins to the system.</li>
        <li>View reserved cabins with the ability to edit or cancel the reservation.</li>
        <li>User's profile with the ability to edit user's information</li>
      </ul><br/>`,
    techStack: ["Next", "Supabase", "TypeScript", "TailwindCSS"],
    thumbnail:
      "/projects/the-wild-oasis-website/thumbnail/the-wild-oasis-website.png",
    images: [
      "/projects/the-wild-oasis-website/thumbnail/the-wild-oasis-website.png",
      "/projects/the-wild-oasis-website/images/1.png",
      "/projects/the-wild-oasis-website/images/3.png",
      "/projects/the-wild-oasis-website/images/2.png",
      "/projects/the-wild-oasis-website/images/4.png",
      "/projects/the-wild-oasis-website/images/5.png",
      "/projects/the-wild-oasis-website/images/6.png",
      "/projects/the-wild-oasis-website/images/7.png",
      "/projects/the-wild-oasis-website/images/8.png",
      "/projects/the-wild-oasis-website/images/9.png",
    ],
  },
  {
    title: "The Wild Oasis - Dashboard",
    slug: "the-wild-oasis-dashboard",
    liveUrl: "https://the-wild-oasis-nevo.vercel.app",
    sourceCode: "https://github.com/iknevo/the-wild-oasis.git",
    year: 2025,
    description: `
      An admin dashboard to manage the wild oasis hotel reservations website<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>A clean modern design.</li>
        <li>Dark/Light mode variants.</li>
        <li>View bookings with the ability to edit, delete, confirm it.</li>
        <li>Filtering bookings by status and date, pagination.</li>
        <li>Admins's profile and the ability to add other admins to the system.</li>
        <li>View existing cabins with the ability to create, edit, delete them. and filtering by discount availability, sorting by name/price/capacity</li>
        <li>Manage hotel settings (eg. minimum/maximum nights/guests per booking, breakfast price)</li>
      </ul><br/>`,
    techStack: [
      "React",
      "React Query",
      "Supabase",
      "JavaScript",
      "TailwindCSS",
      "react-hook-form",
      "recharts",
      "styled-components",
    ],
    thumbnail:
      "/projects/the-wild-oasis-dashboard/thumbnail/the-wild-oasis-dashboard.png",
    images: [
      "/projects/the-wild-oasis-dashboard/images/1.png",
      "/projects/the-wild-oasis-dashboard/images/3.png",
      "/projects/the-wild-oasis-dashboard/images/2.png",
      "/projects/the-wild-oasis-dashboard/images/4.png",
      "/projects/the-wild-oasis-dashboard/images/5.png",
      "/projects/the-wild-oasis-dashboard/images/6.png",
      "/projects/the-wild-oasis-dashboard/images/7.png",
    ],
  },
  {
    title: "Egy-Railway",
    slug: "egy-railway",
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
    thumbnail: "/projects/egy-railway/thumbnail/egyrailway.png",
    sourceCode: "https://github.com/iknevo/egyrailway",
    images: [
      "/projects/egy-railway/thumbnail/egyrailway.png",
      "/projects/egy-railway/images/11.png",
      "/projects/egy-railway/images/1.png",
      "/projects/egy-railway/images/2.png",
      "/projects/egy-railway/images/3.png",
      "/projects/egy-railway/images/4.png",
      "/projects/egy-railway/images/5.png",
      "/projects/egy-railway/images/6.png",
      "/projects/egy-railway/images/7.png",
      "/projects/egy-railway/images/8.png",
      "/projects/egy-railway/images/9.png",
      "/projects/egy-railway/images/10.png",
    ],
  },
  {
    title: "World Wise",
    slug: "world-wise",
    liveUrl: "https://nevo-worldwise.vercel.app",
    sourceCode: "https://github.com/iknevo/world-wise",
    year: 2024,
    description: `
      A world map that tracks your footsteps into every city you can think of. Never forget your wonderful experiences, and show your friends how you have wandered the world.<br/> <br/>

      Key Features:<br/>
      <ul>
        <li>Simple & easy to use design.</li>
        <li>An interactive map which the user can select a location or use his current location.</li>
        <li>Lists displaying the individual trips that the user has made, and the countries the user has visited</li>
        <li>When clicking the map a form will appear in which the user can input city name, trip's date, and any notes the user might want to add.</li>
        <li>When adding a trip, a popup will appear on the map</li>
        <li>The ability to delete any trip from the list.</li>
        <li>Simple Login/Logout (not fully functional tho) its just a placeholder.</li>
      </ul><br/>
      `,
    techStack: ["React", "SCSS", "TailwindCSS", "RESTFull api"],
    thumbnail: "/projects/world-wise/thumbnail/world-wise.png",
    images: [
      "/projects/world-wise/thumbnail/world-wise.png",
      "/projects/world-wise/images/1.png",
      "/projects/world-wise/images/2.png",
      "/projects/world-wise/images/3.png",
      "/projects/world-wise/images/4.png",
    ],
  },
  {
    title: "Green Shop",
    slug: "green-shop",
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
    thumbnail: "/projects/green-shop/thumbnail/greenshop.png",
    images: [
      "/projects/green-shop/thumbnail/greenshop.png",
      "/projects/green-shop/images/1.png",
      "/projects/green-shop/images/2.png",
      "/projects/green-shop/images/3.png",
      "/projects/green-shop/images/4.png",
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
        <li>Simple & easy to use design.</li>
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
    title: "Frontend Developer - Internship",
    company: "All-Safe",
    duration: "04/2025 - 07/2025",
  },
];
