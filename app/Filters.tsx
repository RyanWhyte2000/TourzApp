import { Home, Building2, Hotel, TentTree } from 'lucide-react';
import React from 'react'
import PriceInput from './PriceInput';
import CheckRow from './CheckRow';
import OptionRow from './OptionRow';
import TypeButton from './TypeButton';

function Filters() {
  return (
    <aside className="hidden rounded-xl border border-slate-200 bg-white lg:block">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button className="text-sm font-medium">Clear all filter (3)</button>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <h3 className="font-semibold">Price range</h3>
          <p className="mt-1 text-sm text-slate-500">
            The average total price for 12 nights is $2,694
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PriceInput label="Minimum" value="120" />
            <PriceInput label="Maximum" value="700" />
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="font-semibold">Type of place</h3>
          <div className="mt-4 space-y-4">
            <CheckRow checked title="Entire place" copy="A place all to yourself" />
            <CheckRow title="Shared room" copy="A sleeping space and common areas" />
            <CheckRow checked title="Room" copy="Your own room, plus access to shared spaces" />
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="font-semibold">Rooms and beds</h3>
          <OptionRow label="Bedrooms" />
          <OptionRow label="Beds" />
          <OptionRow label="Bathrooms" />
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="font-semibold">Property type</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <TypeButton active icon={<Home className="size-5" />} label="House" />
            <TypeButton icon={<Building2 className="size-5" />} label="Apartment" />
            <TypeButton icon={<Hotel className="size-5" />} label="Villa" />
            <TypeButton icon={<TentTree className="size-5" />} label="Cabin" />
          </div>
        </section>
      </div>
    </aside>
  );
}

export default Filters
