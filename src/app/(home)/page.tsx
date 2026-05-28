import { Metadata } from "next";

import AboutMe from "@/src/components/about-me";
import Banner from "@/src/components/banner";
import Experiences from "@/src/components/experiences";
import ProjectList from "@/src/components/project-list";
import Stack from "@/src/components/stack";

export const metadata: Metadata = {
  title: "Front-End Developer",
};

export default function Home() {
  return (
    <div className="container px-8 md:px-0">
      <Banner />
      <AboutMe />
      <Stack />
      <Experiences />
      <ProjectList />
    </div>
  );
}
