/* eslint-disable @typescript-eslint/no-explicit-any */
import { NormalizedMenuSchema } from "./menu.schema";
import type { NormalizedMenu } from "./menu.schema";

export type MappingConfig = {
  categoryIdKey?: string;
  categoryNameKey?: string;
  itemIdKey?: string;
  itemNameKey?: string;
  itemDescKey?: string;
  itemPriceKey?: string;
  itemImageKey?: string;
  itemCategoryKey?: string; // category id or name on item
  optionGroupsKey?: string;
  optionGroupNameKey?: string;
  optionMinKey?: string;
  optionMaxKey?: string;
  optionsKey?: string;
  optionIdKey?: string;
  optionNameKey?: string;
  optionPriceDeltaKey?: string;
};

const defaultMapping: Required<MappingConfig> = {
  categoryIdKey: "id",
  categoryNameKey: "name",
  itemIdKey: "id",
  itemNameKey: "name",
  itemDescKey: "description",
  itemPriceKey: "price",
  itemImageKey: "image",
  itemCategoryKey: "categoryId",
  optionGroupsKey: "optionGroups",
  optionGroupNameKey: "name",
  optionMinKey: "min",
  optionMaxKey: "max",
  optionsKey: "options",
  optionIdKey: "id",
  optionNameKey: "name",
  optionPriceDeltaKey: "priceDelta",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function coerceNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export function normalizeMenu(incoming: unknown, mapping?: MappingConfig): NormalizedMenu {
  const m = { ...defaultMapping, ...(mapping ?? {}) };

  // Expect either { categories, items, restaurant } or the new format { restaurant_id, restaurant_name, combos, categories, modifiers }
  const input = incoming as Record<string, unknown> | unknown[] | undefined;
  const asRecord = (input && !Array.isArray(input) ? (input as Record<string, unknown>) : undefined) || {};
  
  // Handle new format: categories with nested items
  let categoriesInput: unknown[] = [];
  let itemsInput: unknown[] = [];
  
  if (Array.isArray(asRecord.categories)) {
    // New format: categories contain items within them
    categoriesInput = asRecord.categories as unknown[];
    itemsInput = [];
    
    // Flatten items from categories
    categoriesInput.forEach((catUnknown: unknown) => {
      const cat = (catUnknown ?? {}) as Record<string, unknown>;
      if (Array.isArray(cat.items)) {
        itemsInput.push(...(cat.items as unknown[]));
      }
    });
    
    // Also include combos if they exist (but avoid duplicates)
    if (Array.isArray(asRecord.combos)) {
      const existingItemIds = new Set(itemsInput.map(item => String((item as any)?.id ?? "")));
      const uniqueCombos = (asRecord.combos as unknown[]).filter(combo => {
        const comboId = String((combo as any)?.id ?? "");
        return comboId && !existingItemIds.has(comboId);
      });
      itemsInput.push(...uniqueCombos);
    }
  } else {
    // Legacy format: separate categories and items arrays
    categoriesInput = Array.isArray(asRecord.categories) ? (asRecord.categories as unknown[]) : [];
    itemsInput = Array.isArray(asRecord.items)
      ? (asRecord.items as unknown[])
      : Array.isArray(input)
      ? (input as unknown[])
      : Array.isArray((asRecord as any).menu)
      ? (((asRecord as any).menu as unknown[]))
      : [];
  }

  // Build categories map. If not provided, infer from items by name
  const inferredCategories = new Map<string, { id: string; name: string; slug: string; sort?: number }>();
  const categories = categoriesInput.map((cUnknown: unknown, idx: number): { id: string; name: string; slug: string; sort?: number } => {
    const c = (cUnknown ?? {}) as Record<string, unknown>;
    const id = String((c as any)?.[m.categoryIdKey] ?? (c as any)?.id ?? `cat_${idx}`);
    const name = String((c as any)?.[m.categoryNameKey] ?? (c as any)?.name ?? `Categoría ${idx + 1}`);
    const slug = slugify(name);
    const sort = typeof (c as any)?.sort === "number" ? ((c as any).sort as number) : idx;
    inferredCategories.set(id, { id, name, slug, sort });
    return { id, name, slug, sort };
  });

  // Create a map to track which items belong to which categories in the new format
  const itemToCategoryMap = new Map<string, string>();
  if (Array.isArray(asRecord.categories)) {
    categoriesInput.forEach((catUnknown: unknown) => {
      const cat = (catUnknown ?? {}) as Record<string, unknown>;
      const catId = String(cat.id ?? cat.name ?? "");
      if (Array.isArray(cat.items)) {
        (cat.items as unknown[]).forEach((itemUnknown: unknown) => {
          const item = (itemUnknown ?? {}) as Record<string, unknown>;
          const itemId = String(item.id ?? item.name ?? "");
          if (itemId) {
            itemToCategoryMap.set(itemId, catId);
          }
        });
      }
    });
  }

  const items = itemsInput.map((itUnknown: unknown, idx: number) => {
    const it = (itUnknown ?? {}) as Record<string, unknown>;
    const itemId = String((it as any)?.[m.itemIdKey] ?? (it as any)?.id ?? `item_${idx}`);
    const name = String((it as any)?.[m.itemNameKey] ?? (it as any)?.name ?? `Platillo ${idx + 1}`);
    const description = typeof (it as any)?.[m.itemDescKey] === "string" ? ((it as any)[m.itemDescKey] as string) : ((it as any)?.description as string | undefined);
    const imageUrl = typeof (it as any)?.[m.itemImageKey] === "string" ? ((it as any)[m.itemImageKey] as string) : (((it as any)?.imageUrl as string | undefined) ?? ((it as any)?.image as string | undefined));
    const basePrice = coerceNumber((it as any)?.[m.itemPriceKey] ?? (it as any)?.basePrice ?? (it as any)?.price, 0);

    let categoryId: string | undefined = (it as any)?.[m.itemCategoryKey] as string | undefined;
    
    // Check if this item has a predefined category in the new format
    if (!categoryId && itemToCategoryMap.has(itemId)) {
      categoryId = itemToCategoryMap.get(itemId);
    }
    
    if (!categoryId && typeof (it as any)?.categoryName === "string") {
      // infer by name
      const catName = (it as any).categoryName as string;
      const slug = slugify(catName);
      let catEntry = Array.from(inferredCategories.values()).find((c) => c.slug === slug);
      if (!catEntry) {
        const newId = `cat_${slug}`;
        catEntry = { id: newId, name: catName, slug };
        inferredCategories.set(newId, catEntry);
      }
      categoryId = catEntry.id;
    }
    if (!categoryId) {
      // default Bucket
      const defaultId = "cat_menu";
      if (!inferredCategories.has(defaultId)) {
        inferredCategories.set(defaultId, { id: defaultId, name: "Menú", slug: "menu", sort: 0 });
      }
      categoryId = defaultId;
    }

    const tags = Array.isArray((it as any)?.tags) ? ((it as any).tags as unknown[]).filter((t) => typeof t === "string") as string[] : undefined;

    // Option groups
    const ogRaw = Array.isArray((it as any)?.[m.optionGroupsKey])
      ? (((it as any)[m.optionGroupsKey] as unknown[]))
      : Array.isArray((it as any)?.optionGroups)
      ? (((it as any).optionGroups as unknown[]))
      : [];
    const optionGroups = ogRaw.map((gUnknown: unknown, gIdx: number): { id: string; name: string; min: number; max: number; options: { id: string; name: string; priceDelta: number }[] } => {
      const g = (gUnknown ?? {}) as Record<string, unknown>;
      const gid = String((g as any)?.id ?? `${itemId}_og_${gIdx}`);
      const gname = String((g as any)?.[m.optionGroupNameKey] ?? (g as any)?.name ?? `Opciones`);
      const min = coerceNumber((g as any)?.[m.optionMinKey] ?? (g as any)?.min ?? 0, 0);
      const max = coerceNumber((g as any)?.[m.optionMaxKey] ?? (g as any)?.max ?? 1, 1);
      const optionsRaw: unknown[] = Array.isArray((g as any)?.[m.optionsKey])
        ? (((g as any)[m.optionsKey] as unknown[]))
        : Array.isArray((g as any)?.options)
        ? (((g as any).options as unknown[]))
        : [];
      const options = optionsRaw.map((opUnknown: unknown, oIdx: number): { id: string; name: string; priceDelta: number } => {
        const op = (opUnknown ?? {}) as Record<string, unknown>;
        return {
          id: String((op as any)?.[m.optionIdKey] ?? (op as any)?.id ?? `${gid}_opt_${oIdx}`),
          name: String((op as any)?.[m.optionNameKey] ?? (op as any)?.name ?? `Opción ${oIdx + 1}`),
          priceDelta: coerceNumber((op as any)?.[m.optionPriceDeltaKey] ?? (op as any)?.priceDelta ?? (op as any)?.price ?? 0, 0),
        };
      });
      return { id: gid, name: gname, min, max, options };
    });

    const ensuredCategoryId = categoryId ?? "cat_menu";
    return { id: itemId, name, description, imageUrl, basePrice, categoryId: ensuredCategoryId, tags, optionGroups: optionGroups.length ? optionGroups : undefined };
  });

  const categoryValues = Array.from(inferredCategories.values());
  const mergedCategories = categories.length ? categories : categoryValues.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  // Handle restaurant data - check both old and new formats
  let restaurantData: Record<string, unknown> = {};
  
  if (asRecord.restaurant) {
    // Old format: restaurant object
    restaurantData = asRecord.restaurant as Record<string, unknown>;
  } else {
    // New format: restaurant_id, restaurant_name at root level
    restaurantData = {
      id: asRecord.restaurant_id,
      name: asRecord.restaurant_name,
      currency: "MXN", // Default for new format
      deliveryMethods: ["pickup", "delivery"], // Default for new format
    };
  }
  
  const deliveryMethodsRaw = Array.isArray(restaurantData.deliveryMethods)
    ? (restaurantData.deliveryMethods as unknown[])
    : [];
  const restaurant = {
    id: String(restaurantData?.id ?? "rest_1"),
    name: String(restaurantData?.name ?? "Riko Restaurant"),
    currency: (((restaurantData?.currency === "USD" ? "USD" : "MXN") as "MXN" | "USD")),
    hours: typeof restaurantData?.hours === "string" ? (restaurantData.hours as string) : undefined,
    address: typeof restaurantData?.address === "string" ? (restaurantData.address as string) : undefined,
    phone: typeof restaurantData?.phone === "string" ? (restaurantData.phone as string) : undefined,
    deliveryMethods:
      deliveryMethodsRaw.length > 0
        ? (deliveryMethodsRaw.filter((d) => d === "pickup" || d === "delivery") as ("pickup" | "delivery")[])
        : (["pickup", "delivery"] as ("pickup" | "delivery")[]),
    taxRate: typeof restaurantData?.taxRate === "number" ? ((restaurantData.taxRate as number)) : undefined,
  } as const;

  const normalized: NormalizedMenu = {
    restaurant,
    categories: mergedCategories,
    items,
  };

  const parsed = NormalizedMenuSchema.safeParse(normalized);
  if (!parsed.success) {
    console.warn("normalizeMenu produced validation errors:", parsed.error.flatten());
    return normalized; // fail-soft
  }
  return parsed.data;
}


