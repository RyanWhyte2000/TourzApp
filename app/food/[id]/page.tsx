import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "../../ListingDetail";
import PageShell from "../../PageShell";
import { getListing } from "@/lib/listings/queries";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getListing("food", id);
  return { title: item ? `${item.title} | Tourz` : "Listing not found | Tourz" };
}

export default async function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getListing("food", id);
  if (!item) notFound();
  return <PageShell><ListingDetail category="food" item={item} /></PageShell>;
}
