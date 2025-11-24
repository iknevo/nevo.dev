import { SectionFlower } from "@/src/components/icons";
import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
    icon?: string;
  };
  title: string;
}

export default function SectionTitle({
  icon,
  title,
  className,
  classNames,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 mb-10",
        className,
        classNames?.container,
      )}
    >
      {icon ? (
        icon
      ) : (
        <SectionFlower
          width={25}
          className={cn("animate-spin duration-7000", classNames?.icon)}
        />
      )}
      <h2 className={cn("text-xl uppercase leading-none", classNames?.title)}>
        {title}
      </h2>
    </div>
  );
}
