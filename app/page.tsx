import Link from "next/link";
import { ArrowRight, Compass, MapPin, Palmtree, UtensilsCrossed, Waves, Mountain, Sparkles, Wallet, Heart } from "lucide-react";
import PageShell from "./PageShell";
import JamaicaSlideshow from "./JamaicaSlideshow";
import { categoryFeatureFlags } from "@/lib/feature-flags";
import styles from "./home.module.css";

const experiences = [
  { id: "beach", icon: Waves, title: "Beach & relaxation", description: "Salt in the air. Nowhere to rush. Make room for a slower kind of day.", detail: "Build a beach day around your stay. Ask your host about nearby beach access, entry fees, and the best time to go.", destination: "Negril, Jamaica", color: "ocean", image: "photo-1507525428034-b723cf961d3e" },
  { id: "culture", icon: UtensilsCrossed, title: "Food & culture", description: "Follow your curiosity, from a local kitchen to the rhythm of the streets.", detail: "Leave time for local food and conversation. Check menus, dietary options, and opening hours before heading out.", destination: "Kingston, Jamaica", color: "gold", image: "photo-1658833608786-22c4b4a621de" },
  { id: "adventure", icon: Mountain, title: "Adventure", description: "Trade your usual view for green hills and a little sense of wonder.", detail: "Plan time outdoors, then confirm transport, access, fitness requirements, and any guide or admission costs locally.", destination: "Ocho Rios, Jamaica", color: "green", image: "photo-1469474968028-56623f02e42e" },
  { id: "discovery", icon: Sparkles, title: "Hidden gems", description: "Take the scenic route. Leave a little space for a local recommendation.", detail: "Ask your host for a favourite nearby spot. Check the journey time and return transport before adding it to your day.", destination: "Port Antonio, Jamaica", color: "clay", image: "photo-1510414842594-a61c69b5ae57" },
];
const faqs = [
  ["Can I arrange pickup from my hotel?", "Browse transport options and enter your pickup and drop-off locations. Confirm the exact meeting point, pickup time, luggage space, and any additional charges with the provider. Hotel pickup is not automatically included."],
  ["Which currency are prices shown in?", "Booking prices and trip-planner estimates are shown in US dollars (USD). Review the service fee and total at checkout. Payment is arranged with the provider, so confirm the accepted currency and payment method before you travel."],
  ["Is this suitable for children?", "Suitability varies by stay, restaurant, transport service, and activity. Confirm age limits, child pricing, car seats, and accessibility requirements with the provider before reserving."],
  ["What should I bring?", "Start with comfortable clothing, sun protection, water, and footwear suited to your plans. Ask the provider about equipment, dress requirements, and anything specific to your visit."],
  ["What is included, and can I cancel?", "Read the listing highlights and price details, then confirm inclusions, timings, and cancellation terms with the provider before reserving. Transport, meals, guides, and attraction entry should only be assumed included when explicitly confirmed."],
];

export default function HomePage() {
  const browseLinks = [
    { key: "airbnb", label: "Find a stay", href: "/airbnb" },
    { key: "local-driver", label: "Find a local driver", href: "/local-driver" },
    { key: "food", label: "Explore food", href: "/food" },
    { key: "transport", label: "Rent a car", href: "/transport" },
  ] as const;
  return (
    <PageShell showSearch={false}>
      <div className={styles.home}>
        <JamaicaSlideshow>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}><span className={styles.flag} aria-hidden="true" /> A little more local. A lot more Jamaica.</p>
            <h1 id="welcome-title">Experience Jamaica<br />beyond the <em>resort.</em></h1>
            <p className={styles.heroDescription}>Come feel the island. Discover places to stay, local flavours, and new adventures. Build a Jamaican trip that feels like you.</p>
            <div className={styles.actions}>
              <a href="#experiences" className={styles.primary}>Explore experiences <ArrowRight size={17} /></a>
              <a href="#find-your-place" className={styles.secondary}><MapPin size={17} /> Find your corner of Jamaica</a>
            </div>
          </div>
          </JamaicaSlideshow>

        <div className={styles.welcomeStrip}>
          <span><Palmtree /> Island stays & local flavours</span><span><Wallet /> Plan your budget in USD</span><span><Heart /> Make it your kind of trip</span>
        </div>

        <section id="experiences" className={styles.section}>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>One island. So many ways to feel it.</p><h2>What brings you to Jamaica?</h2></div><p>Start with a feeling.<br />We’ll help you make a plan.</p></div>
          <div className={styles.experienceGrid}>
            {experiences.map(({ id, icon: Icon, title, description, color, image }, index) => <a href={`#${id}`} className={`${styles.experienceCard} ${styles[color]}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(12, 43, 35, .18), rgba(12, 43, 35, .84)), url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=80)` }} key={id}><div className={styles.cardTop}><Icon size={34} strokeWidth={1.3} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{description}</p><span className={styles.cardAction}>Find your inspiration <ArrowRight size={18} /></span></a>)}
          </div>
        </section>

        <section id="find-your-place" className={`${styles.section} ${styles.findSection}`}>
          <div><p className={styles.kicker}>From first idea to island time</p><h2>Your Jamaica starts here.</h2><p className={styles.bodyCopy}>Find a place to call home, something good to eat, and a way to get there.</p></div>
          <div><form action="/plan" className={styles.destinationForm}><label htmlFor="destination">Where are you staying?</label><div><select id="destination" name="destination" defaultValue="Montego Bay, Jamaica">{["Montego Bay", "Negril", "Ocho Rios", "Kingston", "Port Antonio"].map(place => <option key={place} value={`${place}, Jamaica`}>{place}</option>)}</select><button type="submit">Plan nearby <ArrowRight size={17} /></button></div><p>Start a free itinerary with a budget you can adjust.</p></form><div className={styles.browseLinks}>{browseLinks.filter(link => link.key === "local-driver" || categoryFeatureFlags[link.key]).map(link => <Link key={link.key} href={link.href}>{link.label} <ArrowRight size={14} /></Link>)}</div></div>
        </section>

        <section className={styles.section} aria-labelledby="inspiration-title"><p className={styles.kicker}>A little inspiration</p><h2 id="inspiration-title">Less rushing. More discovering.</h2><div className={styles.ideaGrid}>{experiences.map(({ id, icon: Icon, title, detail, destination }) => <article id={id} key={id} className={styles.idea}><Icon size={23} /><div><h3>{title}</h3><p>{detail}</p><Link href={`/plan?${new URLSearchParams({ destination })}`}>Plan time in {destination.replace(", Jamaica", "")} <ArrowRight size={15} /></Link></div></article>)}</div><p className={styles.note}>Ideas to shape your itinerary. Guided activities and attraction tickets are not booked through these plans.</p></section>

        <section className={styles.planBanner}><Compass size={48} strokeWidth={1.2} /><div><p className={styles.kicker}>Your pace. Your people. Your plan.</p><h2>A little planning. A lot of Jamaica.</h2><p>Daily ideas, a simple group budget, and an itinerary to share.</p></div><Link href="/plan" className={styles.primary}>Plan my trip for free <ArrowRight size={17} /></Link></section>

        <section className={`${styles.section} ${styles.faqSection}`}><div><p className={styles.kicker}>Feel ready before you arrive</p><h2>First time here?<br />You’re in the right place.</h2><p className={styles.bodyCopy}>A few details make all the difference.</p><Link href="/help" className={styles.helpLink}>Visit the help centre <ArrowRight size={16} /></Link></div><div className={styles.faqs}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
        <footer className={styles.footer}><Link href="/" className={styles.footerBrand}><Palmtree size={22} /> Tourz <span>Made for your Jamaica.</span></Link><div><Link href="/about">Our story</Link><Link href="/become-a-host">Become a host</Link><Link href="/help">Get in touch</Link></div><span>Jamaica, with a little more heart.</span></footer>
      </div>
    </PageShell>
  );
}
