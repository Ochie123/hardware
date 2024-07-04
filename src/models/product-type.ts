export type InventoryType = 'in_stock' | 'limited' | 'out_of_stock';

// product-types.tsx
export type TagType = {
  url: string;
  title: string;
};

export type OptionValueType = {
  url: string;
  value: string;
  option: string;
};

export type VariantType = {
  url: string;
  optionValues: OptionValueType[];
  price: string;
  stock: number;
  image: string;
  product: string;
};

export type CategoryType = {
  url: string;
  title: string;
  created: string;
  updated: string;
  lft: number;
  rght: number;
  treeId: number;
  level: number;
  parent: string;
};

export type CountryType = {
  url: string;
  name: string;
};

export type DeliveryZoneType = {
  url: string;
  countries: CountryType[];
  name: string;
  shop: string;
};

export type ProductType = {
  url: string;
  tags: TagType[];
  hasVariants: boolean;
  variants: VariantType[];
  uploaded_images: string[]; // Change to array of strings
  categories: CategoryType[];
  deliveryZone: DeliveryZoneType;
  type: string;
  quantity: number;
  toprated: boolean;
  bestseller: boolean;
  title: string;
  slug: string;
  file: string;
  description: string;
  salePrice: string;
  price: string;
  isActive: boolean;
  publish: string;
  created: string;
  updated: string;
  status: string;
  downloadUrl: string;
  shop: string;
};
