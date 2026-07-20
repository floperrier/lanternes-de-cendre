// PROTOTYPE JETABLE — une proposition recommandée du contrat d'expédition.
// Direction visuelle imposée par l'issue « Prototyper la direction visuelle et l’interface du convoi » :
// Coupe habitée comme coque, Atlas pour l'opération, ruban de Vigie pour les décisions.

const surfaces = [
  ["convoi", "Convoi", "⌂"],
  ["meteo", "Météo", "≋"],
  ["conseil", "Conseil", "♙"],
  ["journal", "Journal", "▤"],
];

const platforms = [
  ["phare", "Phare", "Commande", "Stable"],
  ["intendance", "Intendance", "Eau · Vivres", "Stable"],
  ["foyers", "Foyers", "Habitat · Soin", "Stable"],
  ["machines", "Machines", "Chaleur · Traction", "Stable"],
  ["operations", "Atelier–Opérations", "Technique · Veille", "Expédition prête"],
];

function initialState() {
  return {
    surface: "convoi",
    selectedPlatform: "operations",
    operationOpen: true,
    phase: "prepare",
    step: 0,
    progress: 0,
    convoyMinutes: 8 * 60 + 10,
    operationMinutes: 0,
    convoyPaused: false,
    speed: 1,
    decision: null,
    sourcesOpen: false,
    journal: [
      {
        at: "J−2",
        kind: "source",
        title: "Rapport des Vanniers recoupé",
        detail: "La station répond encore ; son débit et sa filtration intérieure restent incertains.",
      },
    ],
  };
}

let state = initialState();
const main = document.querySelector("#prototype-main");
const announcer = document.querySelector("#announcer");

function formatClock(minutes) {
  const normalized = minutes % (24 * 60);
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}

function formatDuration(minutes) {
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}

function phaseLabel() {
  return {
    prepare: "Préparation",
    active: "En opération",
    escalation: "Ordre requis",
    returning: "Retour autonome",
    complete: "Bilan reçu",
  }[state.phase];
}

function renderTopbar() {
  return `<header class="topbar">
    <div class="brand"><strong>Les Lanternes de Cendre</strong><span>Bassins fendus · Halte des Vanniers</span></div>
    <nav class="surface-nav" aria-label="Surfaces du jeu">
      ${surfaces.map(([key, label, glyph]) => `<button type="button" data-surface="${key}" class="${state.surface === key ? "is-active" : ""}" aria-current="${state.surface === key ? "page" : "false"}"><span aria-hidden="true">${glyph}</span>${label}</button>`).join("")}
    </nav>
    <button class="operation-chip ${state.phase === "escalation" ? "needs-order" : ""}" type="button" data-action="open-operation">
      <span>${state.phase === "escalation" ? "!" : "⌁"}</span><span><small>Opération</small><strong>${phaseLabel()}</strong></span>
    </button>
    <div class="time-controls" aria-label="Temps du convoi">
      <button type="button" data-action="toggle-pause" class="${state.convoyPaused ? "is-active" : ""}" aria-pressed="${state.convoyPaused}">${state.convoyPaused ? "▶" : "Ⅱ"}<span>${state.convoyPaused ? "Reprendre" : "Pause"}</span></button>
      ${[1, 2, 4].map((speed) => `<button type="button" data-speed="${speed}" class="${!state.convoyPaused && state.speed === speed ? "is-active" : ""}" aria-pressed="${!state.convoyPaused && state.speed === speed}">×${speed}</button>`).join("")}
    </div>
  </header>`;
}

function renderMetrics() {
  return `<footer class="metrics" aria-label="État synthétique du convoi">
    <div class="metric primary"><span>◉</span><p><small>Autonomie</small><strong>8</strong><em>jours</em></p></div>
    <div class="metric"><span>♙</span><p><small>Habitants</small><strong>184</strong><em>sur 250</em></p></div>
    <div class="metric"><span>♨</span><p><small>Chaleur</small><strong>+2</strong><em>marge</em></p></div>
    <div class="metric"><span>⌁</span><p><small>Expédition</small><strong>${state.progress} %</strong><em>${phaseLabel()}</em></p></div>
    <div class="metric clock"><span>◷</span><p><small>Temps du convoi</small><strong data-convoy-clock>${formatClock(state.convoyMinutes)}</strong><em>${state.convoyPaused ? "suspendu" : `vitesse ×${state.speed}`}</em></p></div>
  </footer>`;
}

function renderPlatformList() {
  return `<aside class="platform-list" aria-label="Plateformes mobiles">
    ${platforms.map(([key, name, detail, status], index) => `<button type="button" data-platform="${key}" class="${state.selectedPlatform === key ? "is-selected" : ""}" aria-pressed="${state.selectedPlatform === key}"><span>${index + 1}</span><span><strong>${name}</strong><small>${detail}</small></span><em>${status}</em></button>`).join("")}
  </aside>`;
}

function renderConvoySurface() {
  return `<section class="surface convoy-surface" aria-label="Coupe habitée de la cité-caravane">
    <div class="weather-brief"><span>Vent nord-ouest · fort</span><strong>Front estimé · 3 jours</strong></div>
    ${renderPlatformList()}
    <p class="world-caption">La vie du convoi continue derrière les outils contextuels.</p>
  </section>`;
}

function renderWeatherSurface() {
  return `<section class="surface atlas-surface" aria-label="Atlas d’exploitation des Bassins fendus">
    <div class="atlas-legend"><p class="kicker">Atlas d’exploitation</p><h1>Bassins fendus</h1><p><span class="legend-line safe"></span>Route renseignée</p><p><span class="legend-line uncertain"></span>Route incertaine</p><p><span class="legend-line front"></span>Front de cendre</p></div>
    <button class="atlas-note note-north" type="button"><strong>Route du nord</strong><span>Éclaireurs · J−2</span><em>Praticable</em></button>
    <button class="atlas-note note-station" type="button" data-action="open-operation"><strong>Vannes Grises</strong><span>Opération active</span><em>${state.progress} % · ${phaseLabel()}</em></button>
    <div class="front-label"><span>≋</span><strong>Front de cendre</strong><small>Avancée estimée · 2 à 4 jours</small></div>
  </section>`;
}

function renderCouncilSurface() {
  return `<section class="surface editorial-surface">
    <div class="editorial-ribbon static-ribbon">
      <img src="assets/liora.png" alt="Portrait peint de Liora, responsable synthétique du prototype">
      <div class="editorial-copy"><p class="speaker">Liora · Terrain · profil de test</p><h1>Le Front accélère au nord</h1><p><strong>Fait connu :</strong> le relevé de Veille-Basse date de deux jours.</p><p><strong>Recommandation :</strong> gardons une marge de retour pour l’équipe des Vannes Grises.</p><p><strong>Enjeu personnel :</strong> j’ai promis aux Vanniers de ne pas sacrifier une équipe pour leur pompe.</p></div>
    </div>
  </section>`;
}

function renderJournalSurface() {
  const baseEntries = [
    ["Aujourd’hui · 08:10", "Mandat des Vannes Grises préparé", "Objectif, responsable, équipement et seuils exposés."],
    ["Hier · 18:40", "Atelier–Opérations disponible", "Quatre Habitants et Liora peuvent partir à la halte."],
    ["J−2 · 14:20", "Rapport des Vanniers", "Renseignement daté ; débit de pompe non confirmé."],
  ];
  const live = state.journal.slice().reverse().map((entry) => [entry.at, entry.title, entry.detail]);
  return `<section class="surface journal-surface"><header><p class="kicker">Journal du Porte-Lanterne</p><h1>Les causes restent attachées aux conséquences</h1></header><ol>${[...live, ...baseEntries].map(([time, title, detail]) => `<li><time>${time}</time><strong>${title}</strong><span>${detail}</span></li>`).join("")}</ol></section>`;
}

function renderSurface() {
  if (state.surface === "meteo") return renderWeatherSurface();
  if (state.surface === "conseil") return renderCouncilSurface();
  if (state.surface === "journal") return renderJournalSurface();
  return renderConvoySurface();
}

function teamCard() {
  return `<article class="team-card">
    <img src="assets/liora.png" alt="Portrait peint de Liora, responsable synthétique du prototype">
    <div><p class="kicker">Responsable · profil de test</p><h2>Liora</h2><p>Terrain majeur · Technique secondaire</p><small>Une seule responsable ; quatre Habitants et leur équipement restent agrégés.</small></div>
    <strong class="team-count">+4<small>Habitants</small></strong>
  </article>`;
}

function forecast() {
  return `<section class="forecast">
    <header><div><p class="kicker">Bilan prévisionnel</p><h2>Certitudes séparées des renseignements</h2></div><button type="button" data-action="toggle-sources" aria-expanded="${state.sourcesOpen}">◎ Sources</button></header>
    <div class="forecast-cards">
      <article class="certain"><small>Coûts certains</small><strong>Vivres −0,3 j · Eau −0,2 j</strong><span>Matériaux −2 · Liora quitte Atelier–Opérations</span></article>
      <article class="estimated"><small>Issue estimée</small><strong>Eau +1,8–2,7 j</strong><span>Durée 4 h 10–5 h 20</span></article>
      <article class="risk"><small>Risque nommé</small><strong>Exposition à la cendre · marquée</strong><span>Mitigation : filtres doubles · pire issue crédible : blessure</span></article>
    </div>
    ${state.sourcesOpen ? `<div class="source-notes"><p><strong>Durée :</strong> itinéraire des Vanniers, observé il y a 2 jours.</p><p><strong>Gain :</strong> débit mesuré il y a 9 jours ; pompe signalée instable.</p><p><strong>Risque :</strong> cendre confirmée ce matin ; filtration intérieure inconnue.</p></div>` : ""}
  </section>`;
}

function preparationPanel() {
  return `<aside class="operation-panel preparation-panel" aria-label="Préparer l’expédition">
    <header><div><p class="kicker">Atelier–Opérations · Proposition recommandée</p><h1>Rétablir la pompe des Vannes Grises</h1></div><button class="close-panel" type="button" data-action="close-operation" aria-label="Fermer le panneau d’opération">×</button></header>
    ${teamCard()}
    <section class="mandate" aria-label="Mandat recommandé">
      <article><span>01 · Objectif</span><strong>Rétablir un débit exploitable</strong><small>Issue de repli : cartographier l’accès et rentrer.</small></article>
      <article><span>02 · Équipement</span><strong>Filtres doubles</strong><small>Une préparation spécialisée, choisie avant le départ.</small></article>
      <article><span>03 · Autonomie</span><strong>Enveloppe bornée</strong><small>Tout écart réversible ≤ 45 min et une dépense mineure.</small></article>
      <article><span>04 · Repli</span><strong>À la première blessure</strong><small>Une exposition traitable reste permise ; une blessure impose le retour.</small></article>
      <article class="wide"><span>Rapports fixes · pas de réglage supplémentaire</span><strong>Départ, chaque jalon cartographié, rupture du mandat et retour</strong><small>L’équipe ne sollicite pas le Porte-Lanterne pour ses décisions réversibles.</small></article>
    </section>
    ${forecast()}
    <button class="primary-action" type="button" data-action="launch">Confirmer le mandat et lancer</button>
  </aside>`;
}

const mapNodes = [
  ["Phare", 9, 78, 0],
  ["Canal sec", 29, 58, 1],
  ["Passerelle", 49, 66, 2],
  ["Hall filtré", 67, 41, 3],
  ["Pompe", 87, 22, 4],
];

function operationMap() {
  const currentStep = Math.min(state.step, 4);
  return `<section class="operation-map" aria-label="Opération cartographiée des Vannes Grises">
    <header><div><p class="kicker">Atlas d’exploitation · Opération cartographiée</p><h1>Station des Vannes Grises</h1></div><div><span>7,2 km</span><strong>${state.progress} %</strong></div></header>
    <div class="map-canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="route-base" pathLength="100" d="M9 78 C18 65,24 60,29 58 S42 65,49 66 S59 54,67 41 S78 29,87 22"/><path class="route-progress" pathLength="100" style="--progress:${state.progress}" d="M9 78 C18 65,24 60,29 58 S42 65,49 66 S59 54,67 41 S78 29,87 22"/></svg>
      ${mapNodes.map(([label, x, y, step]) => `<button class="map-node ${step <= currentStep && state.phase !== "prepare" ? "reached" : ""} ${step === currentStep && state.phase !== "complete" ? "current" : ""}" style="--x:${x}%;--y:${y}%" type="button"><span></span><small>${label}</small></button>`).join("")}
      ${state.phase === "escalation" ? `<div class="order-marker"><strong>!</strong><span>Ordre requis</span><small>L’équipe attend à l’abri.</small></div>` : ""}
      <div class="map-wind">Vent de cendre ↗</div>
    </div>
    <footer><span>— connu</span><span>┄ estimation datée</span><span>! hors mandat</span></footer>
  </section>`;
}

function operationLog(limit = 5) {
  return `<section class="operation-log"><header><p class="kicker">Liaison radio · rapports fixes</p><span>▮▮▮□ stable</span></header><div>${state.journal.slice(-limit).reverse().map((entry) => `<article class="${entry.kind}"><time>${entry.at}</time><p><strong>${entry.title}</strong><span>${entry.detail}</span></p></article>`).join("")}</div></section>`;
}

function activePanel() {
  return `<aside class="operation-panel active-panel">
    <header><div><p class="kicker">Opération active · ${phaseLabel()}</p><h1>Vannes Grises</h1></div><button class="close-panel" type="button" data-action="close-operation" aria-label="Fermer le panneau d’opération">×</button></header>
    <dl class="operation-status"><div><dt>Progression</dt><dd>${state.progress} %</dd></div><div><dt>Temps d’opération</dt><dd>${formatDuration(state.operationMinutes)}</dd></div><div><dt>Contact</dt><dd>${state.phase === "escalation" ? "Équipe en attente" : "Radio stable"}</dd></div></dl>
    <div class="mandate-reminder"><span>Mandat</span><strong>Écart réversible ≤45 min · repli à la première blessure</strong></div>
    ${operationLog()}
    ${state.phase === "active" ? `<button class="prototype-action" type="button" data-action="advance">Prototype · atteindre le prochain jalon</button>` : ""}
    ${state.phase === "returning" ? `<button class="primary-action" type="button" data-action="return">Recevoir l’équipe et le bilan</button>` : ""}
    ${state.phase === "escalation" ? `<p class="waiting-note">L’Expédition est suspendue. Le Temps du convoi ${state.convoyPaused ? "est suspendu par votre ordre" : "continue"}.</p>` : ""}
  </aside>`;
}

function decisionRibbon() {
  if (state.phase !== "escalation") return "";
  return `<section class="decision-ribbon" role="alertdialog" aria-labelledby="decision-title">
    <img src="assets/liora.png" alt="Portrait peint de Liora, responsable synthétique du prototype">
    <div class="decision-copy"><p class="speaker">Liora · Terrain · ordre hors mandat</p><h1 id="decision-title">La salle des pompes est encore alimentée</h1><div class="decision-voices"><p><small>Fait connu · capteur de l’équipe</small><strong>Galerie praticable encore 20 à 35 min.</strong></p><p><small>Recommandation</small><strong>Couper l’alimentation et préserver l’équipe.</strong></p><p><small>Enjeu personnel</small><strong>Ne pas franchir le seuil de blessure promis.</strong></p></div></div>
    <div class="decision-options">
      <button type="button" data-decision="cut" class="recommended"><strong>Couper puis contourner</strong><span>+45 min certain · Eau +1,2–1,9 j · risque faible</span><small>Recommandé</small></button>
      <button type="button" data-decision="force"><strong>Forcer la galerie</strong><span>+20 min estimé · Eau +2,2–2,9 j · exposition forte</span></button>
      <button type="button" data-decision="retreat"><strong>Ordonner le repli</strong><span>Coûts de départ perdus · renseignement conservé</span></button>
    </div>
    <p class="pause-rule"><strong>Règle recommandée :</strong> l’Expédition attend, le convoi continue. Seule une Crise à conséquence immédiate suspendrait automatiquement le Temps du convoi.</p>
  </section>`;
}

function resultPanel() {
  const outcomes = {
    cut: ["Pompe partiellement réamorcée", "Eau +1,6 j", "+52 min", "Aucune blessure", "Alimentation coupée ; débit réduit, retour sûr."],
    force: ["Pompe réamorcée sous exposition", "Eau +2,6 j", "+28 min", "1 exposition traitée", "Galerie forcée ; les filtres ont évité l’aggravation."],
    retreat: ["Équipe rentrée sans la pompe", "Aucun gain", "+1 h 15", "Aucune blessure", "Repli ordonné avant la salle des pompes."],
  };
  const [title, gain, delay, people, cause] = outcomes[state.decision] ?? outcomes.cut;
  return `<aside class="operation-panel result-panel"><header><div><p class="kicker">Bilan de retour · prévu contre réalisé</p><h1>${title}</h1></div><button class="close-panel" type="button" data-action="close-operation" aria-label="Fermer le bilan">×</button></header>
    <div class="result-comparison"><article><small>Gain réalisé</small><strong>${gain}</strong><span>Prévu : Eau +1,8–2,7 j</span></article><article><small>Durée réalisée</small><strong>${formatDuration(state.operationMinutes)}</strong><span>Écart : ${delay}</span></article><article><small>Équipe</small><strong>${people}</strong><span>Liora et 4 Habitants revenus</span></article></div>
    <p class="cause"><strong>Cause de l’écart :</strong> ${cause}</p>
    <section class="decision-capture"><p class="kicker">Ce que le système mémorise</p><ul><li>coûts consommés et gains rapportés ;</li><li>écarts autonomes et ordre transmis ;</li><li>blessure, renseignement, engagement ou cicatrice éventuels ;</li><li>comparaison causale accessible dans le Journal.</li></ul></section>
  </aside>`;
}

function renderOperationLayer() {
  if (!state.operationOpen) return "";
  if (state.phase === "prepare") return preparationPanel();
  if (state.phase === "complete") return `${operationMap()}${resultPanel()}`;
  return `${operationMap()}${activePanel()}${decisionRibbon()}`;
}

function stateDump() {
  return `<details class="state-dump"><summary>Prototype · état complet</summary><pre>${escapeHtml(JSON.stringify(state, null, 2))}</pre></details>`;
}

function render(announcement = "") {
  main.innerHTML = `<div class="game-shell surface-${state.surface} phase-${state.phase}">${renderTopbar()}${renderSurface()}${renderOperationLayer()}${renderMetrics()}${stateDump()}<span class="prototype-mark">Prototype jetable · proposition recommandée</span></div>`;
  bindInteractions();
  if (announcement) announcer.textContent = announcement;
}

function bindInteractions() {
  main.querySelectorAll("[data-surface]").forEach((button) => button.addEventListener("click", () => {
    state.surface = button.dataset.surface;
    state.operationOpen = false;
    render(`${button.textContent.trim()} ouvert.`);
  }));
  main.querySelectorAll("[data-platform]").forEach((button) => button.addEventListener("click", () => {
    state.selectedPlatform = button.dataset.platform;
    if (state.selectedPlatform === "operations") state.operationOpen = true;
    render(`${platforms.find(([key]) => key === state.selectedPlatform)[1]} sélectionné.`);
  }));
  main.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action)));
  main.querySelectorAll("[data-speed]").forEach((button) => button.addEventListener("click", () => {
    state.speed = Number(button.dataset.speed);
    state.convoyPaused = false;
    render(`Temps du convoi en vitesse ${state.speed}.`);
  }));
  main.querySelectorAll("[data-decision]").forEach((button) => button.addEventListener("click", () => chooseDecision(button.dataset.decision)));
}

function handleAction(action) {
  if (action === "toggle-pause") {
    state.convoyPaused = !state.convoyPaused;
    render(state.convoyPaused ? "Temps du convoi suspendu." : "Temps du convoi repris.");
  }
  if (action === "open-operation") {
    state.surface = "convoi";
    state.selectedPlatform = "operations";
    state.operationOpen = true;
    render("Opération active ouverte depuis Atelier–Opérations.");
  }
  if (action === "close-operation") {
    state.operationOpen = false;
    render("Retour à la Coupe habitée.");
  }
  if (action === "toggle-sources") {
    state.sourcesOpen = !state.sourcesOpen;
    render(state.sourcesOpen ? "Sources des estimations affichées." : "Sources masquées.");
  }
  if (action === "launch") launchMission();
  if (action === "advance") advanceMission();
  if (action === "return") completeMission();
}

function log(kind, title, detail) {
  state.journal.push({ at: formatClock(state.convoyMinutes), kind, title, detail });
}

function launchMission() {
  state.phase = "active";
  state.step = 1;
  state.progress = 18;
  state.operationMinutes = 42;
  log("order", "Mandat confirmé", "Objectif borné · Liora responsable · filtres doubles · repli à la première blessure.");
  log("report", "Canal sec atteint", "Rapport de jalon ; aucun ordre demandé.");
  render("Expédition lancée. Premier jalon cartographié atteint.");
}

function advanceMission() {
  if (state.phase !== "active") return;
  if (state.step === 1) {
    state.step = 2;
    state.progress = 41;
    state.operationMinutes += 54;
    log("autonomy", "Passerelle rompue : détour autonome", "Écart réversible dans le mandat ; +28 min, aucune dépense supplémentaire.");
    render("Liora traite un détour réversible sans solliciter le Porte-Lanterne.");
    return;
  }
  if (state.step === 2) {
    state.step = 3;
    state.progress = 66;
    state.operationMinutes += 61;
    log("autonomy", "Sas contaminé traité sans ordre", "Les filtres doubles absorbent le coût prévu ; le seuil de repli n’est pas franchi.");
    render("L’équipement préparé absorbe l’incident ordinaire.");
    return;
  }
  state.phase = "escalation";
  state.progress = 68;
  log("escalation", "Ordre demandé depuis le hall filtré", "Objectif, risque et gain changent ensemble : aucune issue ne reste dans le mandat.");
  render("L’Expédition attend un ordre important tandis que le Temps du convoi continue.");
}

function chooseDecision(decision) {
  state.decision = decision;
  state.phase = "returning";
  state.step = 4;
  state.progress = decision === "retreat" ? 70 : 92;
  if (decision === "cut") {
    state.operationMinutes += 74;
    log("order", "Ordre transmis : couper puis contourner", "Débit réduit accepté ; retour sans exposition annoncé.");
  }
  if (decision === "force") {
    state.operationMinutes += 49;
    log("order", "Ordre transmis : forcer la galerie", "Gain supérieur visé ; une exposition reste sous surveillance.");
  }
  if (decision === "retreat") {
    state.operationMinutes += 35;
    log("order", "Ordre transmis : repli", "La salle est balisée ; l’équipe conserve le renseignement.");
  }
  log("report", "Retour engagé", "Le mandat reprend effet ; aucun nouvel ordre attendu.");
  render("Ordre transmis. L’équipe reprend son autonomie pour le retour.");
}

function completeMission() {
  state.phase = "complete";
  state.step = 5;
  state.progress = 100;
  state.operationMinutes += 76;
  log("result", "Équipe revenue à Atelier–Opérations", state.decision === "cut" ? "Pompe partiellement réamorcée ; aucune blessure." : state.decision === "force" ? "Pompe réamorcée ; une exposition traitée." : "Équipe intacte ; pompe inactive.");
  render("Bilan reçu. Prévision, réalisation et causes sont comparées.");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

window.setInterval(() => {
  if (state.convoyPaused || state.phase === "prepare" || state.phase === "complete") return;
  state.convoyMinutes += state.speed;
  if (state.phase === "active" || state.phase === "returning") state.operationMinutes += state.speed;
  document.querySelectorAll("[data-convoy-clock]").forEach((node) => { node.textContent = formatClock(state.convoyMinutes); });
}, 2000);

render();
