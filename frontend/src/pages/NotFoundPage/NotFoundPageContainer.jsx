import { NotFoundPage } from "./NotFoundPage";

export function NotFoundPageContainer() {
  return (
    <NotFoundPage
      kicker="404"
      title="Seite nicht gefunden"
      description="Die aufgerufene Seite existiert aktuell nicht oder wurde verschoben."
      backLabel="Zurueck zur Startseite"
      backTo="/"
    />
  );
}
