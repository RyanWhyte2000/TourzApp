import type { Metadata } from "next";
import { BadgeDollarSign, CalendarCheck, UsersRound } from "lucide-react";
import MarketingPage from "../MarketingPage";

export const metadata: Metadata = { title: "Become a Host | Tourz" };

export default function BecomeAHostPage() {
  return <MarketingPage
    eyebrow="Host with Tourz"
    title="Turn what you offer into someone’s best trip"
    description="List a home, hotel, restaurant, or transport service and connect with travelers looking for authentic, dependable experiences."
    action={{ label: "Start listing", href: "/host/onboarding" }}
    features={[
      { icon: UsersRound, title: "Reach more travelers", description: "Put your offering in front of guests actively planning every part of their trip." },
      { icon: CalendarCheck, title: "Stay in control", description: "Manage availability, listing details, and upcoming requests from one account." },
      { icon: BadgeDollarSign, title: "Grow your business", description: "Present transparent pricing and build a reputation through great guest experiences." },
    ]}
  />;
}
