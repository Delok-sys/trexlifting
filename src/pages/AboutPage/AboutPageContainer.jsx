import { AboutPage } from "./AboutPage";

const experienceTimeline = [
  {
    period: "2018",
    title: "Start mit Kraftsport",
    description: "Beginn des strukturierten Krafttrainings und Aufbau der sportlichen Basis.",
  },
  {
    period: "2020",
    title: "Einstieg ins Powerlifting",
    description: "Fokus auf Kniebeuge, Bankdruecken und Kreuzheben mit klarer Wettkampfausrichtung.",
  },
  {
    period: "2022",
    title: "Erster Wettkampf",
    description: "Bending Bars mit einem 4. Platz als erster Wettkampf-Erfahrung.",
  },
  {
    period: "2023",
    title: "Zweiter Wettkampf",
    description: "Bending Bars mit einem 5. Platz und weiterer Erfahrung auf der Plattform.",
  },
  {
    period: "Seit 2023",
    title: "Betreuung von Athleten",
    description: "Begleitung von Athleten im Training und auf Wettkaempfen.",
  },
  {
    period: "2024",
    title: "Leistungssteigerung im Wettkampf",
    description: "Bending Bars mit Platz 2 als naechster sportlicher Meilenstein.",
  },
  {
    period: "2024",
    title: "Erster Wettkampfsieg",
    description: "Raw Meet VIII mit Platz 1 und einem starken Abschluss der Wettkampfserie.",
  },
  {
    period: "Okt. 2024 - Aug. 2025",
    title: "Ausbildung zum Personal Trainer",
    description: "Ausbildung zum Henselmans zertifizierten Personal Trainer.",
  },
];

const injuryCards = [
  {
    area: "Kniebeuge",
    issue: "Butt Wink",
    detail: "Sehnenreizung unter Last bei der Kniebeuge.",
    tone: "warning",
  },
  {
    area: "Kniebeuge / Kreuzheben",
    issue: "Rueckenstrecker",
    detail: "Ueberlastung der Rueckenstrecker durch hohe Beanspruchung.",
    tone: "danger",
  },
  {
    area: "Kniebeuge",
    issue: "Linkes Knie",
    detail: "Wiederkehrende Knieprobleme bei Beugebelastungen.",
    tone: "warning",
  },
  {
    area: "Bankdruecken",
    issue: "Vordere Schulter",
    detail: "Beschwerden im vorderen Schulterbereich.",
    tone: "danger",
  },
  {
    area: "Kniebeuge",
    issue: "Hintere Schulter",
    detail: "Belastungsprobleme der hinteren Schulter durch die Hantelposition.",
    tone: "warning",
  },
  {
    area: "Bankdruecken",
    issue: "Bizeps nahe Brustansatz",
    detail: "Reizung im Ansatzbereich bei drueckenden Bewegungen.",
    tone: "danger",
  },
  {
    area: "Kreuzheben",
    issue: "Beinbeuger hueftnah",
    detail: "Ueberlastung im hueftnahen Bereich der Beinbeuger.",
    tone: "warning",
  },
];

export function AboutPageContainer() {
  return <AboutPage experienceTimeline={experienceTimeline} injuryCards={injuryCards} />;
}
