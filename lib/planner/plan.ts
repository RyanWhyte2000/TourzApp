export type PlanParams = Record<string, string | string[] | undefined>;

export function readPlan(params: PlanParams) {
  const first = (key: string) => Array.isArray(params[key]) ? params[key][0] : params[key];
  const number = (key: string, fallback: number, min: number, max: number) => {
    const raw = first(key);
    const value = raw?.trim() ? Number(raw) : NaN;
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
  };
  return {
    destination: first("destination")?.trim().slice(0, 100) || "Montego Bay, Jamaica",
    days: number("days", 3, 1, 7),
    travelers: number("travelers", 2, 1, 12),
    budget: number("budget", 1000, 1, 100000),
    stay: number("stay", 150, 0, 10000),
    food: number("food", 30, 0, 1000),
    transport: number("transport", 40, 0, 10000),
  };
}

export type TripPlan = ReturnType<typeof readPlan>;

export function estimatePlan(plan: TripPlan) {
  const nights = plan.days - 1;
  const stay = nights * plan.stay;
  const food = plan.days * plan.travelers * plan.food;
  const transport = plan.days * plan.transport;
  const total = stay + food + transport;
  return { nights, stay, food, transport, total, remaining: plan.budget - total };
}

export function planPath(plan: TripPlan) {
  return `/plan?${new URLSearchParams(Object.entries(plan).map(([key, value]) => [key, String(value)]))}`;
}

export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
