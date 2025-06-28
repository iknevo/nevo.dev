import AboutMe from "./_components/AboutMe";
import Banner from "./_components/Banner";
import Experiences from "./_components/Experiences";
import ProjectList from "./_components/ProjectList";
import Skills from "./_components/Skills";

export default function Home() {
  return (
    <div>
      <Banner />
      <AboutMe />
      <Skills />
      <Experiences />
      <ProjectList />
    </div>
  );
}
