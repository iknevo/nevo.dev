import { GENERAL_INFO } from "@/src/lib/data";

export default async function Footer() {
  return (
    <footer className="text-center pb-5" id="contact">
      <div className="container mx-auto">
        <p className="text-lg">You know how to find me</p>
        <a
          href={`mailto:${GENERAL_INFO.email}`}
          className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-10 hover:underline"
        >
          {GENERAL_INFO.email}
        </a>

        <div className="">
          <a
            href="https://github.com/iknevo"
            target="_blank"
            className="leading-none text-white/80 hover:underline hover:text-white"
          >
            built by NEVO {"<3"}
          </a>
        </div>
      </div>
    </footer>
  );
}
