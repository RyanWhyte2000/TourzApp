import { Bath, BedDouble, Heart, Star } from 'lucide-react';
import React from 'react'

export default function PropertyCard({
  title,
  image,
  price,
  rating,
  beds,
  baths,
}: {
  title: string;
  image: string;
  price: string;
  rating: string;
  beds: number;
  baths: number;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
      <div
        aria-label={title}
        className="relative aspect-[1.75/1] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-sm font-semibold shadow-sm">
          {rating}
          <Star className="size-4 fill-amber-400 text-amber-400" />
        </span>
        <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/75 text-white backdrop-blur">
          <Heart className="size-4" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">
          2464 Royal Ln. Mesa, New Jersey 45463
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-4" />
              {beds} bed
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="size-4" />
              {baths} bath
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-bold">{price}</span>
            <span className="text-sm font-medium">/night</span>
            <p className="text-xs font-medium text-slate-500 underline">$12,400/total</p>
          </div>
        </div>
      </div>
    </article>
  );
}

