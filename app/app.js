// Allensbacher Sportfreunde – App-Prototyp
//
// Die ganze App läuft im Browser, ohne Server. Alle Daten (Touren, Anmeldungen,
// Profil) liegen im „localStorage“ – einem kleinen Speicher im Browser dieses
// Geräts. Wer die App auf einem anderen Handy öffnet, sieht deshalb andere Daten.
//
// Aufbau dieser Datei:
// 1. Speichern und Laden
// 2. Hilfsfunktionen
// 3. Bildschirme
// 4. Navigation zwischen den Bildschirmen

'use strict';


// 1. Speichern und Laden ------------------------------------------------------

// Unter diesem Namen liegen die Daten im Browser.
const SPEICHER_NAME = 'allensbacher-sportfreunde-app';

function laden() {
  try {
    const text = localStorage.getItem(SPEICHER_NAME);
    if (text) return JSON.parse(text);
  } catch (fehler) {
    // Kann passieren, wenn der Browser das Speichern verbietet (z. B. privater Modus).
    // Dann startet die App einfach mit leeren Daten.
  }
  return { touren: [], profil: { name: '', email: '', telefon: '' }, gastgeberModus: false };
}

function speichern() {
  try {
    localStorage.setItem(SPEICHER_NAME, JSON.stringify(daten));
  } catch (fehler) {
    // Speichern nicht möglich – die App funktioniert trotzdem bis zum Neuladen.
  }
}

let daten = laden();


// 2. Hilfsfunktionen ----------------------------------------------------------

// Macht Text „harmlos“, bevor er in die Seite eingesetzt wird.
// Sonst könnte jemand z. B. in einen Tournamen HTML-Code schreiben, der ausgeführt wird.
function sicher(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// 3. Bildschirme --------------------------------------------------------------
// Jede Funktion liefert den HTML-Text für einen Bildschirm.

function bildschirmPlatzhalter(titel) {
  return `<h1>${sicher(titel)}</h1>
    <p class="leer">Dieser Bildschirm kommt im nächsten Schritt.</p>`;
}


// 4. Navigation zwischen den Bildschirmen -------------------------------------
// Die Adresse hinter dem # bestimmt den Bildschirm, z. B. „#/touren“ oder „#/tour/abc“.
// So funktionieren auch der Zurück-Knopf des Handys und Links auf GitHub Pages.

const inhalt = document.getElementById('inhalt');

function zeigen() {
  const teile = location.hash.replace(/^#\/?/, '').split('/');
  const bereich = teile[0] || 'touren';

  let html;
  let menuepunkt = bereich;
  switch (bereich) {
    case 'touren':    html = bildschirmPlatzhalter('Nächste Touren'); break;
    case 'meine':     html = bildschirmPlatzhalter('Meine Touren'); break;
    case 'profil':    html = bildschirmPlatzhalter('Profil'); break;
    default:          html = bildschirmPlatzhalter('Nächste Touren'); menuepunkt = 'touren';
  }

  inhalt.innerHTML = html;

  // Menüpunkt unten hervorheben
  document.querySelectorAll('.leiste a').forEach(function (link) {
    if (link.dataset.bereich === menuepunkt) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Nach oben springen und die Überschrift „ansteuern“ (hilft Vorleseprogrammen)
  window.scrollTo(0, 0);
  const ueberschrift = inhalt.querySelector('h1');
  if (ueberschrift) {
    ueberschrift.setAttribute('tabindex', '-1');
    ueberschrift.focus({ preventScroll: true });
  }
}

window.addEventListener('hashchange', zeigen);
zeigen();
