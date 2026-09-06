import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../PageShell";
import { getListings } from "@/lib/listings/queries";
import { estimatePlan, money, planPath, readPlan, type PlanParams } from "@/lib/planner/plan";
import PlanActions from "./PlanActions";

export const metadata: Metadata = { title: "Free Trip Planner | Tourz", description: "Plan your days, estimate your trip budget, and share your itinerary for free." };

const activities = [
  ["Get your bearings", "Take a self-guided walk near your stay and find your nearest grocery shop.", "Leave time to relax and watch the sunset from a public viewpoint."],
  ["Explore at your own pace", "Browse a local market; purchases are optional.", "Take a photo walk through public streets and look for local architecture."],
  ["Make room for discovery", "Ask your host about nearby public parks or walking routes with free access.", "Revisit your favourite spot and enjoy a relaxed evening."],
  ["A slower day", "Spend the morning sketching, reading, or taking photos in a public space.", "Explore a different neighbourhood on a self-guided walk."],
  ["Find a local favourite", "Browse local shops and ask for recommendations for your next stop.", "Make time for a sunset stroll near your accommodation."],
  ["Follow your interests", "Choose a favourite walking route or public viewpoint to explore again.", "Set aside a flexible afternoon for discoveries along the way."],
  ["One last look", "Return to a favourite public spot for photos.", "Leave time to pack and prepare for your onward journey."],
];

export default async function PlannerPage({ searchParams }: { searchParams: Promise<PlanParams> }) {
  const params = await searchParams;
  const plan = readPlan(params);
  const estimate = estimatePlan(plan);
  const generated = params.destination !== undefined;
  const categories = ["airbnb", "food", "transport"] as const;
  const results = generated ? await Promise.allSettled(categories.map(category => getListings({ category, search: { where: plan.destination, sort: "price_asc", pageSize: "6" } }))) : [];
  const field = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal focus:outline-2 focus:outline-violet-600";
  return <PageShell>
    <div className="px-5 py-10 sm:px-8 lg:px-14">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-600">Free trip planner · No sign-up needed</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">A little planning.<br />A lot to look forward to.</h1>
        <p className="mt-4 text-lg text-slate-600">Build a simple itinerary, work out your budget, and bring your friends along.</p>
      </div>
      <form action="/plan" className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">Destination<input name="destination" required maxLength={100} defaultValue={plan.destination} className={field} /></label>
          <label className="text-sm font-semibold">Days<input name="days" type="number" min={1} max={7} required defaultValue={plan.days} className={field} /></label>
          <label className="text-sm font-semibold">Travelers<input name="travelers" type="number" min={1} max={12} required defaultValue={plan.travelers} className={field} /></label>
          <label className="text-sm font-semibold">Total group budget (USD)<input name="budget" type="number" min={1} max={100000} required defaultValue={plan.budget} className={field} /></label>
        </div>
        <fieldset className="mt-6">
          <legend className="font-semibold">Set your spending allowances</legend>
          <p className="mt-1 text-sm text-slate-500">Starting estimates, not quotes. Adjust these for your group before planning.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">All accommodation / night (USD)<input name="stay" type="number" min={0} max={10000} required defaultValue={plan.stay} className={field} /></label>
            <label className="text-sm font-semibold">Food / person / day (USD)<input name="food" type="number" min={0} max={1000} required defaultValue={plan.food} className={field} /></label>
            <label className="text-sm font-semibold">Transport / group / day (USD)<input name="transport" type="number" min={0} max={10000} required defaultValue={plan.transport} className={field} /></label>
          </div>
        </fieldset>
        <button className="mt-6 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700">{generated ? "Update my plan" : "Plan your trip for free"}</button>
      </form>
      {!generated ? <p className="mt-8 text-slate-600">Your plan will include daily ideas, a group cost breakdown, and places to browse on Tourz.</p> : <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <h2 className="text-2xl font-bold">Your {plan.days}-day trip to {plan.destination}</h2>
          <p className="mt-2 text-slate-500">{plan.travelers} traveler{plan.travelers === 1 ? "" : "s"} · {estimate.nights} night{estimate.nights === 1 ? "" : "s"}</p>
          <PlanActions path={planPath(plan)} />
          <p className="mt-4 text-sm leading-6 text-slate-600">These flexible, self-guided ideas work as a starting point. Ask locally about access and opening hours; choose public places without admission charges. Meals and transport use your allowances below.</p>
          <div className="mt-6 space-y-4">{activities.slice(0, plan.days).map(([title, morning, evening], index) => <article key={title} className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-bold text-violet-600">Day {index + 1}</p>
            <h3 className="mt-1 text-lg font-bold">{title}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li><strong>Morning:</strong> {morning}</li><li><strong>Afternoon:</strong> Take a lunch break and explore nearby at your own pace. Food allowance: {money(plan.food)} per person for the day.</li><li><strong>Evening:</strong> {evening}</li></ul>
          </article>)}</div>
          <h2 className="mt-10 text-2xl font-bold">Find places for your plan</h2>
          <p className="mt-2 text-sm text-slate-600">Suggestions are separate from your estimate. Check capacity, dates, and final prices before booking, then update your allowances.</p>
          <div className="mt-5 space-y-4">{categories.map((category, index) => {
            const result = results[index];
            const items = result?.status === "fulfilled" ? result.value.items.slice(0, 2) : [];
            const title = category === "airbnb" ? "Stays" : category === "food" ? "Food" : "Transport";
            return <article key={category} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-bold">{title}</h3>
              {items.length ? <ul className="mt-3 space-y-3">{items.map(item => <li key={item.id}><Link className="flex flex-wrap justify-between gap-2 text-sm text-violet-700 underline underline-offset-4" href={`/${category}/${item.id}`}><span>{item.title}</span><span>{item.price}{item.priceSuffix}</span></Link></li>)}</ul> : <p className="mt-2 text-sm text-slate-500">{result?.status === "rejected" ? "Listings are temporarily unavailable. Your itinerary and budget are still ready." : "No published matches for this destination yet."}</p>}
              <Link className="mt-4 inline-block text-sm font-semibold text-violet-700" href={`/${category}?${new URLSearchParams({ where: plan.destination })}`}>Browse {title.toLowerCase()} →</Link>
            </article>;
          })}</div>
        </section>
        <aside className="rounded-2xl bg-violet-50 p-6 lg:sticky lg:top-6">
          <h2 className="text-xl font-bold">Your estimated budget</h2>
          <p className="mt-1 text-sm text-slate-600">USD · Entire group</p>
          <dl className="mt-6 space-y-4 text-sm">
            {[[`Accommodation · ${estimate.nights} nights`, estimate.stay], [`Food · ${plan.days} days × ${plan.travelers} people`, estimate.food], [`Transport · ${plan.days} days`, estimate.transport], ["Self-guided activities", 0]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd className="font-semibold">{money(Number(value))}</dd></div>)}
            <div className="flex justify-between border-t border-violet-200 pt-4 text-lg font-bold"><dt>Estimated total</dt><dd>{money(estimate.total)}</dd></div>
            <div className="flex justify-between"><dt>Per person</dt><dd>{money(estimate.total / plan.travelers)}</dd></div>
          </dl>
          <p className={`mt-5 rounded-xl p-3 text-sm font-semibold ${estimate.remaining >= 0 ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{estimate.remaining >= 0 ? `${money(estimate.remaining)} left in your budget` : `${money(-estimate.remaining)} over budget — adjust your allowances or trip length.`}</p>
          <p className="mt-4 text-xs leading-5 text-slate-600">Includes {estimate.nights} overnight stays. Excludes flights, taxes, booking fees, fuel, shopping, and paid attractions. No availability or reservations are confirmed by this plan.</p>
        </aside>
      </div>}
    </div>
  </PageShell>;
}
