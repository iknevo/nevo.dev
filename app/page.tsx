import AboutMe from "@/app/_components/AboutMe";
import Banner from "@/app/_components/Banner";
import Experiences from "@/app/_components/Experiences";
import ProjectList from "@/app/_components/ProjectList";
import Skills from "@/app/_components/Skills";

export default function Home() {
  return (
    <div className="container">
      <Banner />
      <AboutMe />
      <Skills />
      <Experiences />
      <ProjectList />
    </div>
  );
}
