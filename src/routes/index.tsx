import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

function safeFormat(dateStr: string | null | undefined, pattern: string) {
  if (!dateStr) return "";
  try {
    const d = parseISO(dateStr);
    if (isNaN(d.getTime())) return "";
    return format(d, pattern, { locale: de });
  } catch {
    return "";
  }
}
import {
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import heroImage from "../assets/dj-hero.jpg";
import logoAsset from "../assets/dj-palme-logo.svg.asset.json";
import { sendBookingRequest } from "@/lib/booking.functions";
import { addGig, deleteGig, listGigs, verifyAdminPassword, type Gig } from "@/lib/gigs.functions";

// --- DJ-Daten -----------------------------------------
const DJ_NAME = "DJ_Palme";
const DJ_TAGLINE = "Elektronische Beats für die Nacht";
const DJ_EMAIL = "fabian@drabner.de";
const INSTAGRAM_URL = "https://instagram.com/dj_palme_0fficial";
const INSTAGRAM_HANDLE = "@dj_palme_0fficial";
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

function Index() {
  const { data: gigs = [] } = useQuery({
    queryKey: ["gigs"],
    queryFn: () => listGigs(),
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const upcoming = gigs.filter((g) => g.status === "upcoming");
  const past = [...gigs.filter((g) => g.status === "past")].reverse();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onAdminClick={() => setAdminOpen(true)}
        onBookClick={() => setBookingOpen(true)}
      />
      <main>
        <Hero onBookClick={() => setBookingOpen(true)} />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <BioCard />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GigsColumn
              title="Kommende Events"
              gigs={upcoming}
              onSelect={setSelectedGig}
              onBookClick={() => setBookingOpen(true)}
              tone="upcoming"
              emptyText="Aktuell keine Events geplant. Schreib mir für eine Buchung!"
            />
            <GigsColumn
              title="Vergangene Events"
              gigs={past}
              onSelect={setSelectedGig}
              tone="past"
              emptyText="Noch keine vergangenen Events dokumentiert."
            />
          </div>
        </section>
        {upcoming.length > 0 && (
          <NextGigFeature next={upcoming[0]} onBookClick={() => setBookingOpen(true)} />
        )}
        <ContactSection onBookClick={() => setBookingOpen(true)} />
      </main>
      <Footer />
      {adminOpen && (
        <AdminModal gigs={gigs} onClose={() => setAdminOpen(false)} />
      )}
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
      {selectedGig && (
        <GigDetailModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
      )}
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
            className="h-10 w-10 object-contain sm:h-11 sm:w-11 drop-shadow-[0_0_12px_oklch(0.511_0.230_276.966_/_0.5)]"
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
          className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
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
            className="btn-fx inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 glow-indigo"
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
          brenne ich schon jetzt für harte elektronische Musik – von Uptempo und Hardtechno über
          Techno bis EDM. Jedes Set ist eine Reise durch Bass, Rhythmus und Energie.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Ob Club, Rave, Geburtstagsparty oder privates Event – ich bringe den Dancefloor zum Kochen.
          Alle Buchungen sind aktuell komplett kostenlos, weil ich vor allem Erfahrung sammeln möchte.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Uptempo", "Hardtechno", "Techno", "EDM", "Club", "Party"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function GigsColumn({
  title,
  gigs,
  onSelect,
  onBookClick,
  tone,
  emptyText,
}: {
  title: string;
  gigs: Gig[];
  onSelect: (g: Gig) => void;
  onBookClick?: () => void;
  tone: "upcoming" | "past";
  emptyText: string;
}) {
  return (
    <article
      id={tone === "upcoming" ? "events" : undefined}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        {onBookClick && (
          <button
            type="button"
            onClick={onBookClick}
            className="btn-fx inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
          >
            Anfragen
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="mt-6 space-y-4">
        {gigs.length === 0 && (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
        {gigs.map((gig) => (
          <button
            key={gig.id}
            type="button"
            onClick={() => onSelect(gig)}
            className={`card-lift group flex w-full items-start gap-4 rounded-xl border border-border bg-background p-4 text-left ${
              tone === "past" ? "opacity-80 hover:opacity-100" : ""
            }`}
          >
            {gig.image_url ? (
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card transition-colors group-hover:border-primary/50">
                <img
                  src={gig.image_url}
                  alt={gig.venue}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-background/80 py-0.5 text-center backdrop-blur-sm">
                  <span className="font-display text-[10px] font-bold uppercase text-foreground leading-none">
                    {safeFormat(gig.date, "d. MMM")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-card text-center transition-colors group-hover:border-primary/50">
                <span className="font-display text-xs font-bold uppercase text-muted-foreground">
                  {safeFormat(gig.date, "MMM")}
                </span>
                <span className="font-display text-xl font-bold text-foreground">
                  {safeFormat(gig.date, "d")}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-foreground">{gig.venue}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {gig.city}
                </span>
                {gig.time && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {gig.time}
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </article>
  );
}

function GigDetailModal({ gig, onClose }: { gig: Gig; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-300"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="btn-fx fixed right-4 top-4 z-20 rounded-full border border-border bg-background/90 p-2 text-muted-foreground shadow-lg backdrop-blur-sm hover:text-foreground sm:absolute"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative border-b border-border bg-gradient-to-br from-secondary via-card to-card p-6 sm:p-10">
          {gig.image_url && (
            <img
              src={gig.image_url}
              alt={gig.venue}
              className="mb-6 h-48 w-full rounded-xl border border-border object-cover sm:h-64"
            />
          )}
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex items-start gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background text-center glow-indigo">
              <span className="font-display text-xs font-bold uppercase text-muted-foreground">
                {safeFormat(gig.date, "MMM")}
              </span>
              <span className="font-display text-3xl font-bold text-foreground leading-none">
                {safeFormat(gig.date, "d")}
              </span>
              <span className="font-display text-[10px] text-muted-foreground">
                {safeFormat(gig.date, "yyyy")}
              </span>
            </div>
            <div className="flex-1 pr-8">
              <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                gig.status === "upcoming"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}>
                {gig.status === "upcoming" ? "Kommend" : "Vergangen"}
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {gig.venue}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {gig.city}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow
              icon={<Calendar className="h-4 w-4" />}
              label="Datum"
              value={safeFormat(gig.date, "EEEE, dd. MMMM yyyy")}
            />
            {gig.time && (
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Uhrzeit"
                value={gig.time}
              />
            )}
            {gig.address && (
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Adresse"
                value={gig.address}
                className="sm:col-span-2"
              />
            )}
          </div>

          {gig.description && (
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Beschreibung
              </span>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {gig.description}
              </p>
            </div>
          )}

          {gig.location_info && (
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Zur Location
              </span>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {gig.location_info}
              </p>
            </div>
          )}

          {gig.location_link && (
            <a
              href={gig.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fx inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" />
              Location öffnen
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-background p-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-sm text-foreground">{value}</p>
    </div>
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
                {safeFormat(next.date, "EEEE, dd. MMMM yyyy")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onBookClick}
            className="btn-fx inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 glow-indigo"
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
              className="btn-fx inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 glow-indigo"
            >
              <Mail className="h-4 w-4" />
              Jetzt kostenlos anfragen
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fx inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-accent"
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
            className="h-8 w-8 object-contain"
            width={32}
            height={32}
          />
          <p className="font-display text-sm font-bold text-foreground">{DJ_NAME}</p>
        </div>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-center">
          <p>© {new Date().getFullYear()} {DJ_NAME}. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-4">
            <Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          </div>
        </div>
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
  onClose,
}: {
  gigs: Gig[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [newGig, setNewGig] = useState({
    date: "",
    venue: "",
    city: "",
    time: "",
    address: "",
    description: "",
    location_info: "",
    location_link: "",
    image_url: "",
    status: "upcoming" as "upcoming" | "past",
  });

  const addMutation = useMutation({
    mutationFn: (input: typeof newGig) =>
      addGig({ data: { password, ...input } }),
    onSuccess: () => {
      setNewGig({
        date: "",
        venue: "",
        city: "",
        time: "",
        address: "",
        description: "",
        location_info: "",
        location_link: "",
        image_url: "",
        status: "upcoming",
      });
      setMutationError(null);
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
    onError: (err: Error) => setMutationError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGig({ data: { password, id } }),
    onSuccess: () => {
      setMutationError(null);
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
    onError: (err: Error) => setMutationError(err.message),
  });

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await verifyAdminPassword({ data: { password } });
      setUnlocked(true);
      setPwError(false);
    } catch {
      setPwError(true);
    }
  }

  function submitNewGig() {
    if (!newGig.date || !newGig.venue || !newGig.city) return;
    addMutation.mutate(newGig);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative my-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="btn-fx absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
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
            {pwError && <p className="text-sm text-red-400">Falsches Passwort.</p>}
            <button
              type="submit"
              className="btn-fx w-full rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
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

            <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-border bg-background/50 p-2">
              {gigs.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">Noch keine Events.</p>
              )}
              {gigs.map((g) => (
                <div key={g.id} className="flex items-center gap-2 rounded-md border border-border bg-card p-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{g.date}</span>
                  <span className="flex-1 truncate text-foreground">{g.venue} — {g.city}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    g.status === "upcoming"
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {g.status === "upcoming" ? "Kommend" : "Vergangen"}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(g.id)}
                    disabled={deleteMutation.isPending}
                    aria-label="Löschen"
                    className="btn-fx rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background p-3 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Neues Event</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newGig.date}
                  onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
                <input
                  type="time"
                  placeholder="Uhrzeit"
                  value={newGig.time}
                  onChange={(e) => setNewGig({ ...newGig, time: e.target.value })}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <input
                type="text"
                placeholder="Location / Venue (z.B. Sommerfest)"
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
              <input
                type="text"
                placeholder="Vollständige Adresse (optional)"
                value={newGig.address}
                onChange={(e) => setNewGig({ ...newGig, address: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <textarea
                placeholder="Beschreibung (optional)"
                rows={2}
                value={newGig.description}
                onChange={(e) => setNewGig({ ...newGig, description: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <textarea
                placeholder="Infos zur Location (optional)"
                rows={2}
                value={newGig.location_info}
                onChange={(e) => setNewGig({ ...newGig, location_info: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <input
                type="url"
                placeholder="Link zur Location (optional, z.B. Google Maps)"
                value={newGig.location_link}
                onChange={(e) => setNewGig({ ...newGig, location_link: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <input
                type="url"
                placeholder="Bild-URL (optional, z.B. https://...jpg)"
                value={newGig.image_url}
                onChange={(e) => setNewGig({ ...newGig, image_url: e.target.value })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              {newGig.image_url && (
                <img
                  src={newGig.image_url}
                  alt="Vorschau"
                  className="h-24 w-24 rounded-md border border-border object-cover"
                />
              )}
              <div className="flex gap-2">
                {(["upcoming", "past"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewGig({ ...newGig, status: s })}
                    className={`btn-fx flex-1 rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                      newGig.status === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "upcoming" ? "Kommend" : "Vergangen"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={submitNewGig}
                disabled={addMutation.isPending}
                className="btn-fx inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Hinzufügen
              </button>
            </div>

            {mutationError && (
              <p className="text-sm text-red-400">{mutationError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-fx flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Fertig
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="btn-fx absolute right-4 top-4 rounded-full border border-border bg-background/80 p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
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
              className="btn-fx mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 glow-indigo"
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
                className="btn-fx flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-fx flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 glow-indigo"
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
