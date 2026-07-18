// PROTOTYPE JETABLE : trois organisations de la même vue temps réel, via ?variant=A|B|C.

const variants = {
  A: { name: "Cité vivante", description: "La ville d’abord" },
  B: { name: "Poste du phare", description: "Commandement latéral" },
  C: { name: "Table d’exploitation", description: "État et anticipation" },
};

const platformDefinitions = [
  { id: "phare", name: "Phare central", kind: "Conseil · communications", x: 42, y: 33, w: 16, h: 26, rotate: -1, integrity: 91, inhabitants: 18, slots: 0, icon: "✦" },
  { id: "habitats-nord", name: "Habitats nord", kind: "Dortoirs · réfectoire", x: 23, y: 31, w: 17, h: 19, rotate: 2, integrity: 84, inhabitants: 41, slots: 1, icon: "▥" },
  { id: "serres", name: "Jardins suspendus", kind: "Serres · cuisines", x: 11, y: 11, w: 18, h: 17, rotate: -4, integrity: 72, inhabitants: 14, slots: 1, icon: "♨" },
  { id: "eau", name: "Bassins gris", kind: "Eau · filtres", x: 36, y: 8, w: 16, h: 17, rotate: 3, integrity: 79, inhabitants: 10, slots: 0, icon: "◉" },
  { id: "atelier", name: "Cour des grues", kind: "Ateliers · fonderie", x: 62, y: 15, w: 19, h: 20, rotate: 3, integrity: 67, inhabitants: 23, slots: 1, icon: "⚙" },
  { id: "infirmerie", name: "Maison blanche", kind: "Soins · quarantaine", x: 61, y: 40, w: 16, h: 17, rotate: -2, integrity: 88, inhabitants: 13, slots: 0, icon: "+" },
  { id: "hangar", name: "Porte orientale", kind: "Expéditions · radio", x: 77, y: 46, w: 18, h: 20, rotate: 4, integrity: 74, inhabitants: 12, slots: 1, icon: "➤" },
  { id: "depots", name: "Dépôts bas", kind: "Pièces · récupération", x: 24, y: 61, w: 19, h: 19, rotate: -3, integrity: 76, inhabitants: 9, slots: 2, icon: "▦" },
  { id: "chaufferie", name: "Chaufferie rouge", kind: "Chaleur · énergie", x: 47, y: 68, w: 17, h: 18, rotate: 2, integrity: 58, inhabitants: 11, slots: 0, icon: "♨" },
  { id: "habitats-ouest", name: "Faubourg ouest", kind: "Logements · bains", x: 4, y: 44, w: 17, h: 20, rotate: 3, integrity: 81, inhabitants: 27, slots: 1, icon: "▤" },
];

function initialState() {
  return {
    simMinutes: 7 * 60 + 20,
    speed: 1,
    paused: false,
    status: "travel",
    routeProgress: 72,
    routeChoice: null,
    selectedPlatform: "phare",
    panel: null,
    buildMode: false,
    plannedBuilding: null,
    activeIncident: true,
    incidentMinutes: 300,
    incidentOutcome: null,
    councilStep: null,
    councilChoice: null,
    expeditionProgress: null,
    journal: ["07:12 · La formation s’est resserrée avant le col."],
  };
}

let state = initialState();
const main = document.querySelector("#realtime-main");
const announcer = document.querySelector("#announcer");
const variantName = document.querySelector("#variant-name");
const switcherLabel = document.querySelector("#switcher-label");

function getVariant() {
  const key = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
  return variants[key] ? key : "A";
}

function setVariant(key) {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", key);
  window.history.replaceState({}, "", url);
  render(`Variante ${key}, ${variants[key].name}`);
}

function cycleVariant(direction) {
  const keys = Object.keys(variants);
  const index = keys.indexOf(getVariant());
  setVariant(keys[(index + direction + keys.length) % keys.length]);
}

function formatTime() {
  const minutes = state.simMinutes % (24 * 60);
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, "0")}:${String(Math.floor(minutes % 60)).padStart(2, "0")}`;
}

function autonomyStrip(compact = false) {
  const resources = [
    ["Eau", "3,4 j", "1 840 L · +42 L/h · −65 L/h"],
    ["Vivres", "5,8 j", "2 920 rations · +18/h · −39/h"],
    ["Carburant", "2,1 tronçons", "740 L · −22 L/h en marche"],
    ["Chaleur", "+12 %", "Marge thermique · chaufferie à 78 %"],
    ["Soins", "Correct", "21 traitements · consommation irrégulière"],
    ["Pièces", "Fragile", "9 caisses · deux réparations urgentes"],
  ];
  return `<section class="autonomy-strip ${compact ? "is-compact" : ""}" aria-label="Autonomie estimée">
    ${resources.map(([name, value, detail]) => `<button class="autonomy" type="button"><span>${name}</span><strong>${value}</strong><small class="resource-detail">${detail}</small></button>`).join("")}
  </section>`;
}

function routeStatus() {
  const label = state.status === "travel" ? "EN MARCHE" : "À L’ARRÊT";
  const progress = state.status === "travel" ? `${Math.round(state.routeProgress)} % du tronçon` : "Halte du col des Verrières";
  return `<div class="route-status"><span class="pulse ${state.paused ? "is-paused" : ""}"></span><div><strong>${label}</strong><small data-route-progress>${progress}</small></div><time data-clock>${formatTime()}</time></div>`;
}

function cityScene() {
  const buildClass = state.buildMode ? "is-building" : "";
  const lines = [
    [50, 45, 31, 40], [50, 40, 44, 18], [54, 42, 70, 25], [55, 49, 68, 48],
    [45, 50, 33, 70], [49, 55, 55, 76], [31, 38, 19, 20], [25, 46, 12, 53],
    [74, 50, 85, 55], [35, 68, 53, 76], [18, 53, 32, 69],
  ];
  return `<section class="playfield ${buildClass}" aria-label="Vue oblique de la cité-caravane">
    <div class="ash-layer" aria-hidden="true"></div>
    ${routeStatus()}
    <div class="city-map">
      <svg class="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${lines.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`).join("")}
      </svg>
      ${platformDefinitions.map(platformButton).join("")}
      <div class="formation-arrow" aria-hidden="true"><span>route</span> ↗</div>
    </div>
    <p class="scene-hint">Cliquer sur une plateforme · molette pour imaginer le zoom · aucune rotation</p>
  </section>`;
}

function platformButton(platform) {
  const selected = state.selectedPlatform === platform.id ? "is-selected" : "";
  const available = state.buildMode && platform.slots > 0 ? "has-compatible-slot" : "";
  const damaged = platform.integrity < 65 ? "is-damaged" : "";
  const planned = state.plannedBuilding?.platform === platform.id ? `<span class="planned-site">+ ${state.plannedBuilding.name}</span>` : "";
  return `<button class="platform ${selected} ${available} ${damaged}" type="button" data-platform="${platform.id}" style="--x:${platform.x}%;--y:${platform.y}%;--w:${platform.w}%;--h:${platform.h}%;--r:${platform.rotate}deg" aria-label="${platform.name}, intégrité ${platform.integrity} %, ${platform.inhabitants} habitants">
    <span class="platform-icon" aria-hidden="true">${platform.icon}</span>
    <span class="platform-name">${platform.name}</span>
    <span class="platform-kind">${platform.kind}</span>
    <span class="people" aria-hidden="true">•• • ••</span>
    ${platform.slots > 0 ? `<span class="slot-count">${platform.slots} empl.</span>` : ""}
    ${planned}
  </button>`;
}

function alertStack() {
  if (!state.activeIncident && !state.incidentOutcome) return `<section class="alert-stack"><p class="all-clear">Aucun incident actif</p></section>`;
  if (!state.activeIncident) return `<section class="alert-stack"><article class="alert-card is-resolved"><span>Résolu automatiquement</span><strong>Fuite de vapeur contenue</strong><small>${state.incidentOutcome}</small></article></section>`;
  return `<section class="alert-stack" aria-label="Incidents en cours"><button class="alert-card" type="button" data-panel="incident"><span>Incident ordinaire · <b data-incident-timer>${Math.ceil(state.incidentMinutes)}</b> min</span><strong>Fuite de vapeur</strong><small>Chaufferie rouge · l’équipe affectée interviendra sans ordre.</small></button></section>`;
}

function actionBar(vertical = false) {
  const expeditionDisabled = state.status === "travel" ? "disabled" : "";
  return `<nav class="action-bar ${vertical ? "is-vertical" : ""}" aria-label="Actions du Porte-Lanterne">
    <button type="button" data-panel="build" class="${state.panel === "build" ? "is-active" : ""}"><span>⌂</span><strong>Construire</strong><small>${state.status === "travel" ? "Planifier" : "Lancer"}</small></button>
    <button type="button" data-panel="assign" class="${state.panel === "assign" ? "is-active" : ""}"><span>♟</span><strong>Affectations</strong><small>3 responsables</small></button>
    <button type="button" data-panel="maintenance" class="${state.panel === "maintenance" ? "is-active" : ""}"><span>⚒</span><strong>Maintenance</strong><small>2 urgences</small></button>
    <button type="button" data-panel="expedition" ${expeditionDisabled}><span>⌁</span><strong>Expédition</strong><small>${state.status === "travel" ? "À la halte" : "Disponible"}</small></button>
  </nav>`;
}

function timeControls() {
  return `<div class="time-controls" aria-label="Vitesse du Temps du convoi">
    <button type="button" data-speed="pause" class="${state.paused ? "is-active" : ""}" aria-label="Pause">Ⅱ</button>
    ${[1, 2, 4].map(speed => `<button type="button" data-speed="${speed}" class="${!state.paused && state.speed === speed ? "is-active" : ""}">×${speed}</button>`).join("")}
    <button class="prototype-skip" type="button" data-arrive>${state.status === "travel" ? "Prototype : atteindre la halte" : "Halte atteinte"}</button>
  </div>`;
}

function contextPanel() {
  if (state.panel === "build") return buildPanel();
  if (state.panel === "incident") return incidentPanel();
  if (state.panel === "assign") return assignmentPanel();
  if (state.panel === "maintenance") return maintenancePanel();
  if (state.panel === "expedition") return expeditionPanel();
  const platform = platformDefinitions.find(item => item.id === state.selectedPlatform) ?? platformDefinitions[0];
  return `<aside class="context-panel"><p class="eyebrow">Plateforme sélectionnée</p><h2>${platform.name}</h2><p>${platform.kind}</p><dl><div><dt>Intégrité</dt><dd>${platform.integrity} %</dd></div><div><dt>Habitants</dt><dd>${platform.inhabitants}</dd></div><div><dt>Emplacements libres</dt><dd>${platform.slots}</dd></div></dl><button class="panel-action" type="button" data-panel="build" ${platform.slots ? "" : "disabled"}>Voir les constructions compatibles</button></aside>`;
}

function buildPanel() {
  const selected = platformDefinitions.find(item => item.id === state.selectedPlatform);
  return `<aside class="context-panel build-panel"><p class="eyebrow">Mode construction</p><h2>${selected?.slots ? selected.name : "Choisir un emplacement"}</h2>
    <p>${state.status === "travel" ? "Les grands travaux seront planifiés et démarreront automatiquement à la prochaine halte." : "La cité est à l’arrêt : le chantier peut commencer immédiatement."}</p>
    ${selected?.slots ? `<div class="build-options">
      <button type="button" data-plan-building="Serre hydroponique"><strong>Serre hydroponique</strong><small>Vivres +1,2 j · chaleur −4 % · 6 spécialistes</small></button>
      <button type="button" data-plan-building="Dortoir isolé"><strong>Dortoir isolé</strong><small>Capacité +24 · chaleur −2 % · moral +3</small></button>
      <button type="button" data-plan-building="Échangeur thermique"><strong>Échangeur thermique</strong><small>Marge thermique +8 % · pièces −3</small></button>
    </div>` : `<div class="build-instruction">Les plateformes compatibles sont cerclées d’ambre. Sélectionnez l’une de leurs zones libres.</div>`}
    ${state.plannedBuilding ? `<div class="planned-project"><strong>Planifié : ${state.plannedBuilding.name}</strong><span>Démarrage à la prochaine halte · priorité normale</span></div>` : ""}
  </aside>`;
}

function incidentPanel() {
  return `<aside class="context-panel"><p class="eyebrow">Incident ordinaire · ${Math.ceil(state.incidentMinutes)} min restantes</p><h2>Fuite de vapeur</h2><p>Une conduite secondaire chauffe les passerelles. Si vous ne donnez aucun ordre, l’équipe de Nara appliquera la doctrine de maintenance préventive.</p><div class="known-outcome"><strong>Résolution prévue</strong>Contenir la fuite · marge thermique −2 % · aucun blessé probable</div><div class="panel-buttons"><button type="button" data-incident="intervene">Détourner deux mécaniciens</button><button type="button" data-close-panel>Laisser l’affectation agir</button></div></aside>`;
}

function assignmentPanel() {
  return `<aside class="context-panel"><p class="eyebrow">Affectations persistantes</p><h2>Responsables de quartier</h2><div class="assignment-list"><div><strong>Nara</strong><span>Ateliers · maintenance préventive</span><small>Transfert : 2 h</small></div><div><strong>Ivo</strong><span>Maison blanche · quarantaine stricte</span><small>Transfert : 35 min</small></div><div><strong>Senn</strong><span>Jardins · rendement stable</span><small>Transfert : 1 h 10</small></div></div><p class="panel-note">Les habitants suivent ces priorités. Aucun horaire individuel n’est nécessaire.</p></aside>`;
}

function maintenancePanel() {
  return `<aside class="context-panel"><p class="eyebrow">Maintenance</p><h2>Deux fragilités connues</h2><div class="maintenance-list"><button type="button" data-select-platform="chaufferie"><strong>Chaufferie rouge · 58 %</strong><small>Réparation légère possible en marche</small></button><button type="button" data-select-platform="atelier"><strong>Cour des grues · 67 %</strong><small>Renfort structurel exigeant une halte</small></button></div><div class="known-outcome"><strong>Si une plateforme s’immobilise</strong>Réparer, remorquer, évacuer et récupérer, ou abandonner.</div></aside>`;
}

function expeditionPanel() {
  return `<aside class="context-panel"><p class="eyebrow">Opération cartographiée</p><h2>${state.expeditionProgress === null ? "Station de pompage" : "Équipe sur le terrain"}</h2>${state.expeditionProgress === null ? `<p>Durée estimée 4 h 20 · eau +2,1 j possible · risque de contamination connu.</p><button class="panel-action" type="button" data-launch-expedition>Lancer avec Nara et deux habitants</button>` : `<p>Progression ${Math.round(state.expeditionProgress)} % · contact radio stable. La cité continue de fonctionner pendant l’opération.</p><progress max="100" value="${state.expeditionProgress}"></progress>`}</aside>`;
}

function journalPanel() {
  return `<section class="journal-panel"><p class="eyebrow">Journal du phare</p>${state.journal.slice(-4).reverse().map(entry => `<p>${entry}</p>`).join("")}</section>`;
}

function stateDump() {
  return `<details class="state-dump"><summary>État simulé complet</summary><pre>${escapeHtml(JSON.stringify(state, null, 2))}</pre></details>`;
}

function renderCityFirst() {
  return `<div class="variant variant-a">${autonomyStrip()}<div class="city-stage">${cityScene()}${alertStack()}${contextPanel()}</div>${actionBar()}${timeControls()}${stateDump()}</div>`;
}

function renderCommandPost() {
  return `<div class="variant variant-b"><aside class="command-rail">${routeStatus()}${autonomyStrip(true)}${actionBar(true)}${journalPanel()}</aside><div class="command-playfield">${cityScene()}${timeControls()}</div>${contextPanel()}${alertStack()}${stateDump()}</div>`;
}

function renderOperationsTable() {
  return `<div class="variant variant-c"><header class="operations-header">${routeStatus()}${autonomyStrip(true)}${timeControls()}</header><div class="operations-city">${cityScene()}</div><div class="operations-console"><section>${alertStack()}${journalPanel()}</section>${actionBar(true)}${contextPanel()}</div>${stateDump()}</div>`;
}

function councilModal() {
  if (!state.councilStep) return "";
  if (state.councilStep === "council") {
    return `<div class="modal-backdrop"><section class="decision-modal" role="dialog" aria-modal="true" aria-labelledby="decision-title"><p class="eyebrow">Pause automatique · conseil de fin de tronçon</p><h1 id="decision-title">Dix-huit personnes attendent sous le viaduc</h1><p>Les accueillir apporte des bras et deux familles de puisatiers, mais réduit l’autonomie immédiate en vivres.</p><div class="decision-options"><button type="button" data-council="welcome"><strong>Ouvrir les passerelles</strong><small>Population +18 · vivres −0,6 j · deux puisatiers</small></button><button type="button" data-council="refuse"><strong>Fournir des rations et repartir</strong><small>Vivres −0,2 j · moral −5 · groupe laissé sur place</small></button></div></section></div>`;
  }
  return `<div class="modal-backdrop"><section class="decision-modal" role="dialog" aria-modal="true" aria-labelledby="decision-title"><p class="eyebrow">Bifurcation réelle · route suivante</p><h1 id="decision-title">Après le col, deux voies demeurent</h1><div class="route-options"><button type="button" data-route="rail"><strong>La tranchée du Rail</strong><span>9 h estimées · carburant 0,7 tronçon · cendre modérée</span><small>Connu : atelier de la République du Rail. Risque caché.</small></button><button type="button" data-route="puits"><strong>Les Puits de Marne</strong><span>14 h estimées · carburant 1,1 tronçon · vents instables</span><small>Connu : eau négociable. Risque caché.</small></button></div></section></div>`;
}

function render(announcement = "") {
  const key = getVariant();
  variantName.textContent = `${key} — ${variants[key].description}`;
  switcherLabel.textContent = `${key} — ${variants[key].name}`;
  main.innerHTML = key === "A" ? renderCityFirst() : key === "B" ? renderCommandPost() : renderOperationsTable();
  main.insertAdjacentHTML("beforeend", councilModal());
  bindInteractions();
  if (announcement) announcer.textContent = announcement;
}

function bindInteractions() {
  main.querySelectorAll("[data-platform]").forEach(button => button.addEventListener("click", () => {
    state.selectedPlatform = button.dataset.platform;
    if (!state.buildMode) state.panel = null;
    render(`${platformDefinitions.find(item => item.id === state.selectedPlatform).name} sélectionnée.`);
  }));
  main.querySelectorAll("[data-panel]").forEach(button => button.addEventListener("click", () => {
    if (button.disabled) return;
    state.panel = button.dataset.panel;
    state.buildMode = state.panel === "build";
    if (state.buildMode && !(platformDefinitions.find(item => item.id === state.selectedPlatform)?.slots > 0)) state.selectedPlatform = "phare";
    render(`${button.textContent.trim()} ouvert.`);
  }));
  main.querySelectorAll("[data-close-panel]").forEach(button => button.addEventListener("click", () => { state.panel = null; state.buildMode = false; render("Panneau fermé."); }));
  main.querySelectorAll("[data-speed]").forEach(button => button.addEventListener("click", () => setSpeed(button.dataset.speed)));
  main.querySelectorAll("[data-arrive]").forEach(button => button.addEventListener("click", arriveAtHalt));
  main.querySelectorAll("[data-plan-building]").forEach(button => button.addEventListener("click", () => planBuilding(button.dataset.planBuilding)));
  main.querySelectorAll("[data-incident]").forEach(button => button.addEventListener("click", interveneIncident));
  main.querySelectorAll("[data-select-platform]").forEach(button => button.addEventListener("click", () => { state.selectedPlatform = button.dataset.selectPlatform; state.panel = null; render("Plateforme affichée."); }));
  main.querySelectorAll("[data-council]").forEach(button => button.addEventListener("click", () => resolveCouncil(button.dataset.council)));
  main.querySelectorAll("[data-route]").forEach(button => button.addEventListener("click", () => chooseRoute(button.dataset.route)));
  main.querySelectorAll("[data-launch-expedition]").forEach(button => button.addEventListener("click", launchExpedition));
}

function setSpeed(value) {
  if (value === "pause") state.paused = true;
  else { state.paused = false; state.speed = Number(value); }
  render(state.paused ? "Temps du convoi suspendu." : `Vitesse ${state.speed}.`);
}

function planBuilding(name) {
  const platform = platformDefinitions.find(item => item.id === state.selectedPlatform);
  state.plannedBuilding = { name, platform: platform.id, status: state.status === "travel" ? "queued" : "building", progress: 0 };
  state.journal.push(`${formatTime()} · ${name} ${state.status === "travel" ? "planifié pour la halte" : "mis en chantier"}.`);
  render(`${name} planifié sur ${platform.name}.`);
}

function interveneIncident() {
  state.activeIncident = false;
  state.incidentOutcome = "Deux mécaniciens détournés · réparation immédiate · atelier ralenti 40 min.";
  state.panel = null;
  state.journal.push(`${formatTime()} · Ordre direct : fuite de vapeur colmatée.`);
  render("Fuite colmatée par ordre direct.");
}

function autoResolveIncident() {
  state.activeIncident = false;
  state.incidentOutcome = "Doctrine de Nara appliquée · marge thermique −2 % · aucun blessé.";
  if (state.panel === "incident") state.panel = null;
  state.journal.push(`${formatTime()} · La fuite de vapeur a été contenue par l’affectation en place.`);
}

function arriveAtHalt() {
  if (state.status === "halt") return;
  state.status = "halt";
  state.routeProgress = 100;
  state.paused = true;
  state.councilStep = "council";
  state.panel = null;
  state.buildMode = false;
  if (state.plannedBuilding) state.plannedBuilding.status = "building";
  state.journal.push(`${formatTime()} · Halte du col des Verrières. Conseil convoqué.`);
  render("Halte atteinte. Conseil convoqué, temps suspendu.");
}

function resolveCouncil(choice) {
  state.councilChoice = choice;
  state.journal.push(`${formatTime()} · Conseil : ${choice === "welcome" ? "les passerelles sont ouvertes" : "le groupe reçoit des rations"}.`);
  state.councilStep = "route";
  render("Décision du conseil enregistrée. Choix de route.");
}

function chooseRoute(route) {
  state.routeChoice = route;
  state.councilStep = null;
  state.paused = true;
  state.journal.push(`${formatTime()} · Route préparée : ${route === "rail" ? "tranchée du Rail" : "Puits de Marne"}.`);
  render("Route choisie. La cité reste à la halte jusqu’à votre ordre.");
}

function launchExpedition() {
  state.expeditionProgress = 8;
  state.paused = false;
  state.speed = 1;
  state.journal.push(`${formatTime()} · L’expédition vers la station de pompage est partie.`);
  render("Expédition lancée. Le Temps du convoi reprend.");
}

function tick() {
  if (state.paused || state.councilStep) return;
  state.simMinutes += state.speed;
  if (state.status === "travel") {
    state.routeProgress = Math.min(100, state.routeProgress + state.speed * 0.08);
    if (state.routeProgress >= 100) { arriveAtHalt(); return; }
  }
  if (state.activeIncident) {
    state.incidentMinutes -= state.speed;
    if (state.incidentMinutes <= 0) { autoResolveIncident(); render("La fuite a été résolue automatiquement."); return; }
  }
  if (state.plannedBuilding?.status === "building") {
    state.plannedBuilding.progress = Math.min(100, state.plannedBuilding.progress + state.speed * 0.2);
  }
  if (state.expeditionProgress !== null) {
    state.expeditionProgress = Math.min(100, state.expeditionProgress + state.speed * 0.12);
  }
  updateLiveIndicators();
}

function updateLiveIndicators() {
  document.querySelectorAll("[data-clock]").forEach(node => { node.textContent = formatTime(); });
  document.querySelectorAll("[data-route-progress]").forEach(node => {
    node.textContent = state.status === "travel" ? `${Math.round(state.routeProgress)} % du tronçon` : "Halte du col des Verrières";
  });
  document.querySelectorAll("[data-incident-timer]").forEach(node => { node.textContent = Math.max(0, Math.ceil(state.incidentMinutes)); });
}

function reset() {
  state = initialState();
  render("Prototype réinitialisé.");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

document.querySelector("#previous-variant").addEventListener("click", () => cycleVariant(-1));
document.querySelector("#next-variant").addEventListener("click", () => cycleVariant(1));
document.querySelector("#reset-prototype").addEventListener("click", reset);
window.addEventListener("keydown", event => {
  if (event.target.matches("input, textarea, select, [contenteditable]")) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
  if (event.key === " ") { event.preventDefault(); setSpeed(state.paused ? state.speed : "pause"); }
  if (["1", "2", "4"].includes(event.key)) setSpeed(event.key);
});

render();
setInterval(tick, 1000);
