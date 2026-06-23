import { Menu, Sparkles, SlidersHorizontal } from 'lucide-react';
import React from 'react'
import PropertyCard from './propertycard';
const properties = [
  {
    title: "Beautiful Malibu Mansion",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Starlit Summit Cabin",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    price: "$520",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Moonlit Timber Haven",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
    price: "$540",
    rating: "4.8",
    beds: 3,
    baths: 2,
  },
  {
    title: "Crystal Lake Hideout",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 4,
    baths: 2,
  },
  {
    title: "Sunset Valley Retreat",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    price: "$510",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Beautiful Malibu Mansion",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
];

function MobilePreview() {
 return (
    <div className="w-[360px] rounded-[1.6rem] bg-white shadow-xl">
      <div className="flex h-16 items-center justify-between border-b px-5">
        <span className="font-bold">tourz</span>
        <Menu className="size-5" />
      </div>
      <div className="p-4">
        <button className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-700 py-3 text-sm font-semibold text-white">
          <Sparkles className="size-4" />
          Supporty
        </button>
        <PropertyCard {...properties[0]} />
        <button className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium">
          <SlidersHorizontal className="size-4" />
          Filters
        </button>
      </div>
    </div>
  );
}

export default MobilePreview
