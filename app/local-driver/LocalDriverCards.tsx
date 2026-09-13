import { CarFront, MapPin, Star, Users } from "lucide-react";

const drivers = [
  { name: "Andre Campbell", vehicle: "Toyota Noah · 7 seats", area: "Montego Bay & Negril", price: "$85", rating: "4.9", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80" },
  { name: "Shanice Williams", vehicle: "Honda CR-V · 5 seats", area: "Kingston & Ocho Rios", price: "$70", rating: "4.8", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80" },
  { name: "Dwayne Thompson", vehicle: "Toyota Hiace · 12 seats", area: "Montego Bay airport transfers", price: "$110", rating: "5.0", image: "https://images.unsplash.com/photo-1544627669-8a4e3e4a4b4e?auto=format&fit=crop&w=900&q=80" },
  { name: "Marsha Reid", vehicle: "Nissan Serena · 7 seats", area: "Port Antonio & the east coast", price: "$90", rating: "4.9", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80" },
];

export default function LocalDriverCards() {
  return <div className="grid gap-5 sm:grid-cols-2">
    {drivers.map(driver => <article key={driver.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
      <div className="relative aspect-[1.8/1] bg-cover bg-center" role="img" aria-label={`${driver.vehicle} driven by ${driver.name}`} style={{ backgroundImage: `url(${driver.image})` }}>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm"><Star className="size-4 fill-amber-400 text-amber-400" /> {driver.rating}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Local Driver</p><h2 className="mt-1 text-xl font-bold">{driver.name}</h2></div><CarFront className="mt-1 size-5 text-emerald-700" /></div>
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700"><CarFront className="size-4 text-slate-400" />{driver.vehicle}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="size-4 text-slate-400" />{driver.area}</p>
        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><p><span className="text-2xl font-bold">{driver.price}</span> <span className="text-sm text-slate-500">USD / day</span></p><span className="inline-flex items-center gap-1 text-xs text-slate-500"><Users className="size-3.5" /> Private ride</span></div>
      </div>
    </article>)}
  </div>;
}
