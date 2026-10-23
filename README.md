# Allensbacher Sportfreunde – Website

Website für die Allensbacher Sportfreunde, eine offene Sportgruppe am Bodensee.
Gebaut nur mit HTML, CSS und etwas JavaScript – ohne Build-Tools, damit sie
direkt auf GitHub Pages läuft.

## Ordnerstruktur

```
index.html          Startseite
touren.html         Die fünf Beispieltouren
ueber-uns.html      Idee, Zielgruppe, Rollen
kontakt.html        Kontaktformular (noch ohne echten Versand)
css/style.css       Gestaltung aller Seiten (Farben, Schrift, Layout)
js/kontakt.js       Kleines Skript für das Kontaktformular
illustrations/      Gezeichnete SVG-Illustrationen (See, Alpen, Rennradler)
images/             Platz für spätere echte Fotos
app/                App-Prototyp (PWA), auf GitHub Pages unter /app/
  index.html        Gerüst der App mit unterer Navigationsleiste
  app.css           Gestaltung der App (gleiche Farben wie die Website)
  app.js            Bildschirme, Anmelden, Profil, Gastgeber-Modus
  sw.js             Service Worker: App startet auch offline
  manifest.webmanifest  Name, Farben und Icon zum Installieren
  icons/            App-Icon (SVG und PNG)
```

## Ansehen

Website: einfach `index.html` im Browser öffnen (Doppelklick im Finder).

App: braucht einen kleinen lokalen Server, damit Installieren und Offline
funktionieren. Im Terminal im Projektordner:

```
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000/app/` öffnen.

Die App ist ein Prototyp ohne Server: Profil, Anmeldungen und neue Touren werden
nur im Browser des jeweiligen Geräts gespeichert (localStorage). Die Termine
sind Beispieltermine. Im Profil setzt „Beispieldaten zurücksetzen“ alles zurück.

## Inhalte

Alle Texte und Zahlen stammen aus dem Businessplan (Ideenskizze, Oktober 2026).
