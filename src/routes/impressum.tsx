import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "../assets/dj-palme-logo-v2.png.asset.json";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — DJ_Palme" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung von DJ_Palme." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Impressum — DJ_Palme" },
      { property: "og:description", content: "Impressum und Anbieterkennzeichnung von DJ_Palme." },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
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
        <h1 className="font-display text-4xl font-bold tracking-tight">Impressum</h1>
        <p className="mt-2 text-sm text-muted-foreground">Angaben gemäß § 5 TMG</p>

        <section className="mt-10 space-y-2">
          <h2 className="font-display text-xl font-bold">Anbieter</h2>
          <p className="text-muted-foreground">
            Fabian Drabner<br />
            (vertreten durch die gesetzlichen Vertreter, da minderjährig)<br />
            Kürten, Deutschland
          </p>
          <p className="text-sm text-muted-foreground">
            Die vollständige Postanschrift wird auf berechtigte Anfrage per E-Mail mitgeteilt.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">Kontakt</h2>
          <p className="text-muted-foreground">
            E-Mail: <a className="text-primary hover:underline" href="mailto:fabian@drabner.de">fabian@drabner.de</a><br />
            Instagram: <a className="text-primary hover:underline" href="https://instagram.com/dj_palme_0fficial" target="_blank" rel="noopener noreferrer">@dj_palme_0fficial</a>
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-muted-foreground">Fabian Drabner, Anschrift wie oben.</p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">Haftungsausschluss</h2>
          <p className="text-muted-foreground">
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
          </p>
          <p className="text-muted-foreground">
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss
            besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber verantwortlich.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-display text-xl font-bold">Urheberrecht</h2>
          <p className="text-muted-foreground">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen
            dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <div className="mt-12">
          <Link to="/datenschutz" className="text-sm text-primary hover:underline">→ Datenschutzerklärung</Link>
        </div>
      </main>
    </div>
  );
}