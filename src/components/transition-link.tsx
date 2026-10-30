"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Link> {
  back?: boolean;
}

gsap.registerPlugin(useGSAP);

function resetScrollPosition() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function TransitionLink({ href, onClick, children, back = false, ...rest }: Props) {
  const router = useRouter();

  const { contextSafe } = useGSAP(() => {});

  const handleLinkClick = contextSafe(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);

    gsap.set(".page-transition", { yPercent: 100 });
    gsap.set(".page-transition--inner", { yPercent: 100 });

    const tl = gsap.timeline();

    tl.to(".page-transition", {
      yPercent: 0,
      duration: 0.3,
    });

    tl.then(() => {
      if (back) {
        router.back();
      } else if (href) {
        // Reset before pushing so Next/Lenis cannot carry the previous page's
        // scroll position into a same-layout route transition.
        resetScrollPosition();
        router.push(href.toString());
      }
    });
  });

  return (
    <Link href={href} {...rest} onClick={handleLinkClick}>
      {children}
    </Link>
  );
}
