"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/store";

export default function FavoriteButton({
  listingId,
  title,
  variant = "icon",
}: {
  listingId: string;
  title: string;
  variant?: "icon" | "label";
}) {
  const { isFavorite, toggle } = useWishlist();
  const favorite = isFavorite(listingId);

  return (
    <button
      type="button"
      aria-label={favorite ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      aria-pressed={favorite}
      onClick={() => toggle(listingId)}
      className={
        variant === "label"
          ? "inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium transition hover:bg-slate-50"
          : "flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105"
      }
    >
      <Heart className={`${variant === "icon" ? "size-4" : "size-4"} ${favorite ? "fill-rose-500 text-rose-500" : "text-slate-700"}`} />
      {variant === "label" && (favorite ? "Saved" : "Save")}
    </button>
  );
}
