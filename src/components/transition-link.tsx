"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Link> {
  back?: boolean;
}

gsap.registerPlugin(useGSAP);

export default function TransitionLink({
  href,
  onClick,
  children,
  back = false,
  ...rest
}: Props) {
  const router = useRouter();
  const lenis = useLenis();

  const { contextSafe } = useGSAP(() => {});

  const handleLinkClick = contextSafe(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      gsap.set(".page-transition", { yPercent: 100 });
      gsap.set(".page-transition--inner", { yPercent: 100 });

      const tl = gsap.timeline();

      tl.to(".page-transition", {
        yPercent: 0,
        duration: 0.3,
      });

      tl.then(() => {
        if (back) {
          router.push("/");
          if (lenis) {
            setTimeout(() => {
              lenis.scrollTo("#selected-projects");
            }, 500);
          }
        } else if (href) {
          router.push(href.toString());
        } else if (onClick) {
          onClick(e);
        }
      });
    }
  );

  return (
    <Link href={href} {...rest} onClick={handleLinkClick}>
      {children}
    </Link>
  );
}
