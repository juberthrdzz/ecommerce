import fs from "node:fs";
import path from "node:path";
import { normalizeMenu } from "@/lib/normalize";
import type { NormalizedMenu } from "@/lib/menu.schema";
import SiteHeader from "@/components/layout/SiteHeader";
import CategoryTabs from "@/components/layout/CategoryTabs";
import DishCard from "@/components/items/DishCard";
import CartDrawer from "@/components/cart/CartDrawer";
import DishModal from "@/components/items/DishModal";
import { Providers } from "./providers";

async function loadMenu(): Promise<NormalizedMenu> {
  const file = path.join(process.cwd(), "data", "menu.sample.json");
  const raw = await fs.promises.readFile(file, "utf-8");
  const json = JSON.parse(raw);
  return normalizeMenu(json);
}

export default async function Page() {
  const menu = await loadMenu();
  const groups = menu.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  return (
    <Providers menu={menu}>
      <SiteHeader title={menu.restaurant.name} />
      <CategoryTabs tabs={groups} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {menu.categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.slug}`} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{cat.name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {menu.items
                .filter((it) => it.categoryId === cat.id)
                .map((it) => (
                  <DishCard key={it.id} id={it.id} name={it.name} description={it.description} imageUrl={it.imageUrl} price={it.basePrice} />
                ))}
            </div>
          </section>
        ))}
      </main>
      <CartDrawer />
      <DishModal />
    </Providers>
  );
}


