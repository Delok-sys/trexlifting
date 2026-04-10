# Projektstruktur `trexlifting`

Diese Datei dient als kurze Referenz fuer die aktuelle Ordnerstruktur der React/Vite-App mit Redux.
Sie soll spaeter dabei helfen, neue Features konsistent einzuordnen und die Struktur sauber zu halten.

## Wurzelverzeichnis

### `package.json`

Enthaelt die Projektmetadaten, Scripts und Abhaengigkeiten.

Wichtige Punkte:
- `dev` startet den lokalen Vite-Entwicklungsserver
- `build` erstellt den Produktions-Build
- `preview` startet eine Vorschau des Builds
- Redux, React und Vite werden hier als Abhaengigkeiten verwaltet

### `index.html`

HTML-Einstiegspunkt fuer Vite.
Hier wird das Root-Element bereitgestellt, in das React gerendert wird.

### `vite.config.js`

Zentrale Vite-Konfiguration.
Aktuell ist hier das React-Plugin eingebunden.
Spaeter koennen hier zusaetzlich Aliase, Proxy-Konfigurationen oder Build-Optionen gepflegt werden.

## `src/`

Hier liegt der eigentliche Anwendungscode.
Alle fachlichen und visuellen Erweiterungen sollten primaer innerhalb dieses Verzeichnisses stattfinden.

### `src/main.jsx`

Technischer Einstiegspunkt der React-Anwendung.

Aufgaben:
- startet React ueber `ReactDOM.createRoot`
- bindet globale Styles ein
- umschliesst die App mit allen globalen Providern

Wenn spaeter weitere globale Layer noetig sind, werden sie meist hier oder in `AppProviders` angebunden.

## `src/app/`

Dieser Bereich enthaelt die anwendungsweite Grundstruktur.
Hier kommt alles hin, was die App als Ganzes betrifft und nicht nur ein einzelnes Feature.

### `src/app/App.jsx`

Zentrale App-Komponente.
Sie ist der Einstieg in die eigentliche UI-Komposition.

Typische spaetere Aufgaben:
- Routing einhaengen
- globale Layouts einbinden
- Seiten zusammensetzen

### `src/app/providers/`

Hier werden globale Provider gesammelt, damit `main.jsx` schlank bleibt.

#### `src/app/providers/AppProviders.jsx`

Buendelt Provider, die fuer die gesamte Anwendung gelten.

Aktuell:
- Redux `Provider`

Spaeter moeglich:
- Router Provider
- Theme Provider
- Query Client Provider
- Internationalisierung

## `src/components/`

Enthaelt wiederverwendbare UI-Bausteine.
Diese Komponenten sollten moeglichst allgemein bleiben und nicht zu viel Fachlogik enthalten.

### `src/components/PageIntro.jsx`

Beispiel fuer eine einfache praesentationale Komponente.
Sie zeigt Inhalte an, ohne den globalen Zustand selbst zu verwalten.

### `src/components/index.js`

Sammel-Export fuer Komponenten.
So lassen sich Komponenten kuerzer und sauberer importieren.

Empfehlung fuer spaeter:
- allgemeine UI-Komponenten hier ablegen
- stark feature-spezifische Komponenten lieber in einen eigenen Feature-Ordner verschieben

## `src/pages/`

Hier liegen Seiten-Komponenten.
Pages setzen meist mehrere Komponenten zusammen und verbinden Darstellung mit Anwendungslogik.

### `src/pages/HomePage.jsx`

Aktuelle Startseite der Anwendung.
Sie nutzt bereits Redux ueber `useSelector` und `useDispatch`.

Typische Aufgaben von Pages:
- Feature-Komponenten zusammensetzen
- Daten aus dem Store lesen
- Benutzerfluesse strukturieren

## `src/store/`

Zentrale Stelle fuer das Redux-Setup.
Alles rund um globalen State sollte hier organisiert werden.

### `src/store/store.js`

Erstellt den Redux Store mit `configureStore`.
Hier werden Reducer zusammengefuehrt.

Spaeter moeglich:
- mehrere Feature-Reducer registrieren
- Middleware erweitern
- DevTools-Konfiguration anpassen

### `src/store/index.js`

Re-Export fuer den Store.
Hilft dabei, Importpfade kompakter zu halten.

### `src/store/slices/`

Hier liegen Redux Slices.
Ein Slice kapselt in der Regel:
- den initialen State
- Reducer
- Actions
- den fachlichen Namensraum

#### `src/store/slices/counterSlice.js`

Beispiel-Slice fuer den Einstieg.
Es zeigt, wie Actions und Reducer mit Redux Toolkit strukturiert werden.

Empfehlung fuer spaeter:
- pro fachlichem Bereich ein eigener Slice
- aussagekraeftige Namen wie `authSlice`, `userSlice`, `productsSlice`, `settingsSlice`

## `src/styles/`

Globale Styles und spaeter moegliche Design-Grundlagen.

### `src/styles/global.css`

Aktuelle Basis fuer globale Styles der Anwendung.

Spaeter moeglich:
- CSS-Variablen fuer Farben, Abstaende und Typografie
- Reset oder Base-Styles
- globale Utility-Klassen

## Empfehlung fuer spaetere Feature-Erweiterungen

Sobald die App waechst, lohnt sich eine feature-orientierte Struktur innerhalb von `src`.
Ein moeglicher Ausbau waere:

```text
src/
  app/
  components/
  features/
    auth/
      components/
      hooks/
      services/
      store/
    products/
      components/
      services/
      store/
  pages/
  store/
  styles/
```

## Grundregeln fuer kuenftige Erweiterungen

- Allgemeine, wiederverwendbare UI in `src/components`
- Seitenlogik in `src/pages`
- Globalen State in `src/store`
- App-weite technische Einbindungen in `src/app`
- Fachlich zusammengehoerige Logik spaeter bevorzugt in `features/` gruppieren

## Ziel dieser Struktur

Die Struktur soll:
- leicht verstaendlich bleiben
- mit neuen Features mitwachsen
- Verantwortlichkeiten klar trennen
- Refactoring spaeter einfacher machen
