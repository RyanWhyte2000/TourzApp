"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { ListingCategory } from "./ListingLayout";
import type { MapListing } from "@/lib/listings/types";

const montegoBay: [number, number] = [18.4762, -77.8939];

function FitListings({ items }: { items: MapListing[] }) {
  const map = useMap();

  useEffect(() => {
    if (items.length === 0) {
      map.setView(montegoBay, 12);
      return;
    }
    if (items.length === 1) {
      map.setView([items[0].latitude, items[0].longitude], 14);
      return;
    }
    map.fitBounds(items.map((item) => [item.latitude, item.longitude] as [number, number]), {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [items, map]);

  return null;
}

function priceIcon(price: number) {
  return L.divIcon({
    className: "tourz-price-marker",
    html: `<span>$${Math.round(price)}</span>`,
    iconAnchor: [30, 18],
    iconSize: [60, 36],
  });
}

export default function ListingMapClient({
  category,
  items,
}: {
  category: ListingCategory;
  items: MapListing[];
}) {
  const markers = useMemo(
    () => items.map((item) => ({ ...item, icon: priceIcon(item.price) })),
    [items],
  );

  return (
    <div className="sticky top-4 h-[65dvh] min-h-120 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm lg:h-[72vh]">
      <MapContainer center={montegoBay} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
          attribution={process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? "&copy; OpenStreetMap contributors"}
        />
        <FitListings items={items} />
        {markers.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={item.icon}
            title={item.title}
          >
            <Popup minWidth={220}>
              <div className="overflow-hidden">
                <div className="h-24 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                <p className="mt-3 font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-bold">${item.price}</span>
                  <span>★ {item.rating.toFixed(1)}</span>
                </div>
                <Link href={`/${category}/${item.id}`} className="mt-3 block rounded-full bg-violet-700 px-4 py-2 text-center text-sm font-semibold text-white">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-400 flex items-center justify-center">
          <div className="rounded-xl bg-white px-5 py-3 text-sm font-semibold shadow-lg">No mapped results</div>
        </div>
      )}
    </div>
  );
}
