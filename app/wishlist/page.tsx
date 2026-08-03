import type { Metadata } from "next";
import PageShell from "../PageShell";
import WishlistGrid from "../WishlistGrid";

export const metadata: Metadata = { title: "Wishlist | Tourz" };

export default function WishlistPage() {
  return (
    <PageShell>
      <WishlistGrid />
    </PageShell>
  );
}
