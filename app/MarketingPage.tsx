import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import PageShell from "./PageShell";

export default function MarketingPage({
  eyebrow,
  title,
  description,
  action,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  features: { icon: LucideIcon; title: string; description: string }[];
}) {
  return (
    <PageShell>
      <div className="px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
          {action && (
            <Link href={action.href} className="mt-8 inline-flex rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
              {action.label}
            </Link>
          )}
        </section>
        <section className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title: featureTitle, description: featureDescription }) => (
            <article key={featureTitle} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Icon className="size-5" /></span>
              <h2 className="mt-5 text-lg font-bold">{featureTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{featureDescription}</p>
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
