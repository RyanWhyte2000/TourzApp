import type { Metadata } from "next";
import { BookOpen, LifeBuoy, MessageCircle } from "lucide-react";
import MarketingPage from "../MarketingPage";

export const metadata: Metadata = { title: "Help Center | Tourz" };

export default function HelpPage() {
  return <MarketingPage
    eyebrow="Help Center"
    title="How can we help?"
    description="Find guidance for searching, saving favorites, managing your account, and preparing for a smooth trip."
    action={{ label: "Sign in for account help", href: "/login" }}
    features={[
      { icon: BookOpen, title: "Booking guidance", description: "Learn how to compare listings, use filters, and understand pricing before you reserve." },
      { icon: MessageCircle, title: "Account support", description: "Get help signing in, resetting your password, and keeping your saved listings organized." },
      { icon: LifeBuoy, title: "Trip assistance", description: "Find the information you need when plans change or you need help during your journey." },
    ]}
  />;
}
