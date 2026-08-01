import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "../../ListingDetail";
import PageShell from "../../PageShell";
import { getListing } from "@/lib/listings/queries";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getListing("transport", id);
  return { title: item ? `${item.title} | Tourz` : "Listing not found | Tourz" };
}

export default async function TransportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getListing("transport", id);
  if (!item) notFound();
  return <PageShell><ListingDetail category="transport" item={item} /></PageShell>;
}
