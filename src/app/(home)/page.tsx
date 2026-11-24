import { Metadata } from "next";

import AboutMe from "@/src/components/about-me";
import Banner from "@/src/components/banner";
import Experiences from "@/src/components/experiences";
import ProjectList from "@/src/components/project-list";
import Stack from "@/src/components/stack";
import { getProfile } from "@/src/lib/server-api";

export const metadata: Metadata = {
  title: "Front-End Developer",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const profile = await getProfile();

  return (
    <div className="container px-8 md:px-0">
      <Banner profile={profile} />
      <AboutMe />
      <Stack />
      <Experiences />
      <ProjectList />
    </div>
  );
}
