import AboutMe from "@/src/components/about-me";
import Banner from "@/src/components/banner";
import Experiences from "@/src/components/experiences";
import ProjectList from "@/src/components/project-list";
import Skills from "@/src/components/skills";

export default function Home() {
  return (
    <div className="container px-8 md:px-0">
      <Banner />
      <AboutMe />
      <Skills />
      <Experiences />
      <ProjectList />
    </div>
  );
}
