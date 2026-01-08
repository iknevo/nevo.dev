import { GENERAL_INFO } from "@/src/lib/data";

export default async function Footer() {
  return (
    <footer className="pb-5 text-center" id="contact">
      <div className="container mx-auto">
        <p className="text-lg">You know how to find me</p>
        <a
          href={`mailto:${GENERAL_INFO.email}`}
          className="font-anton mt-5 mb-10 inline-block text-3xl hover:underline sm:text-4xl"
        >
          {GENERAL_INFO.email}
        </a>

        <div className="">
          <a
            href="https://github.com/iknevo"
            target="_blank"
            rel="noreferrer noopenner"
            className="leading-none text-white/80 hover:text-white hover:underline"
          >
            built by NEVO {"<3"}
          </a>
        </div>
      </div>
    </footer>
  );
}
