import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import {
  ArrowRight,
  Calendar,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Music,
  Ticket,
} from "lucide-react";

import heroImage from "../assets/dj-hero.jpg";

// --- Einfach anpassen: Deine DJ-Daten ----------------
const DJ_NAME = "DJ NOVA";
const DJ_TAGLINE = "Electronic beats for the night";
const DJ_EMAIL = "booking@djnova.de";
const INSTAGRAM_URL = "https://instagram.com/djnova";
const SOUNDCLOUD_URL = "https://soundcloud.com/djnova";

const GIGS = [
  { date: "2026-08-14", venue: "Warehouse Club", city: "Berlin", tickets: "#" },
  { date: "2026-09-02", venue: "Rooftop Sessions", city: "Hamburg", tickets: "#" },
  { date: "2026-09-22", venue: "Basement Floor", city: "München", tickets: "#" },
];
// -----------------------------------------------------

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${DJ_NAME} — Electronic Beats for the Night` },
      {
        name: "description",
        content: `Offizielle Website von ${DJ_NAME}. Upcoming gigs, mixes und booking.`,
      },
      { property: "og:title", content: `${DJ_NAME} — Electronic Beats for the Night` },
      {
        property: "og:description",
        content: `Offizielle Website von ${DJ_NAME}. Upcoming gigs, mixes und booking.`,
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <BioCard />
            </div>
            <div className="lg:col-span-5">
              <GigsCard />
            </div>
          </div>
        </section>
        <NextGigFeature />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="font-display text-lg font-bold tracking-tight text-foreground">
          {DJ_NAME}
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#gigs" className="transition-colors hover:text-foreground">
            Gigs
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            About
          </a>
          <a href="#booking" className="transition-colors hover:text-foreground">
            Booking
          </a>
        </nav>
        <a
          href={`mailto:${DJ_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Book now</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={`${DJ_NAME} performing in a club with neon lights`}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Now booking for 2026
        </span>
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          {DJ_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
          {DJ_TAGLINE}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 glow-indigo"
          >
            <Headphones className="h-4 w-4" />
            Book {DJ_NAME}
          </a>
          <a
            href={SOUNDCLOUD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Music className="h-4 w-4" />
            Listen to mixes
          </a>
        </div>
      </div>
    </section>
  );
}

function BioCard() {
  return (
    <article id="about" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
      <div className="relative">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          About
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Sound first. Always.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {DJ_NAME} ist ein aufstrebender DJ aus Deutschland mit einem Fokus auf elektronische
          Clubmusik. Von tiefen House-Grooves bis zu treibenden Techno-Beats: jedes Set ist eine
          Reise durch Nacht und Rhythmus.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Ob Club, Festival oder private Veranstaltung — {DJ_NAME} bringt die richtige Energie auf
          die Bühne und lässt den Dancefloor nicht zur Ruhe kommen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            House
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            Techno
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            Electronic
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            Club
          </span>
        </div>
      </div>
    </article>
  );
}

function GigsCard() {
  return (
    <article id="gigs" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Upcoming Gigs
        </span>
        <a
          href="#booking"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Alle anfragen
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-6 space-y-4">
        {GIGS.map((gig) => (
          <div
            key={`${gig.date}-${gig.venue}`}
            className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border border-border bg-card text-center">
              <span className="font-display text-xs font-bold uppercase text-muted-foreground">
                {format(parseISO(gig.date), "MMM", { locale: de })}
              </span>
              <span className="font-display text-xl font-bold text-foreground">
                {format(parseISO(gig.date), "d", { locale: de })}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-foreground">{gig.venue}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {gig.city}
              </div>
            </div>
            <a
              href={gig.tickets}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Ticket className="h-3.5 w-3.5" />
              Tickets
            </a>
          </div>
        ))}
      </div>
    </article>
  );
}

function NextGigFeature() {
  const next = GIGS[0];
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-card p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-widest text-primary">
              Next Show
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {next.venue}, {next.city}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                {format(parseISO(next.date), "EEEE, dd. MMMM yyyy", { locale: de })}
              </span>
            </div>
          </div>
          <a
            href={next.tickets}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Ticket className="h-4 w-4" />
            Tickets sichern
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 lg:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Booking & Kontakt
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lass uns zusammen arbeiten
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Clubs, Festivals, Private Events oder Podcasts — schreib mir für Buchungsanfragen,
            Pressetexte und Rider.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${DJ_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 glow-indigo"
            >
              <Mail className="h-4 w-4" />
              {DJ_EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Antwort innerhalb von 48 Stunden.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-display text-sm font-bold text-foreground">{DJ_NAME}</p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {DJ_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={SOUNDCLOUD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="SoundCloud"
          >
            <Music className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${DJ_EMAIL}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
