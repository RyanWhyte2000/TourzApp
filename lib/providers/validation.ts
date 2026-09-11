import { isProviderType, providerDefinitions } from "./types";

export function parseProviderProfile(form: FormData) {
  const type = form.get("provider_type");
  if (!isProviderType(type)) return { error: "Choose a valid provider type." } as const;
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const display_name = text("display_name");
  const description = text("description");
  const location = text("location");
  const contact_email = text("contact_email");
  const phone = text("phone");
  const website = text("website");
  if (display_name.length < 2 || display_name.length > 160) return { error: "Enter a name between 2 and 160 characters." } as const;
  if (location.length < 2 || location.length > 200) return { error: "Enter your location or service area (up to 200 characters)." } as const;
  if (description.length > 2000 || phone.length > 40) return { error: "Keep the description under 2,000 characters and the phone number under 40." } as const;
  if (contact_email && (contact_email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))) return { error: "Enter a valid contact email." } as const;
  if (website) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol) || website.length > 500) throw new Error();
    } catch { return { error: "Enter a website starting with https:// or http://." } as const; }
  }
  const details: Record<string, string> = {};
  for (const field of providerDefinitions[type].fields) {
    const value = text(field.name);
    if (value.length > 300) return { error: `Keep ${field.label.toLowerCase()} under 300 characters.` } as const;
    details[field.name] = value;
  }
  return { data: { provider_type: type, display_name, description, location, contact_email, phone, website, details } } as const;
}
