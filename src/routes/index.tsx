import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import {
  ArrowRight,
  Calendar,
  Headphones,
  Instagram,
  Loader2,
  Lock,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import heroImage from "../assets/dj-hero.jpg";
import logoAsset from "../assets/dj-palme-logo.png.asset.json";
import { sendBookingRequest } from "@/lib/booking.functions";

// --- DJ-Daten -----------------------------------------
const DJ_NAME = "DJ_Palme";
const DJ_TAGLINE = "Elektronische Beats für die Nacht";
const DJ_EMAIL = "fabian@drabner.de";
const INSTAGRAM_URL = "https://instagram.com/dj_palme_0fficial";
const INSTAGRAM_HANDLE = "@dj_palme_0fficial";
const ADMIN_PASSWORD = "23699.DJ_Palmeweb";

type Gig = { date: string; venue: string; city: string };
const DEFAULT_GIGS: Gig[] = [
  { date: "2026-08-14", venue: "Sommerfest", city: "Berlin" },
  { date: "2026-09-02", venue: "Schulparty", city: "Hamburg" },
  { date: "2026-09-22", venue: "Jugendclub", city: "München" },
];
const GIGS_STORAGE_KEY = "dj_palme_gigs_v1";
// ------------------------------------------------------

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${DJ_NAME} — Elektronische Beats für die Nacht` },
      {
        name: "description",
        content: `Offizielle Website von ${DJ_NAME}. Kommende Events, Mixes und kostenlose Buchungsanfragen.`,
      },
      { property: "og:title", content: `${DJ_NAME} — Elektronische Beats für die Nacht` },
      {
        property: "og:description",
        content: `Offizielle Website von ${DJ_NAME}. Kommende Events, Mixes und kostenlose Buchungsanfragen.`,
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>(DEFAULT_GIGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GIGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Gig[];
        if (Array.isArray(parsed)) setGigs(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(gigs));
    } catch {
      // ignore
    }
  }, [gigs, loaded]);

  const sorted = [...gigs].sort((a, b) => a.date.localeCompare(b.date));
  return { gigs: sorted, setGigs };
}

function Index() {
  const { gigs, setGigs } = useGigs();
  const [adminOpen, setAdminOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onAdminClick={() => setAdminOpen(true)}
        onBookClick={() => setBookingOpen(true)}
      />
      <main>
        <Hero onBookClick={() => setBookingOpen(true)} />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <BioCard />
            </div>
            <div className="lg:col-span-5">
              <GigsCard gigs={gigs} onBookClick={() => setBookingOpen(true)} />
            </div>
          </div>
        </section>
        {gigs.length > 0 && (
          <NextGigFeature next={gigs[0]} onBookClick={() => setBookingOpen(true)} />
        )}
        <ContactSection onBookClick={() => setBookingOpen(true)} />
      </main>
      <Footer />
      {adminOpen && (
        <AdminModal
          gigs={gigs}
          onSave={setGigs}
          onClose={() => setAdminOpen(false)}
        />
      )}
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </div>
  );
}

function Header({
  onAdminClick,
  onBookClick,
}: {
  onAdminClick: () => void;
  onBookClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Versteckter Admin-Button in der oberen rechten Ecke */}
      <button
        type="button"
        onClick={onAdminClick}
        aria-label="Admin"
        title=""
        className="absolute right-0 top-0 z-50 h-6 w-6 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
      >
        <span className="sr-only">Admin</span>
        <Lock className="h-3 w-3 text-muted-foreground" />
      </button>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt={`${DJ_NAME} Logo`}
            className="h-10 w-10 rounded-md object-contain sm:h-11 sm:w-11"
            width={44}
            height={44}
          />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            {DJ_NAME}
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#events" className="transition-colors hover:text-foreground">Events</a>
          <a href="#about" className="transition-colors hover:text-foreground">Über mich</a>
          <a href="#booking" className="transition-colors hover:text-foreground">Booking</a>
        </nav>
        <button
          type="button"
          onClick={onBookClick}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Kostenlos buchen</span>
        </button>
      </div>
    </header>
  );
}

function Hero({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="DJ-Turntables und Mixer mit Neonlicht"
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
          Jetzt kostenlos buchbar
        </span>
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          {DJ_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
          {DJ_TAGLINE}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 glow-indigo"
          >
            <Headphones className="h-4 w-4" />
            {DJ_NAME} buchen
          </button>
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
          Über mich
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Musik zuerst. Immer.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Ich bin {DJ_NAME}, ein junger DJ aus Kürten. Auch wenn ich erst 13 Jahre alt bin,
          brenne ich schon jetzt für elektronische Musik – von Uptempo bis zu EDM.
          Jedes Set ist für mich eine Reise durch Rhythmus und Energie.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Ob Geburtstagsfeier, Schulparty, Jugendclub oder privates Event – ich bringe die richtige
          Stimmung auf den Dancefloor. Alle Buchungen sind aktuell komplett kostenlos, weil ich vor
          allem Erfahrung sammeln möchte.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {["House", "Electronic", "Party", "Club"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function GigsCard({ gigs, onBookClick }: { gigs: Gig[]; onBookClick: () => void }) {
  return (
    <article id="events" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Kommende Events
        </span>
        <button
          type="button"
          onClick={onBookClick}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Anfragen
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {gigs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aktuell sind keine Events geplant. Schreib mir gerne für eine Buchung!
          </p>
        )}
        {gigs.map((gig) => (
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
          </div>
        ))}
      </div>
    </article>
  );
}

function NextGigFeature({ next, onBookClick }: { next: Gig; onBookClick: () => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-card p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-widest text-primary">
              Nächstes Event
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
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Kostenlos anfragen
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 lg:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Booking & Kontakt
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lass uns zusammen etwas Cooles machen
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Geburtstage, Schulpartys, Jugendclubs, private Events — schreib mir für eine Anfrage.
            Alle Buchungen sind aktuell <span className="font-bold text-foreground">komplett kostenlos</span>,
            weil ich Erfahrung sammeln möchte.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onBookClick}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 glow-indigo"
            >
              <Mail className="h-4 w-4" />
              Jetzt kostenlos anfragen
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Instagram className="h-4 w-4" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Antwort meistens innerhalb von 48 Stunden.
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
        <div className="flex items-center gap-2">
          <img
            src={logoAsset.url}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded-md object-contain"
            width={32}
            height={32}
          />
          <p className="font-display text-sm font-bold text-foreground">{DJ_NAME}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {DJ_NAME}. Alle Rechte vorbehalten.
        </p>
        <div className="flex items-center gap-4">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href={`mailto:${DJ_EMAIL}`} className="text-muted-foreground transition-colors hover:text-foreground" aria-label="E-Mail">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function AdminModal({
  gigs,
  onSave,
  onClose,
}: {
  gigs: Gig[];
  onSave: (g: Gig[]) => void;
  onClose: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<Gig[]>(gigs);
  const [newGig, setNewGig] = useState<Gig>({ date: "", venue: "", city: "" });

  useEffect(() => {
    setDraft(gigs);
  }, [gigs]);

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function removeGig(idx: number) {
    setDraft((d) => d.filter((_, i) => i !== idx));
  }

  function addGig() {
    if (!newGig.date || !newGig.venue || !newGig.city) return;
    setDraft((d) => [...d, newGig]);
    setNewGig({ date: "", venue: "", city: "" });
  }

  function saveAll() {
    onSave(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!unlocked ? (
          <form onSubmit={submitPassword} className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">Admin-Bereich</h2>
            </div>
            <p className="text-sm text-muted-foreground">Bitte Passwort eingeben, um Events zu bearbeiten.</p>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            {error && <p className="text-sm text-red-400">Falsches Passwort.</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entsperren
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">Events verwalten</h2>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {draft.length === 0 && (
                <p className="text-sm text-muted-foreground">Noch keine Events.</p>
              )}
              {draft.map((g, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-md border border-border bg-background p-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{g.date}</span>
                  <span className="flex-1 truncate text-foreground">{g.venue} — {g.city}</span>
                  <button
                    type="button"
                    onClick={() => removeGig(idx)}
                    aria-label="Löschen"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background p-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Neues Event</p>
              <input
                type="date"
                value={newGig.date}
                onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Location (z.B. Sommerfest)"
                value={newGig.venue}
                onChange={(e) => setNewGig({ ...newGig, venue: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Stadt"
                value={newGig.city}
                onChange={(e) => setNewGig({ ...newGig, city: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addGig}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
                Hinzufügen
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={saveAll}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  eventType: string;
  guests: string;
  message: string;
};

const EMPTY_BOOKING: BookingForm = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  eventType: "",
  guests: "",
  message: "",
};

function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<BookingForm>(EMPTY_BOOKING);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function update<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await sendBookingRequest({ data: form });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
      );
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors";
  const labelClass =
    "block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Anfrage gesendet!</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Vielen Dank für deine Anfrage. Ich melde mich meistens innerhalb von 48 Stunden per
              E-Mail bei dir.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Schließen
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-bold text-foreground">
                  Kostenlose Buchungsanfrage
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Fülle das Formular aus — deine Anfrage geht direkt an {DJ_EMAIL}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name</label>
                <input required maxLength={100} className={inputClass}
                  value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>E-Mail</label>
                <input required type="email" maxLength={255} className={inputClass}
                  value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Telefonnummer</label>
                <input required type="tel" maxLength={50} className={inputClass}
                  value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Gästeanzahl</label>
                <input required inputMode="numeric" maxLength={50} className={inputClass}
                  placeholder="z.B. 50"
                  value={form.guests} onChange={(e) => update("guests", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Datum</label>
                <input required type="date" className={inputClass}
                  value={form.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Uhrzeit</label>
                <input required type="time" className={inputClass}
                  value={form.time} onChange={(e) => update("time", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Veranstaltungsort</label>
                <input required maxLength={200} className={inputClass}
                  placeholder="Adresse oder Location"
                  value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Art des Events</label>
                <input required maxLength={100} className={inputClass}
                  placeholder="z.B. Geburtstag, Schulparty, Jugendclub"
                  value={form.eventType} onChange={(e) => update("eventType", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Nachricht (optional)</label>
                <textarea rows={4} maxLength={2000} className={inputClass}
                  value={form.message} onChange={(e) => update("message", e.target.value)} />
              </div>
            </div>

            {status === "error" && error && (
              <div className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 glow-indigo"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sende…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Anfrage senden
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
