import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tourz",
  description: "A polished travel planner for stays, attractions, and rides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full font-sans antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
