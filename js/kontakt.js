// Kontaktformular – vorerst OHNE echten Versand.
//
// Später wird an der markierten Stelle die Nachricht wirklich verschickt,
// z. B. über einen Formular-Dienst wie Formspree oder einen eigenen Server.
// Bis dahin zeigen wir nur eine ehrliche Rückmeldung an.

const formular = document.getElementById('kontaktformular');
const meldung = document.getElementById('formular-meldung');

// "submit" passiert, wenn jemand auf "Nachricht senden" klickt.
// Der Browser hat dann schon geprüft, ob alle Pflichtfelder ausgefüllt sind.
formular.addEventListener('submit', function (ereignis) {
  // Verhindert das normale Abschicken (das würde die Seite neu laden)
  ereignis.preventDefault();

  const name = formular.elements.name.value.trim();

  // >>> HIER später den echten Versand einbauen <<<

  // textContent statt innerHTML: so wird eingegebener Text nie als HTML ausgeführt
  meldung.textContent = 'Danke, ' + name + '! Das Formular ist noch im Aufbau – ' +
    'deine Nachricht wurde deshalb noch nicht verschickt.';
  meldung.hidden = false;
  meldung.focus();   // springt zur Meldung, damit man sie sicher sieht

  formular.reset();  // leert die Felder
});
