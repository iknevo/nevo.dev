import { GENERAL_INFO } from "@/app/_lib/data";

const Footer = async () => {
  return (
    <footer className="text-center pb-5" id="contact">
      <div className="container mx-auto">
        <p className="text-lg">Have a project in mind?</p>
        <a
          href={`mailto:${GENERAL_INFO.email}`}
          className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-10 hover:underline"
        >
          {GENERAL_INFO.email}
        </a>

        <div className="">
          <a
            href="https://github.com/Tajmirul/portfolio-2.0"
            target="_blank"
            className="leading-none text-white/80 hover:underline hover:text-white"
          >
            built by NEVO {"<3"}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
