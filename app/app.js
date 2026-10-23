// Allensbacher Sportfreunde – App-Prototyp
//
// Die ganze App läuft im Browser, ohne Server. Alle Daten (Touren, Anmeldungen,
// Profil) liegen im „localStorage“ – einem kleinen Speicher im Browser dieses
// Geräts. Wer die App auf einem anderen Handy öffnet, sieht deshalb andere Daten.
//
// Aufbau dieser Datei:
// 1. Beispieltouren (Startdaten)
// 2. Speichern und Laden
// 3. Hilfsfunktionen
// 4. Bildschirme
// 5. Knöpfe und Formulare
// 6. Navigation zwischen den Bildschirmen

'use strict';


// 1. Beispieltouren (Startdaten) ----------------------------------------------
// Strecken, km, Höhenmeter und Beschreibungen stammen aus dem Businessplan
// („Fünf Beispieltouren Rennrad“). Die Termine sind BEISPIELTERMINE: Sie werden
// beim ersten Öffnen auf die nächsten Mittwoche (18:00, Feierabendrunde) und
// Samstage (vormittags, längere Tour) gelegt – wie im Wochenrhythmus des Plans.

const PLAETZE_PRO_TOUR = 7;   // Gruppen von 5–7 Leuten
const GASTGEBER_PAPA = 'Papa – Initiator & Hauptgastgeber';
const TREFFPUNKT_OFFEN = 'Abholung entlang der Route – die Abholpunkte legt der Gastgeber ' +
  'nach der Anmeldung fest. Sonst gibt es einen festen Treffpunkt.';

const BEISPIELTOUREN = [
  { tag: 'mi', woche: 0, name: 'Reichenau-Runde', strecke: 'Konstanz – Insel Reichenau – Konstanz',
    beschreibung: 'Insel, Gemüsefelder, Seeblick. Passt für die Mittwoch-Feierabendrunde.',
    km: 29, hm: 'flach', belegt: 4 },
  { tag: 'sa', woche: 0, name: 'Untersee-Runde', strecke: 'Konstanz – Radolfzell – Stein am Rhein – Schweizer Ufer',
    beschreibung: 'Der Klassiker am Ufer, zwei Länder.',
    km: 78, hm: 350, belegt: 2 },
  { tag: 'mi', woche: 1, name: 'Reichenau-Runde', strecke: 'Konstanz – Insel Reichenau – Konstanz',
    beschreibung: 'Insel, Gemüsefelder, Seeblick. Passt für die Mittwoch-Feierabendrunde.',
    km: 29, hm: 'flach', belegt: 1 },
  { tag: 'sa', woche: 1, name: 'Untersee mit Seerücken', strecke: 'Konstanz – Stein am Rhein – Moos – Radolfzell',
    beschreibung: 'Ruhige Nebenstraßen auf Schweizer Seite, Bergblick. Samstag, sportlicher.',
    km: 71, hm: 860, belegt: 3 },
  { tag: 'sa', woche: 2, name: 'Hegau & Bodensee', strecke: 'Durch den Hegau und am See entlang',
    beschreibung: 'Vulkanberge und kleine Sträßchen. Samstag, lange Tour.',
    km: 117, hm: 1580, belegt: 6 },
  { tag: 'sa', woche: 3, name: 'Große Bodensee-Runde', strecke: 'Einmal rund um den See: Deutschland, Österreich, Schweiz',
    beschreibung: 'Drei Länder an einem Tag – oder in zwei Etappen. Das Saisonhighlight.',
    km: 260, hm: 'hügelig', belegt: 2 }
];

function startdatenErzeugen() {
  const touren = BEISPIELTOUREN.map(function (vorlage, nummer) {
    // Nächsten Mittwoch (3) bzw. Samstag (6) ab heute suchen, dann ggf. Wochen dazuzählen
    const zielTag = vorlage.tag === 'mi' ? 3 : 6;
    const datum = new Date();
    datum.setDate(datum.getDate() + ((zielTag - datum.getDay() + 7) % 7) + vorlage.woche * 7);

    return {
      id: 'beispiel-' + (nummer + 1),
      datum: datumAlsText(datum),
      uhrzeit: vorlage.tag === 'mi' ? '18:00' : 'vormittags',
      name: vorlage.name,
      strecke: vorlage.strecke,
      beschreibung: vorlage.beschreibung,
      km: vorlage.km,
      hm: vorlage.hm,
      treffpunkt: TREFFPUNKT_OFFEN,
      plaetze: PLAETZE_PRO_TOUR,
      gastgeber: GASTGEBER_PAPA,
      beispiel: true,
      // Ausgedachte Anmeldungen anderer Leute, damit „freie Plätze“ etwas zeigt
      beispielAnmeldungen: vorlage.belegt,
      teilnehmer: []          // echte Anmeldungen auf diesem Gerät
    };
  });

  return {
    touren: touren,
    profil: { name: '', email: '', telefon: '' },
    gastgeberModus: false
  };
}


// 2. Speichern und Laden ------------------------------------------------------

// Unter diesem Namen liegen die Daten im Browser.
const SPEICHER_NAME = 'allensbacher-sportfreunde-app';

function laden() {
  try {
    const text = localStorage.getItem(SPEICHER_NAME);
    if (text) return JSON.parse(text);
  } catch (fehler) {
    // Kann passieren, wenn der Browser das Speichern verbietet (z. B. privater Modus).
    // Dann startet die App einfach mit den Beispieltouren.
  }
  return startdatenErzeugen();
}

function speichern() {
  try {
    localStorage.setItem(SPEICHER_NAME, JSON.stringify(daten));
  } catch (fehler) {
    // Speichern nicht möglich – die App funktioniert trotzdem bis zum Neuladen.
  }
}

let daten = laden();


// 3. Hilfsfunktionen ----------------------------------------------------------

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

// Datum als Text im Format 2026-10-28 (so lässt es sich leicht vergleichen und sortieren)
function datumAlsText(datum) {
  const monat = String(datum.getMonth() + 1).padStart(2, '0');
  const tag = String(datum.getDate()).padStart(2, '0');
  return datum.getFullYear() + '-' + monat + '-' + tag;
}

// Macht aus „2026-10-28“ wieder ein Datum (ohne Zeitzonen-Überraschungen)
function textAlsDatum(text) {
  const [jahr, monat, tag] = text.split('-').map(Number);
  return new Date(jahr, monat - 1, tag);
}

const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

// „Mi 28.10. · 18:00 Uhr“ oder „Sa 31.10. · vormittags“
function wannKurz(tour) {
  const d = textAlsDatum(tour.datum);
  const datum = WOCHENTAGE_KURZ[d.getDay()] + ' ' + d.getDate() + '.' + (d.getMonth() + 1) + '.';
  return datum + ' · ' + uhrzeitText(tour.uhrzeit);
}

// „Mittwoch, 28. Oktober 2026“
function datumLang(tour) {
  return textAlsDatum(tour.datum).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function uhrzeitText(uhrzeit) {
  return /^\d{1,2}:\d{2}$/.test(uhrzeit) ? uhrzeit + ' Uhr' : uhrzeit;
}

// Höhenmeter sind eine Zahl (350) oder ein Wort („flach“, „hügelig“)
function hoehenmeterText(hm) {
  return typeof hm === 'number' ? 'ca. ' + hm.toLocaleString('de-DE') + ' Hm' : hm;
}

function werteText(tour) {
  return 'ca. ' + tour.km.toLocaleString('de-DE') + ' km · ' + hoehenmeterText(tour.hm);
}

function tourFinden(id) {
  return daten.touren.find(function (tour) { return tour.id === id; });
}

function freiePlaetze(tour) {
  const belegt = tour.beispielAnmeldungen + tour.teilnehmer.length;
  return Math.max(0, tour.plaetze - belegt);
}

function binAngemeldet(tour) {
  return tour.teilnehmer.some(function (person) { return person.ich; });
}

function plaetzeText(tour) {
  const frei = freiePlaetze(tour);
  if (frei === 0) return 'Ausgebucht';
  return frei + ' von ' + tour.plaetze + (frei === 1 ? ' Platz frei' : ' Plätzen frei');
}

function plaetzeKlasse(tour) {
  const frei = freiePlaetze(tour);
  if (frei === 0) return 'plaetze plaetze--voll';
  if (frei <= 2) return 'plaetze plaetze--wenig';
  return 'plaetze';
}

// Alle Touren ab heute, nach Datum sortiert
function kommendeTouren() {
  const heute = datumAlsText(new Date());
  return daten.touren
    .filter(function (tour) { return tour.datum >= heute; })
    .sort(function (a, b) {
      return a.datum.localeCompare(b.datum) || a.uhrzeit.localeCompare(b.uhrzeit);
    });
}

function profilVollstaendig() {
  return daten.profil.name.trim() !== '' && daten.profil.email.trim() !== '';
}

// Eine kurze Rückmeldung („Du bist angemeldet“), die beim nächsten Bildschirm einmal erscheint
let meldung = '';

function meldungHtml() {
  if (!meldung) return '';
  const html = `<p class="meldung" role="status">${sicher(meldung)}</p>`;
  meldung = '';
  return html;
}


// 4. Bildschirme --------------------------------------------------------------
// Jede Funktion liefert den HTML-Text für einen Bildschirm.

function bildschirmPlatzhalter(titel) {
  return `<h1>${sicher(titel)}</h1>
    <p class="leer">Dieser Bildschirm kommt im nächsten Schritt.</p>`;
}

// Eine Tour als Karte in einer Liste. Die ganze Karte ist anklickbar.
function tourkarte(tour) {
  const angemeldet = binAngemeldet(tour);
  return `
    <li>
      <a class="karte tourkarte${angemeldet ? ' tourkarte--angemeldet' : ''}" href="#/tour/${sicher(tour.id)}">
        <span class="dachzeile">${sicher(wannKurz(tour))}</span>
        <h2>${sicher(tour.name)}</h2>
        <p class="tourkarte__werte">${sicher(werteText(tour))}</p>
        <div class="tourkarte__fuss">
          <span class="${plaetzeKlasse(tour)}">${plaetzeText(tour)}</span>
          ${angemeldet ? '<span class="angemeldet-marke">Angemeldet</span>' : ''}
          ${tour.beispiel ? '<span class="etikett">Beispieltermin</span>' : ''}
        </div>
      </a>
    </li>`;
}

function bildschirmTouren() {
  const touren = kommendeTouren();
  const liste = touren.length
    ? `<ul class="liste">${touren.map(tourkarte).join('')}</ul>`
    : '<p class="leer">Gerade sind keine Touren geplant.</p>';

  return `
    ${meldungHtml()}
    <h1>Nächste Touren</h1>
    <p class="einleitung">Zwei feste Events pro Woche: Mittwoch 18:00 die Feierabendrunde,
      Samstag vormittags eine längere Tour. Gruppen von 5–7 Leuten.</p>
    ${liste}
    <p class="hinweis hinweis--unten">Die Termine sind Beispieltermine für diesen Prototyp.</p>`;
}

function bildschirmTourDetails(id) {
  const tour = tourFinden(id);
  if (!tour) {
    return `<a class="zurueck" href="#/touren">← Alle Touren</a>
      <h1>Tour nicht gefunden</h1>
      <p class="leer">Diese Tour gibt es auf diesem Gerät nicht (mehr).</p>`;
  }

  const angemeldet = binAngemeldet(tour);
  const frei = freiePlaetze(tour);

  let knopf;
  if (angemeldet) {
    knopf = `<p class="meldung">Du bist für diese Tour angemeldet.</p>
      <button class="knopf knopf--abmelden" type="button" data-aktion="abmelden" data-id="${sicher(tour.id)}">Abmelden</button>`;
  } else if (frei === 0) {
    knopf = '<button class="knopf" type="button" disabled>Ausgebucht</button>';
  } else {
    knopf = `<button class="knopf" type="button" data-aktion="anmelden" data-id="${sicher(tour.id)}">Anmelden</button>`;
  }

  return `
    <a class="zurueck" href="#/touren">← Alle Touren</a>
    ${meldungHtml()}
    <span class="dachzeile">${sicher(wannKurz(tour))}</span>
    <h1>${sicher(tour.name)}</h1>
    ${tour.beispiel ? '<span class="etikett">Beispieltermin</span>' : ''}

    <div class="kennzahlen">
      <p class="kennzahl"><strong>${sicher(tour.km)}</strong><span>km</span></p>
      <p class="kennzahl"><strong>${sicher(typeof tour.hm === 'number' ? tour.hm.toLocaleString('de-DE') : tour.hm)}</strong>
        <span>${typeof tour.hm === 'number' ? 'Höhenmeter' : 'Gelände'}</span></p>
      <p class="kennzahl"><strong>${frei}</strong><span>von ${sicher(tour.plaetze)} frei</span></p>
    </div>

    <div class="knopfreihe knopfreihe--details">${knopf}</div>

    <dl class="angaben">
      <div><dt>Wann</dt><dd>${sicher(datumLang(tour))}, ${sicher(uhrzeitText(tour.uhrzeit))}</dd></div>
      <div><dt>Strecke</dt><dd>${sicher(tour.strecke)}</dd></div>
      ${tour.beschreibung ? `<div><dt>Beschreibung</dt><dd>${sicher(tour.beschreibung)}</dd></div>` : ''}
      <div><dt>Treffpunkt &amp; Abholung</dt><dd>${sicher(tour.treffpunkt)}</dd></div>
      <div><dt>Gastgeber</dt><dd>${sicher(tour.gastgeber)}</dd></div>
    </dl>
    ${tour.beispiel ? `<p class="hinweis">Alle Werte ca. – Richtwerte aus veröffentlichten Touren;
      je nach Startpunkt abweichend. Danach Einkehr nach Lust und Laune – kein Pflichtprogramm.</p>` : ''}`;
}


// 5. Knöpfe und Formulare -----------------------------------------------------

// Merkt sich, zu welcher Tour man nach dem Ausfüllen des Profils zurückkehren soll
let tourNachProfil = null;

function anmelden(id) {
  const tour = tourFinden(id);
  if (!tour || binAngemeldet(tour) || freiePlaetze(tour) === 0) return;

  // Ohne Name und Kontakt weiß der Gastgeber nicht, wen er abholen soll
  if (!profilVollstaendig()) {
    tourNachProfil = id;
    meldung = 'Bitte trage zuerst deinen Namen und deine E-Mail ein. Danach geht es zurück zur Tour.';
    location.hash = '#/profil';
    return;
  }

  tour.teilnehmer.push({
    ich: true,
    name: daten.profil.name,
    email: daten.profil.email,
    telefon: daten.profil.telefon
  });
  speichern();
  meldung = 'Geschafft! Du bist für „' + tour.name + '“ angemeldet.';
  zeigen();
}

function abmelden(id) {
  const tour = tourFinden(id);
  if (!tour) return;
  if (!window.confirm('Möchtest du dich wirklich von „' + tour.name + '“ abmelden?')) return;

  tour.teilnehmer = tour.teilnehmer.filter(function (person) { return !person.ich; });
  speichern();
  meldung = 'Du bist abgemeldet. Dein Platz ist wieder frei.';
  zeigen();
}

// Ein einziger „Zuhörer“ für alle Knöpfe mit data-aktion="…"
document.getElementById('inhalt').addEventListener('click', function (ereignis) {
  const knopf = ereignis.target.closest('[data-aktion]');
  if (!knopf) return;
  const id = knopf.dataset.id;
  switch (knopf.dataset.aktion) {
    case 'anmelden': anmelden(id); break;
    case 'abmelden': abmelden(id); break;
  }
});


// 6. Navigation zwischen den Bildschirmen -------------------------------------
// Die Adresse hinter dem # bestimmt den Bildschirm, z. B. „#/touren“ oder „#/tour/abc“.
// So funktionieren auch der Zurück-Knopf des Handys und Links auf GitHub Pages.

const inhalt = document.getElementById('inhalt');

function zeigen() {
  const teile = location.hash.replace(/^#\/?/, '').split('/');
  const bereich = teile[0] || 'touren';

  let html;
  let menuepunkt = bereich;
  switch (bereich) {
    case 'touren':    html = bildschirmTouren(); break;
    case 'tour':      html = bildschirmTourDetails(teile[1]); menuepunkt = 'touren'; break;
    case 'meine':     html = bildschirmPlatzhalter('Meine Touren'); break;
    case 'profil':    html = bildschirmPlatzhalter('Profil'); break;
    default:          html = bildschirmTouren(); menuepunkt = 'touren';
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
