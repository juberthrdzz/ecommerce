import { z } from "zod";

// Incoming menu is unknown; use helpers to map. Keep passthrough on known shapes.
export const IncomingMenu = z.unknown();

export const RestaurantSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    currency: z.union([z.literal("MXN"), z.literal("USD")]),
    hours: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    deliveryMethods: z.array(z.union([z.literal("pickup"), z.literal("delivery")])),
    taxRate: z.number().optional(),
  })
  .passthrough();

export const CategorySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    sort: z.number().optional(),
  })
  .passthrough();

export const OptionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    priceDelta: z.number(),
  })
  .passthrough();

export const OptionGroupSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    min: z.number(),
    max: z.number(),
    options: z.array(OptionSchema),
  })
  .passthrough();

export const ItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    basePrice: z.number(),
    categoryId: z.string(),
    tags: z.array(z.string()).optional(),
    optionGroups: z.array(OptionGroupSchema).optional(),
  })
  .passthrough();

export const NormalizedMenuSchema = z
  .object({
    restaurant: RestaurantSchema,
    categories: z.array(CategorySchema),
    items: z.array(ItemSchema),
  })
  .passthrough();

export type NormalizedMenu = z.infer<typeof NormalizedMenuSchema>;


