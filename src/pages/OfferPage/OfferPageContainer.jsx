import { OfferPage } from "./OfferPage";

const products = [
  {
    category: "Coaching",
    name: "Powerlifting Start",
    price: "49 EUR",
    description:
      "Ein einfaches Einstiegspaket fuer Athletinnen und Athleten, die strukturiert mit Kniebeuge, Bankdruecken und Kreuzheben starten wollen.",
    features: [
      "1 Startanalyse deines aktuellen Trainingsstands",
      "4 Wochen Dummy-Trainingsstruktur als Beispiel",
      "Kurze Technik-Hinweise fuer die drei Hauptlifts",
    ],
    badge: "Ideal fuer Einsteiger",
  },
  {
    category: "Analyse",
    name: "Technik-Check",
    price: "69 EUR",
    description:
      "Ein kompaktes Format fuer Feedback zu deinen Lifts mit Fokus auf Technik, Setup und moegliche Fehlerquellen.",
    features: [
      "Video-Review fuer Squat, Bench oder Deadlift",
      "Konkrete Technik-Punkte zum direkten Umsetzen",
      "Empfehlungen fuer passende Drills und Prioritaeten",
    ],
    badge: "Beliebtes Format",
  },
  {
    category: "Wettkampf",
    name: "Meet Prep Dummy",
    price: "119 EUR",
    description:
      "Ein Beispiel fuer ein intensiveres Angebot Richtung Wettkampfvorbereitung, Peaking und Versuchsauswahl.",
    features: [
      "Dummy-Ablauf fuer die letzten 6 Wochen vor dem Meet",
      "Strategie fuer Opener, Second und Third Attempts",
      "Checkliste fuer Warm-up und Wettkampftag",
    ],
    badge: "Fuer Fortgeschrittene",
  },
];

const highlights = [
  {
    title: "Klare Pakete",
    description:
      "Jedes Angebot ist als einzelnes Produkt aufgebaut und kann spaeter leicht um echte Preise, Buchungslogik oder Zahlungsoptionen erweitert werden.",
  },
  {
    title: "Dienstleistung mit Struktur",
    description:
      "Die Inhalte zeigen schon jetzt, wie Coaching, Analysen und Wettkampfbetreuung auf der Seite sauber voneinander getrennt dargestellt werden koennen.",
  },
  {
    title: "Gute Basis fuer Conversion",
    description:
      "Mit Preis, Nutzen, Leistungsumfang und CTA haben wir bereits die wichtigsten Bausteine fuer eine erste Angebotsseite angelegt.",
  },
];

export function OfferPageContainer() {
  return (
    <OfferPage
      kicker="Angebot"
      title="Produkte und Dienstleistungen fuer dein Krafttraining"
      description="Hier entsteht eine Angebotsseite mit einzelnen Produkten, klaren Leistungen und einem schnellen Einstieg in Coaching, Analysen und Wettkampfvorbereitung."
      products={products}
      highlights={highlights}
    />
  );
}
