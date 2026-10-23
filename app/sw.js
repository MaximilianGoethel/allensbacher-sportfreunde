// Service Worker – sorgt dafür, dass die App auch ohne Internet startet.
//
// Ein Service Worker ist ein kleines Skript, das der Browser im Hintergrund
// aufbewahrt. Er legt die App-Dateien in einen Zwischenspeicher („Cache“).
//
// Vorgehen „erst Netz, dann Speicher“: Ist Internet da, wird immer die neueste
// Version geladen (und im Speicher aktualisiert). Ohne Internet kommt die
// gespeicherte Version. So sieht man nach einer Änderung sofort das Neue.

// Bei größeren Änderungen an der Dateiliste die Nummer erhöhen (v1 → v2).
const CACHE_NAME = 'sportfreunde-app-v1';

const APP_DATEIEN = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// 1. Installieren: alle App-Dateien in den Speicher legen
self.addEventListener('install', function (ereignis) {
  ereignis.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(APP_DATEIEN); })
  );
  self.skipWaiting();   // neue Version sofort benutzen
});

// 2. Aktivieren: Speicher älterer Versionen löschen
self.addEventListener('activate', function (ereignis) {
  ereignis.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen
        .filter(function (name) { return name !== CACHE_NAME; })
        .map(function (name) { return caches.delete(name); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// 3. Jede Anfrage: erst aus dem Netz holen, bei Fehler aus dem Speicher
self.addEventListener('fetch', function (ereignis) {
  const anfrage = ereignis.request;
  // Nur normale Abrufe von unserer eigenen Seite behandeln
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;

  ereignis.respondWith(
    fetch(anfrage)
      .then(function (antwort) {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(anfrage, kopie); });
        }
        return antwort;
      })
      .catch(function () {
        return caches.match(anfrage, { ignoreSearch: true }).then(function (gespeichert) {
          // Beim Öffnen der App ohne Netz notfalls die Startseite liefern
          return gespeichert || (anfrage.mode === 'navigate' ? caches.match('./') : undefined);
        });
      })
  );
});
