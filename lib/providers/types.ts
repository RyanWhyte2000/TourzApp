export const providerTypes = ["driver", "hotel_owner", "car_rental", "airbnb_owner", "restaurant_owner"] as const;
export type ProviderType = typeof providerTypes[number];

type DetailField = { name: string; label: string; placeholder: string };
type ProviderDefinition = {
  label: string;
  description: string;
  category: "transport" | "hotel" | "airbnb" | "food";
  nameLabel: string;
  listingLabel: string;
  fields: DetailField[];
};

export const providerDefinitions: Record<ProviderType, ProviderDefinition> = {
  driver: {
    label: "Driver", description: "Offer airport transfers, private rides, and guided journeys.",
    category: "transport", nameLabel: "Driver or service name", listingLabel: "Add a driving service",
    fields: [{ name: "vehicle", label: "Vehicle", placeholder: "Toyota Hiace · 7 passenger seats" }, { name: "service_area", label: "Service area", placeholder: "Montego Bay and airport transfers" }],
  },
  hotel_owner: {
    label: "Hotel Owner", description: "Showcase your hotel and manage accommodation listings.",
    category: "hotel", nameLabel: "Hotel name", listingLabel: "Add a hotel listing",
    fields: [{ name: "property_type", label: "Property type", placeholder: "Boutique hotel, resort, or guesthouse" }, { name: "facilities", label: "Main facilities", placeholder: "Pool, restaurant, airport shuttle" }],
  },
  car_rental: {
    label: "Car Rental Company", description: "Present your rental company and the vehicles in your fleet.",
    category: "transport", nameLabel: "Company name", listingLabel: "Add a rental vehicle",
    fields: [{ name: "fleet", label: "Fleet", placeholder: "Sedans, SUVs, and passenger vans" }, { name: "pickup_locations", label: "Pickup locations", placeholder: "Airport desk and Montego Bay office" }],
  },
  airbnb_owner: {
    label: "Airbnb Owner", description: "Host travelers in your homes, villas, and vacation rentals.",
    category: "airbnb", nameLabel: "Host or business name", listingLabel: "Add a vacation rental",
    fields: [{ name: "property_types", label: "Property types", placeholder: "Villas, apartments, and cabins" }, { name: "hosting_area", label: "Hosting area", placeholder: "Montego Bay and Negril" }],
  },
  restaurant_owner: {
    label: "Restaurant Owner", description: "Introduce your restaurant and dining experiences.",
    category: "food", nameLabel: "Restaurant name", listingLabel: "Add a dining listing",
    fields: [{ name: "cuisine", label: "Cuisine", placeholder: "Jamaican, seafood, or Italian" }, { name: "opening_hours", label: "Opening hours", placeholder: "Tuesday–Sunday, 12 pm–10 pm" }],
  },
};

export function isProviderType(value: unknown): value is ProviderType {
  return typeof value === "string" && providerTypes.some((type) => type === value);
}

export type ProviderProfile = {
  id: string;
  user_id: string;
  provider_type: ProviderType;
  display_name: string;
  description: string;
  location: string;
  contact_email: string;
  phone: string;
  website: string;
  details: Record<string, string>;
};

export type ProviderListing = {
  id: string;
  title: string;
  category: string;
  status: string;
  price: number | string;
  price_suffix: string;
  provider_profile_id: string | null;
};
