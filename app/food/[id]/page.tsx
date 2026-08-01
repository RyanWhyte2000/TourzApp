import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { restaurants } from "../../Food";
import ListingDetail from "../../ListingDetail";
import PageShell from "../../PageShell";

export function generateStaticParams() {
  return restaurants.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = restaurants.find((listing) => listing.id === id);
  return { title: item ? `${item.title} | Tourz` : "Listing not found | Tourz" };
}

export default async function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = restaurants.find((listing) => listing.id === id);
  if (!item) notFound();

  return <PageShell><ListingDetail category="food" item={item} /></PageShell>;
}
