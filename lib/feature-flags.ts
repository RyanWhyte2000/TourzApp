// Public flags are baked into the client bundle; rebuild after changing them.
// Unset flags preserve the existing navigation. Set a flag to false to hide it.
export const categoryFeatureFlags = {
  transport: process.env.NEXT_PUBLIC_FEATURE_TRANSPORT !== "false",
  airbnb: process.env.NEXT_PUBLIC_FEATURE_AIRBNB !== "false",
  food: process.env.NEXT_PUBLIC_FEATURE_FOOD !== "false",
  hotel: process.env.NEXT_PUBLIC_FEATURE_HOTEL !== "false",
} as const;

export type FeatureCategory = keyof typeof categoryFeatureFlags;
