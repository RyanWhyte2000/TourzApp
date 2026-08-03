import type { ListingCategory, ListingSearchParams } from "@/app/ListingLayout";

export type ListingRow = {
  id: string;
  category: ListingCategory;
  title: string;
  image_url: string;
  price: number | string;
  rating: number | string;
  subtitle: string | null;
  price_suffix: string;
  total_price: string | null;
  filter_tags: string[];
  filter_values: Record<string, number>;
  meta: { label: string }[];
};

export type ListingQuery = {
  category: ListingCategory;
  search?: ListingSearchParams;
};

export type MapListing = {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  subtitle: string | null;
  latitude: number;
  longitude: number;
};
