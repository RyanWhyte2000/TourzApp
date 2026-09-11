import type { Metadata } from "next";
import { BadgeDollarSign, CalendarCheck, UsersRound } from "lucide-react";
import MarketingPage from "../MarketingPage";

export const metadata: Metadata = { title: "Become a Host | Tourz" };

export default function BecomeAHostPage() {
  return <MarketingPage
    eyebrow="Host with Tourz"
    title="Turn what you offer into someone’s best trip"
    description="Join as a Driver, Hotel Owner, Car Rental Company, Airbnb Owner, or Restaurant Owner. Set up your dedicated profile and connect with travelers."
    action={{ label: "Choose your provider type", href: "/host/profiles" }}
    features={[
      { icon: UsersRound, title: "Reach more travelers", description: "Put your offering in front of guests actively planning every part of their trip." },
      { icon: CalendarCheck, title: "Stay in control", description: "Manage availability, listing details, and upcoming requests from one account." },
      { icon: BadgeDollarSign, title: "Grow your business", description: "Present transparent pricing and build a reputation through great guest experiences." },
    ]}
  />;
}
