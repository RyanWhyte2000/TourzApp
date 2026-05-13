import React from 'react'
import Filters from './Filters';
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

function AirBnb() {
  return (
    <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_360px]">
            <section className="grid gap-5 sm:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={`${property.title}-${property.image}`} {...property} />
              ))}
            </section>
            <Filters />
          </div>

  )
}

export default AirBnb
