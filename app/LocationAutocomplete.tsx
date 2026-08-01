"use client";

import { Map, MapPin } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

const destinations = [
  { name: "Montego Bay", region: "St. James, Jamaica" },
  { name: "Kingston", region: "Kingston, Jamaica" },
  { name: "Negril", region: "Westmoreland, Jamaica" },
  { name: "Ocho Rios", region: "St. Ann, Jamaica" },
  { name: "Port Antonio", region: "Portland, Jamaica" },
  { name: "Falmouth", region: "Trelawny, Jamaica" },
  { name: "Runaway Bay", region: "St. Ann, Jamaica" },
  { name: "Treasure Beach", region: "St. Elizabeth, Jamaica" },
  { name: "Mandeville", region: "Manchester, Jamaica" },
  { name: "Spanish Town", region: "St. Catherine, Jamaica" },
];

type LocationAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export default function LocationAutocomplete({
  value,
  onChange,
  label = "Where",
  placeholder = "Search destinations",
}: LocationAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const matches = useMemo(() => {
    const query = value.trim().toLocaleLowerCase();

    if (!query || destinations.some((place) => `${place.name}, Jamaica` === value)) {
      return destinations.slice(0, 5);
    }

    return destinations
      .filter((place) =>
        `${place.name} ${place.region}`.toLocaleLowerCase().includes(query),
      )
      .slice(0, 5);
  }, [value]);

  const selectLocation = (name: string) => {
    onChange(`${name}, Jamaica`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-20 items-center gap-3 px-5 py-4"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <Map className="size-4 shrink-0 text-slate-900" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="text-xs text-slate-500">
          {label}
        </label>
        <input
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((current) => Math.min(current + 1, matches.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            } else if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              selectLocation(matches[activeIndex].name);
            } else if (event.key === "Escape") {
              setIsOpen(false);
              setActiveIndex(-1);
            }
          }}
          className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
        />
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Suggested destinations"
          className="absolute left-0 top-full z-30 mt-1 w-full min-w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
        >
          {matches.length > 0 ? (
            matches.map((place, index) => (
              <button
                id={`${listboxId}-option-${index}`}
                key={place.name}
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectLocation(place.name)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeIndex === index ? "bg-violet-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {place.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {place.region}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">No destinations found</p>
          )}
        </div>
      )}
    </div>
  );
}
