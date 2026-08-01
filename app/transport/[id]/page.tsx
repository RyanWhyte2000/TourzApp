import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "../../ListingDetail";
import PageShell from "../../PageShell";
import { vehicles } from "../../Transport";

export function generateStaticParams() {
  return vehicles.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = vehicles.find((listing) => listing.id === id);
  return { title: item ? `${item.title} | Tourz` : "Listing not found | Tourz" };
}

export default async function TransportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = vehicles.find((listing) => listing.id === id);
  if (!item) notFound();

  return <PageShell><ListingDetail category="transport" item={item} /></PageShell>;
}
