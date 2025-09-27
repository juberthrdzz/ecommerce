import type { MappingConfig } from "@/lib/normalize";

// Example mapping for a hypothetical vendor JSON
// Adjust keys to match the upstream payload and pass into normalizeMenu(..., mapping)
export const exampleMapping: MappingConfig = {
  categoryIdKey: "category_id",
  categoryNameKey: "category_name",
  itemIdKey: "sku",
  itemNameKey: "title",
  itemDescKey: "description_text",
  itemPriceKey: "unit_price",
  itemImageKey: "image_url",
  itemCategoryKey: "category_id",
  optionGroupsKey: "modifiers",
  optionGroupNameKey: "group_name",
  optionMinKey: "min_required",
  optionMaxKey: "max_allowed",
  optionsKey: "choices",
  optionIdKey: "choice_id",
  optionNameKey: "choice_name",
  optionPriceDeltaKey: "price_delta",
};


