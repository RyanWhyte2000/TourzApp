import type { Metadata } from "next";
import { Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import MarketingPage from "../MarketingPage";

export const metadata: Metadata = { title: "About Us | Tourz" };

export default function AboutPage() {
  return <MarketingPage
    eyebrow="About Tourz"
    title="Travel planning made refreshingly simple"
    description="Tourz brings stays, hotels, local food, and transportation into one trusted place so travelers can spend less time coordinating and more time exploring."
    action={{ label: "Explore stays", href: "/airbnb" }}
    features={[
      { icon: Compass, title: "Everything in one trip", description: "Compare the essentials for your journey without jumping between disconnected services." },
      { icon: ShieldCheck, title: "Trusted experiences", description: "Clear listing information and practical filters help you book with confidence." },
      { icon: HeartHandshake, title: "Built for local connection", description: "We help travelers discover memorable places while supporting local hosts and businesses." },
    ]}
  />;
}
