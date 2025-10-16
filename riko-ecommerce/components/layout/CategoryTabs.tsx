"use client";
import React from "react";

type Tab = { id: string; name: string; slug: string };

export default function CategoryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.slug ?? "");
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const [barHeight, setBarHeight] = React.useState(0);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  React.useEffect(() => {
    const measure = () => {
      const current = barRef.current;
      if (current) setBarHeight(current.offsetHeight);
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderHeight(header?.offsetHeight ?? 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  React.useEffect(() => {
    const handler = () => {
      const totalOffset = headerHeight + barHeight;
      const offsets = tabs
        .map((t) => {
          const el = document.getElementById(`cat-${t.slug}`);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { slug: t.slug, top: rect.top - totalOffset };
        })
        .filter(Boolean) as { slug: string; top: number }[];
      const firstOnScreen = offsets.find((o) => o.top >= 0 && o.top < window.innerHeight * 0.4);
      if (firstOnScreen) setActive(firstOnScreen.slug);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [tabs, barHeight, headerHeight]);

  const onClick = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const offset = headerHeight + barHeight;
      const targetTop = window.scrollY + el.getBoundingClientRect().top - offset + 1;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
    setActive(slug);
  };

  return (
    <>
      <div ref={barRef} className="fixed z-40 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70" style={{ top: headerHeight }}>
        <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1 text-sm",
                active === t.slug ? "bg-black text-white" : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onClick(t.slug)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: headerHeight + barHeight }} />
    </>
  );
}


