import Button from "@/app/_components/Button";
import { Flag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <Flag className="w-20 h-20 mx-auto" />
        <h1 className="mt-10 !text-3xl !leading-snug text-white md:!text-4xl">
          Error 404 <br /> It looks like something went wrong.
        </h1>
        <Button
          as="link"
          rel="noopener noreferrer"
          href="/"
          variant="primary"
          className="mt-9 banner-button slide-up-and-fade rounded-md"
        >
          Back Home
        </Button>
      </div>
    </div>
  );
}
