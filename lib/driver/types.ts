export type DriverService = {
  id: string;
  title: string;
  description: string | null;
  subtitle: string | null;
  image_url: string;
  price: number | string;
  price_suffix: string;
  status: "draft" | "published" | "archived";
  filter_values: Record<string, number>;
};

export type TripStatus = "scheduled" | "in_progress" | "completed";
export type DriverBooking = {
  id: string;
  listing_id: string;
  starts_at: string;
  ends_at: string | null;
  party_size: number;
  subtotal: number | string;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: string;
  driver_status: TripStatus;
  notes: string | null;
  listings: { title: string } | null;
};

export type BookingAction = "confirm" | "start" | "complete" | "cancel";
export function bookingTransition(booking: Pick<DriverBooking, "status" | "driver_status">, action: string) {
  if (booking.status === "cancelled" || booking.driver_status === "completed") return null;
  if (action === "cancel" && booking.driver_status === "scheduled") return { status: "cancelled" as const };
  if (action === "confirm" && booking.status === "pending" && booking.driver_status === "scheduled") return { status: "confirmed" as const };
  if (action === "start" && booking.status === "confirmed" && booking.driver_status === "scheduled") return { driver_status: "in_progress" as const };
  if (action === "complete" && booking.status === "confirmed" && booking.driver_status === "in_progress") return { driver_status: "completed" as const };
  return null;
}

export function driverSummary(bookings: DriverBooking[], now: number) {
  const active = bookings.filter((booking) => booking.status !== "cancelled");
  return {
    upcoming: active.filter((booking) => booking.driver_status === "scheduled" && Date.parse(booking.ends_at ?? booking.starts_at) >= now).length,
    inProgress: active.filter((booking) => booking.driver_status === "in_progress").length,
    completed: active.filter((booking) => booking.driver_status === "completed").length,
    bookedValue: active.reduce((sum, booking) => sum + Number(booking.subtotal), 0),
  };
}

export function parseDriverService(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const title = text("title");
  const description = text("description");
  const subtitle = text("subtitle");
  const image_url = text("image_url");
  const price = Number(form.get("price"));
  const seats = Number(form.get("seats"));
  const luggage = Number(form.get("luggage"));
  if (title.length < 5 || title.length > 160 || description.length < 30 || description.length > 3000 || subtitle.length < 3 || subtitle.length > 200) return { error: "Complete the title, description, and service area." } as const;
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) return { error: "Enter a valid daily price." } as const;
  if (!Number.isInteger(seats) || seats < 1 || seats > 30 || !Number.isInteger(luggage) || luggage < 0 || luggage > 30) return { error: "Seats must be between 1 and 30; luggage capacity must be between 0 and 30." } as const;
  try {
    if (!["https:", "http:"].includes(new URL(image_url).protocol) || image_url.length > 1000) throw new Error();
  } catch { return { error: "Enter a valid HTTP or HTTPS cover image URL." } as const; }
  return { data: { title, description, subtitle, image_url, price, seats, luggage } } as const;
}
