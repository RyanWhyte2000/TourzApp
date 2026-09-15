import { providerDefinitions, type ProviderType } from "./types";
import type { DriverBooking, DriverService } from "../driver/types";

// Existing reservations store the shared fulfillment stage in driver_status.
// Keep that column compatible with the original driver dashboard.
export type DashboardBooking = DriverBooking;
export type DashboardListing = DriverService;
export { bookingTransition, driverSummary as dashboardSummary } from "../driver/types";

type NumericField = { name: string; label: string; min: number; max: number; initial: number };
type DashboardDefinition = {
  title: string; listings: string; singular: string; add: string;
  start: string; end: string | null; startAction: string; completeAction: string;
  activeLabel: string; completedLabel: string; upcomingLabel: string;
  party: string; parties: string; priceLabel: string; fields: NumericField[];
};
const vehicleFields: NumericField[] = [
  { name: "seats", label: "Passenger seats", min: 1, max: 30, initial: 1 },
  { name: "luggage", label: "Luggage capacity", min: 0, max: 30, initial: 0 },
];
export const dashboardDefinitions: Record<ProviderType, DashboardDefinition> = {
  driver: { title: "Driver", listings: "Driving services", singular: "driving service", add: "Add service", start: "Pickup", end: "Return", startAction: "Start trip", completeAction: "Complete trip", activeLabel: "In progress", completedLabel: "Completed", upcomingLabel: "Upcoming trips", party: "passenger", parties: "passengers", priceLabel: "Daily price (USD)", fields: vehicleFields },
  hotel_owner: { title: "Hotel", listings: "Hotel listings", singular: "hotel listing", add: "Add hotel listing", start: "Check-in", end: "Check-out", startAction: "Check in guests", completeAction: "Check out guests", activeLabel: "Checked in", completedLabel: "Checked out", upcomingLabel: "Upcoming arrivals", party: "guest", parties: "guests", priceLabel: "Nightly price (USD)", fields: [
    { name: "rooms", label: "Rooms", min: 1, max: 100, initial: 1 },
    { name: "starRating", label: "Star rating", min: 1, max: 5, initial: 3 },
  ] },
  car_rental: { title: "Car Rental", listings: "Rental fleet", singular: "rental vehicle", add: "Add vehicle", start: "Pickup", end: "Return", startAction: "Hand over vehicle", completeAction: "Mark vehicle returned", activeLabel: "On rental", completedLabel: "Returned", upcomingLabel: "Upcoming pickups", party: "passenger", parties: "passengers", priceLabel: "Daily price (USD)", fields: vehicleFields },
  airbnb_owner: { title: "Airbnb", listings: "Vacation rentals", singular: "vacation rental", add: "Add property", start: "Check-in", end: "Check-out", startAction: "Check in guests", completeAction: "Check out guests", activeLabel: "Checked in", completedLabel: "Checked out", upcomingLabel: "Upcoming arrivals", party: "guest", parties: "guests", priceLabel: "Nightly price (USD)", fields: [
    { name: "bedrooms", label: "Bedrooms", min: 0, max: 50, initial: 1 },
    { name: "beds", label: "Beds", min: 1, max: 100, initial: 1 },
    { name: "bathrooms", label: "Bathrooms", min: 0, max: 50, initial: 1 },
  ] },
  restaurant_owner: { title: "Restaurant", listings: "Dining listings", singular: "dining listing", add: "Add dining listing", start: "Reservation time", end: null, startAction: "Seat party", completeAction: "Complete dining", activeLabel: "Seated", completedLabel: "Finished", upcomingLabel: "Upcoming reservations", party: "diner", parties: "diners", priceLabel: "", fields: [
    { name: "partySize", label: "Maximum party size", min: 1, max: 100, initial: 2 },
  ] },
};

export function dashboardHref(type: ProviderType) {
  return type === "driver" ? "/driver" : `/host/dashboard/${type}`;
}

export function bookingStage(booking: DashboardBooking) {
  return booking.status === "cancelled" ? "cancelled" : booking.status === "pending" ? "pending" : booking.driver_status;
}

export function bookingLabel(booking: DashboardBooking, type: ProviderType) {
  const stage = bookingStage(booking);
  return stage === "cancelled" ? "Cancelled" : stage === "pending" ? "Pending" : stage === "scheduled" ? "Scheduled" : stage === "in_progress" ? dashboardDefinitions[type].activeLabel : dashboardDefinitions[type].completedLabel;
}

export function parseProviderListing(form: FormData, type: ProviderType) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const title = text("title"), description = text("description"), subtitle = text("subtitle"), image_url = text("image_url");
  const price = providerDefinitions[type].category === "food" ? 0 : Number(form.get("price"));
  if (title.length < 5 || title.length > 160 || description.length < 30 || description.length > 3000 || subtitle.length < 3 || subtitle.length > 200) return { error: "Complete the title, description, and location." } as const;
  if (providerDefinitions[type].category !== "food" && (!Number.isFinite(price) || price <= 0 || price > 1_000_000)) return { error: "Enter a valid price." } as const;
  try { if (!["http:", "https:"].includes(new URL(image_url).protocol) || image_url.length > 1000) throw new Error(); } catch { return { error: "Enter a valid HTTP or HTTPS image URL." } as const; }
  const filter_values: Record<string, number> = {};
  for (const field of dashboardDefinitions[type].fields) {
    const raw = text(field.name);
    const value = Number(raw);
    if (!raw || !Number.isInteger(value) || value < field.min || value > field.max) return { error: `${field.label} must be a whole number between ${field.min} and ${field.max}.` } as const;
    filter_values[field.name] = value;
  }
  const category = providerDefinitions[type].category;
  const price_suffix = category === "food" ? "" : category === "transport" ? "/day" : "/night";
  return { data: { title, description, subtitle, image_url, price, price_suffix, filter_values } } as const;
}
