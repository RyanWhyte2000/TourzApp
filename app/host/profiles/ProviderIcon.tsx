import { BedDouble, Building2, CarFront, KeyRound, UtensilsCrossed } from "lucide-react";
import type { ProviderType } from "@/lib/providers/types";

const icons = { driver: CarFront, hotel_owner: Building2, car_rental: KeyRound, airbnb_owner: BedDouble, restaurant_owner: UtensilsCrossed };

export default function ProviderIcon({ type }: { type: ProviderType }) {
  const Icon = icons[type];
  return <Icon className="size-6" aria-hidden="true" />;
}
