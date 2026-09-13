"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, MapPin, Pause, Play } from "lucide-react";
import styles from "./home.module.css";

const slides = [
  { image: "photo-1577409844373-8ccb44dffa93", location: "Bloody Bay, Jamaica", description: "Turquoise water and sandy shoreline at Bloody Bay, Jamaica", photographer: "Josh Eaton", source: "o_1YoU7S_tQ" },
  { image: "photo-1707571854070-72028840176b", location: "Negril, Jamaica", description: "Boats floating on the water in Negril, Jamaica", photographer: "Tom Podmore", source: "CDTL4Wtyi8w" },
  { image: "photo-1744378482518-67a772c52d4b", location: "Ocho Rios, Jamaica", description: "Aerial view of Ocho Rios and its coastline in Jamaica", photographer: "Leon Campbell", source: "AxeNlLIq9jA" },
];

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function JamaicaSlideshow({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [playback, setPlayback] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const playing = playback ?? !reducedMotion;
  const slide = slides[active];

  useEffect(() => {
    if (!playing || hovered || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(current => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused]);

  function selectSlide(index: number) {
    setActive((index + slides.length) % slides.length);
    setPlayback(false);
  }

  return (
    <section className={styles.hero} aria-labelledby="welcome-title" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {slides.map((item, index) => <div key={item.image} role="img" aria-label={item.description} aria-hidden={index !== active}
        className={`${styles.heroPhoto} ${index === active ? styles.activePhoto : ""}`}
        style={{ backgroundImage: `url(https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=2000&q=85)` }} />)}
      {children}
      <div className={styles.slideshowFooter}>
        <div className={styles.slideControls} role="group" aria-label="Jamaica slideshow controls">
          <button type="button" onClick={() => selectSlide(active - 1)} aria-label="Previous Jamaica photo"><ChevronLeft size={18} /></button>
          {slides.map((item, index) => <button type="button" key={item.image} className={styles.slideDot} aria-label={`Show ${item.location}`} aria-pressed={index === active} onClick={() => selectSlide(index)}><span /></button>)}
          <button type="button" onClick={() => selectSlide(active + 1)} aria-label="Next Jamaica photo"><ChevronRight size={18} /></button>
          <button type="button" onClick={() => setPlayback(!playing)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        </div>
        <div className={styles.slideCaption} aria-live={playing ? "off" : "polite"} aria-atomic="true"><span><MapPin size={14} /> {slide.location} · {active + 1} / {slides.length}</span><a href={`https://unsplash.com/photos/${slide.source}`} target="_blank" rel="noreferrer">Photo: {slide.photographer} / Unsplash</a></div>
      </div>
    </section>
  );
}
