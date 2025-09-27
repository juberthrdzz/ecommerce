"use client";
import React from "react";

type Tab = { id: string; name: string; slug: string };

export default function CategoryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.slug ?? "");

  React.useEffect(() => {
    const handler = () => {
      const offsets = tabs
        .map((t) => {
          const el = document.getElementById(`cat-${t.slug}`);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { slug: t.slug, top: rect.top };
        })
        .filter(Boolean) as { slug: string; top: number }[];
      const firstOnScreen = offsets.find((o) => o.top >= 0 && o.top < window.innerHeight * 0.4);
      if (firstOnScreen) setActive(firstOnScreen.slug);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [tabs]);

  const onClick = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(slug);
  };

  return (
    <div className="sticky top-16 z-20 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
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
  );
}


