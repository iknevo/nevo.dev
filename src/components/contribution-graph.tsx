"use client";

import { format, getDay, parseISO } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ContributionCalendar, ContributionLevel } from "@/src/lib/github";
import { cn } from "@/src/lib/utils";

const LEVELS: ContributionLevel[] = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

const levelClassName: Record<ContributionLevel, string> = {
  NONE: "bg-white/5",
  FIRST_QUARTILE: "bg-primary/30",
  SECOND_QUARTILE: "bg-primary/55",
  THIRD_QUARTILE: "bg-primary/80",
  FOURTH_QUARTILE: "bg-primary",
};

const WEEKDAY_LABELS = [
  { label: "Mon", day: 1 },
  { label: "Wed", day: 3 },
  { label: "Fri", day: 5 },
];

type Props = {
  calendar: ContributionCalendar;
  username: string;
};

type HoveredDay = {
  date: string;
  count: number;
  x: number;
  y: number;
};

function getMonthLabels(calendar: ContributionCalendar) {
  const labels: { label: string; week: number }[] = [];
  let previousMonth = -1;
  calendar.weeks.forEach((week, index) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const date = parseISO(firstDay.date);
    if (date.getMonth() === previousMonth) return;
    previousMonth = date.getMonth();
    labels.push({ label: format(date, "MMM"), week: index });
  });
  if (labels.length > 1 && labels[1].week - labels[0].week < 3) labels.shift();
  return labels;
}

function describe(count: number) {
  if (count === 0) return "No contributions";
  return `${count} contribution${count === 1 ? "" : "s"}`;
}

export default function ContributionGraph({ calendar, username }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredDay | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const monthLabels = getMonthLabels(calendar);

  useEffect(() => {
    if (!hovered) return;
    const hide = () => setHovered(null);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, [hovered]);

  useLayoutEffect(() => {
    if (!hovered || !tooltipRef.current) return;
    const width = tooltipRef.current.offsetWidth;
    const margin = 8;
    setTooltipLeft(
      Math.min(Math.max(hovered.x - width / 2, margin), window.innerWidth - width - margin)
    );
  }, [hovered]);

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    setHovered({
      date: cell.dataset.date!,
      count: Number(cell.dataset.count),
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <div className="mx-auto mb-10 w-full max-w-3xl">
      <div
        role="img"
        aria-label={`${calendar.totalContributions} GitHub contributions in the last year`}
        className="grid gap-[2px] sm:gap-[3px]"
        style={{ gridTemplateColumns: `auto repeat(${calendar.weeks.length}, minmax(0, 1fr))` }}
        onPointerOver={handlePointerOver}
        onPointerLeave={() => setHovered(null)}
      >
        {monthLabels.map(({ label, week }) => (
          <span
            key={`${label}-${week}`}
            className="pb-1 text-left text-[9px] leading-none whitespace-nowrap text-white/50 sm:text-xs"
            style={{ gridColumn: `${week + 2} / span 3`, gridRow: 1 }}
          >
            {label}
          </span>
        ))}
        {WEEKDAY_LABELS.map(({ label, day }) => (
          <span
            key={label}
            className="self-center pr-1.5 text-left text-[9px] leading-none text-white/50 sm:pr-2 sm:text-xs"
            style={{ gridColumn: 1, gridRow: day + 2 }}
          >
            {label}
          </span>
        ))}
        {calendar.weeks.map((week, weekIndex) =>
          week.contributionDays.map((day) => (
            <span
              key={day.date}
              data-date={day.date}
              data-count={day.contributionCount}
              className={cn(
                "aspect-square rounded-[2px] transition-transform duration-150",
                levelClassName[day.contributionLevel],
                hovered?.date === day.date && "scale-150 ring-1 ring-white/80"
              )}
              style={{ gridColumn: weekIndex + 2, gridRow: getDay(parseISO(day.date)) + 2 }}
            />
          ))
        )}
      </div>

      <div className="mt-3 flex flex-col items-center gap-2 text-sm text-white/60 sm:flex-row sm:justify-between">
        <p>
          {calendar.totalContributions.toLocaleString("en-US")} contributions in the last year
          <span className="mx-2 text-white/30">·</span>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer noopener"
            className="group hover:text-primary inline-flex items-center gap-0.5 transition-colors"
          >
            @{username}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </p>
        <div className="flex items-center gap-1 text-xs text-white/50" aria-hidden="true">
          Less
          {LEVELS.map((level) => (
            <span key={level} className={cn("size-2.5 rounded-[2px]", levelClassName[level])} />
          ))}
          More
        </div>
      </div>

      {hovered &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-y-full rounded-md border border-white/10 bg-neutral-900/95 px-3 py-2 text-xs whitespace-nowrap text-white/70 shadow-lg shadow-black/50 backdrop-blur"
            style={{ left: tooltipLeft, top: hovered.y - 8 }}
          >
            <span
              className={cn("font-semibold", hovered.count > 0 ? "text-primary" : "text-white")}
            >
              {describe(hovered.count)}
            </span>{" "}
            on {format(parseISO(hovered.date), "EEEE, d MMM yyyy")}
          </div>,
          document.body
        )}
    </div>
  );
}
