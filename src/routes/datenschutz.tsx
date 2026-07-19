import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "../assets/dj-palme-logo-v2.png.asset.json";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz — DJ_Palme" },
      { name: "description", content: "Datenschutzerklärung der Website von DJ_Palme." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Datenschutz — DJ_Palme" },
      { property: "og:description", content: "Datenschutzerklärung der Website von DJ_Palme." },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="DJ_Palme Logo" className="h-10 w-10 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight">DJ_Palme</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight">Datenschutzerklärung</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stand: {new Date().toLocaleDateString("de-DE")}</p>

        <section className="mt-10 space-y-2">
          <h2 className="font-display text-xl font-bold">1. Verantwortlicher</h2>
          <p className="text-muted-foreground">
            Fabian Drabner (vertreten durch die gesetzlichen Vertreter), Kürten, Deutschland.<br />
            E-Mail: <a className="text-primary hover:underline" href="mailto:fabian@drabner.de">fabian@drabner.de</a>
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">2. Allgemeines</h2>
          <p className="text-muted-foreground">
            Der Schutz deiner persönlichen Daten ist mir wichtig. Personenbezogene Daten werden auf
            dieser Website nur im technisch notwendigen Umfang erhoben, verarbeitet und genutzt.
            Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a, b und f DSGVO.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">3. Hosting</h2>
          <p className="text-muted-foreground">
            Diese Website wird über Lovable / Cloudflare gehostet. Bei jedem Aufruf werden technische
            Server-Log-Daten (z.B. IP-Adresse, Datum/Uhrzeit, aufgerufene Seite, User-Agent) zur
            Sicherstellung des Betriebs verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">4. Buchungsanfragen</h2>
          <p className="text-muted-foreground">
            Wenn du das Buchungsformular nutzt, werden die von dir angegebenen Daten (Name, E-Mail,
            Telefonnummer, Datum, Uhrzeit, Veranstaltungsort, Art des Events, Gästeanzahl, Nachricht)
            per E-Mail über den Dienst „Resend" an <a className="text-primary hover:underline" href="mailto:fabian@drabner.de">fabian@drabner.de</a> gesendet und dort
            ausschließlich zur Bearbeitung deiner Anfrage verwendet. Rechtsgrundlage: Art. 6 Abs. 1
            lit. b DSGVO (Vertragsanbahnung).
          </p>
          <p className="text-muted-foreground">
            Die Daten werden nicht an Dritte weitergegeben und nach Erledigung der Anfrage gelöscht,
            sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">5. Datenbank</h2>
          <p className="text-muted-foreground">
            Auf dieser Website werden nur Event-Informationen (Datum, Location, Stadt) in einer
            Datenbank gespeichert. Diese Informationen sind öffentlich einsehbar. Persönliche
            Besucherdaten werden nicht in der Datenbank gespeichert.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">6. Cookies</h2>
          <p className="text-muted-foreground">
            Diese Website verwendet keine Tracking- oder Marketing-Cookies. Es werden lediglich
            technisch notwendige Speicherinhalte (z.B. für die Sitzung) verwendet.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">7. Externe Links</h2>
          <p className="text-muted-foreground">
            Die Website enthält Links zu externen Diensten wie Instagram. Beim Klick auf diese Links
            werden Daten an die jeweiligen Anbieter übertragen. Für deren Datenverarbeitung gelten
            die Datenschutzerklärungen der jeweiligen Anbieter.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">8. Deine Rechte</h2>
          <p className="text-muted-foreground">
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner Daten. Zur Ausübung
            deiner Rechte genügt eine E-Mail an <a className="text-primary hover:underline" href="mailto:fabian@drabner.de">fabian@drabner.de</a>. Zudem steht dir ein
            Beschwerderecht bei einer Datenschutzaufsichtsbehörde zu.
          </p>
        </section>

        <div className="mt-12">
          <Link to="/impressum" className="text-sm text-primary hover:underline">→ Impressum</Link>
        </div>
      </main>
    </div>
  );
}