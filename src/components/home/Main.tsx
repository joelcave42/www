"use client";

import useTabs, { Tab } from "@/hooks/useTabs";
import Image from "next/image";
import Link from "next/link";
import {
  CSSProperties,
  FC,
  FocusEvent,
  PointerEvent,
  useRef,
  useState,
} from "react";
import { HiLocationMarker } from "react-icons/hi";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { clsx } from "clsx";
import useTheme from "@/hooks/useTheme";

export default () => {
  const theme = useTheme();

  const [tabs] = useState({
    tabs: [
      {
        title: "kmenu",
        description: "2022 · Accessible command menu component.",
        href: "https://kmenu.hxrsh.in",
      },
      {
        title: "Wraptify",
        description: "Showcase of an android app leverging spotify and google api my team and I built for my CS2340 class at Georgia Tech.",
        href: "https://wrapify.framer.website/",
      },
      {
        title: "Class Scheduler",
        description: "Showcase of an android app my team and I built for my CS2340 class at Georgia Tech.",
        href: "https://cs2340project1.framer.website/",
      },
    ],
  });

  const css = useTabs(tabs);

  return (
    <main>
      <section className="mt-8">
        <h2
          className="mb-2 animate-intro font-medium tracking-tight opacity-0 [animation-delay:200ms]"
          id="projects"
        >
          Projects
        </h2>
        <Projects {...css.tabProps} />
      </section>
    </main>
  );
};

export type Props = { tabs: Tab[] };

export const Projects: FC<Props> = ({ tabs }) => {
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const rect = ref.current?.getBoundingClientRect();

  const [isInitialHoveredElement, setIsInitialHoveredElement] = useState(true);

  const onLeaveTabs = () => {
    setTimeout(() => {
      setIsInitialHoveredElement(true);
      setHoveredTabIndex(null);
    }, 500);
  };

  const onEnterTab = (
    e: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>,
    i: number,
  ) => {
    if (!e.target || !(e.target instanceof HTMLAnchorElement)) return;

    setHoveredTabIndex((prev) => {
      if (prev != null && prev !== i) setIsInitialHoveredElement(false);

      return i;
    });
    setHoveredRect(e.target.getBoundingClientRect());
  };

  const hoverStyles: CSSProperties = { opacity: 0 };
  if (rect && hoveredRect) {
    hoverStyles.transform = `translate3d(0px,${
      hoveredRect.top - rect.top
    }px,0px)`;
    hoverStyles.width = hoveredRect.width;
    hoverStyles.height = hoveredRect.height;
    hoverStyles.opacity = hoveredTabIndex != null ? 1 : 0;
    hoverStyles.transition = isInitialHoveredElement
      ? `opacity 150ms`
      : `transform 250ms 0ms, opacity 200ms 0ms, width 250ms`;
  }

  return (
    <div className="-ml-4">
      <div
        className="relative flex w-fit flex-col"
        ref={ref}
        onPointerLeave={onLeaveTabs}
      >
        {tabs.map((item, index) => (
          <Link
            href={item.href}
            target={item.href.startsWith("/") ? "_self" : "_blank"}
            rel="noreferrer"
            key={index}
            className={clsx(
              "exclude animate-children w-fit animate-intro p-3.5 opacity-0",
            )}
            onPointerEnter={(e) => onEnterTab(e, index)}
            onFocus={(e) => onEnterTab(e, index)}
          >
            <h3
              className={clsx(
                "pointer-events-none flex items-center tracking-tight underline decoration-neutral-300",
                hoveredTabIndex === index && "no-underline",
              )}
            >
              {item.title}
              {!item.href.startsWith("/") && (
                <HiOutlineArrowUpRight className="ml-1 text-sm text-neutral-500" />
              )}
            </h3>
            <p className="pointer-events-none text-sm tracking-tight text-neutral-500">
              {item.description}
            </p>
          </Link>
        ))}
        <div
          className="absolute left-0 top-0 -z-10 rounded-lg bg-neutral-950/5 p-3.5 dark:bg-neutral-50/5"
          style={hoverStyles}
        />
      </div>
    </div>
  );
};
