export type DeliveryMethod = "pickup" | "delivery";

export type Restaurant = {
  id: string;
  name: string;
  currency: "MXN" | "USD";
  hours?: string;
  address?: string;
  phone?: string;
  deliveryMethods: DeliveryMethod[];
  taxRate?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort?: number;
};

export type Option = {
  id: string;
  name: string;
  priceDelta: number;
};

export type OptionGroup = {
  id: string;
  name: string;
  min: number;
  max: number;
  options: Option[];
};

export type Item = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  categoryId: string;
  tags?: string[];
  optionGroups?: OptionGroup[];
};

export type NormalizedMenu = {
  restaurant: Restaurant;
  categories: Category[];
  items: Item[];
};


