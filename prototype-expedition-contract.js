// PROTOTYPE JETABLE : trois contrats d'interface pour la même Opération cartographiée.

const variants = {
  A: { name: "Briefing à trois temps", description: "Préparer · suivre · décider" },
  B: { name: "Carte et radio", description: "La progression d’abord" },
  C: { name: "Mandat d’autonomie", description: "Les seuils d’escalade d’abord" },
};

const equipmentOptions = {
  filters: {
    name: "Filtres doubles",
    effect: "L’équipe peut traiter une exposition ordinaire sans rappeler.",
    cost: "Matériaux −2",
  },
  winch: {
    name: "Treuil portatif",
    effect: "Autorise la récupération d’une pompe, mais ralentit le retour.",
    cost: "Combustible −1 caisse",
  },
  remedies: {
    name: "Trousse de décontamination",
    effect: "Autorise un soin de terrain avant le seuil de repli.",
    cost: "Remèdes −2",
  },
};

const autonomyOptions = {
  strict: {
    name: "Rappeler au premier écart",
    short: "Aucun détour ni dépense supplémentaire sans ordre.",
  },
  bounded: {
    name: "Agir dans une enveloppe",
    short: "Détour ≤ 45 min et une dépense mineure autorisés.",
  },
  broad: {
    name: "Priorité à l’objectif",
    short: "La responsable choisit tout moyen réversible pour atteindre l’objectif.",
  },
};

const retreatOptions = {
  exposure: { name: "À la première exposition", short: "Repli avant toute aggravation." },
  injury: { name: "À la première blessure", short: "Une exposition traitable reste dans le mandat." },
  impossible: { name: "Si l’objectif devient impossible", short: "Le risque humain reste accepté tant qu’il est annoncé." },
};

function initialState() {
  return {
    phase: "prepare",
    expeditionStep: 0,
    expeditionProgress: 0,
    convoyMinutes: 8 * 60 + 10,
    expeditionMinutes: 0,
    convoyPaused: false,
    equipment: "filters",
    autonomy: "bounded",
    retreat: "injury",
    reports: "landmarks",
    decision: null,
    selectedNode: "phare",
    certaintyOpen: false,
    journal: [
      {
        at: "08:10",
        kind: "info",
        title: "Renseignement recoupé",
        detail: "Le rapport des Vanniers date de deux jours ; la station répond encore par intermittence.",
      },
    ],
    realized: {
      materials: 0,
      waterDays: 0,
      remedies: 0,
      delay: 0,
      scar: null,
    },
  };
}

let state = initialState();
const main = document.querySelector("#prototype-main");
const announcer = document.querySelector("#announcer");
const variantChip = document.querySelector("#variant-chip");
const switcherLabel = document.querySelector("#switcher-label");

function getVariant() {
  const key = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
  return variants[key] ? key : "A";
}

function setVariant(key) {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", key);
  window.history.replaceState({}, "", url);
  render(`Variante ${key}, ${variants[key].name}.`);
}

function cycleVariant(direction) {
  const keys = Object.keys(variants);
  const index = keys.indexOf(getVariant());
  setVariant(keys[(index + direction + keys.length) % keys.length]);
}

function formatClock(totalMinutes) {
  const normalized = totalMinutes % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = Math.floor(normalized % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function phaseName() {
  return {
    prepare: "Préparation",
    active: "En opération",
    escalation: "Ordre requis",
    returning: "Retour",
    complete: "Bilan reçu",
  }[state.phase];
}

function missionStatus(compact = false) {
  const stopped = state.phase === "escalation";
  return `<section class="mission-status ${compact ? "is-compact" : ""}" aria-label="État de l’opération">
    <div class="status-primary">
      <span class="signal ${stopped ? "is-waiting" : state.phase === "complete" ? "is-complete" : ""}"></span>
      <div><small>Expédition · ${phaseName()}</small><strong>Station des Vannes Grises</strong></div>
    </div>
    <dl>
      <div><dt>Progression</dt><dd>${state.expeditionProgress} %</dd></div>
      <div><dt>Temps d’opération</dt><dd>${Math.floor(state.expeditionMinutes / 60)} h ${String(state.expeditionMinutes % 60).padStart(2, "0")}</dd></div>
      <div><dt>Contact</dt><dd>${state.phase === "escalation" ? "Équipe en attente" : state.phase === "complete" ? "Compte rendu" : state.phase === "prepare" ? "Testé" : "Radio stable"}</dd></div>
    </dl>
  </section>`;
}

function convoyClock() {
  const expeditionWaiting = state.phase === "escalation";
  return `<section class="convoy-clock ${state.convoyPaused ? "is-paused" : ""}" aria-label="Temps du convoi">
    <div><span class="clock-mark"></span><p><small>Temps du convoi</small><strong data-convoy-clock>${formatClock(state.convoyMinutes)}</strong></p></div>
    <p class="clock-note">${state.convoyPaused ? "Suspendu par le Porte-Lanterne" : expeditionWaiting ? "Continue pendant que l’équipe attend" : "La cité-caravane continue"}</p>
    <button type="button" data-action="toggle-convoy">${state.convoyPaused ? "Reprendre le convoi" : "Suspendre le convoi"}</button>
  </section>`;
}

function certaintyLegend() {
  return `<button class="certainty-toggle" type="button" data-action="certainty" aria-expanded="${state.certaintyOpen}">
      <span>◎</span><strong>Pourquoi des intervalles ?</strong><small>Sources et ancienneté</small>
    </button>
    ${state.certaintyOpen ? `<div class="certainty-popover">
      <p><strong>Durée 4 h 10–5 h 20</strong> — relevé de route des Vanniers, vieux de 2 jours.</p>
      <p><strong>Eau +1,8–2,7 j</strong> — débit mesuré il y a 9 jours, pompe signalée instable.</p>
      <p><strong>Risque : marqué</strong> — cendre ambiante confirmée ce matin, état intérieur inconnu.</p>
    </div>` : ""}`;
}

function forecastPanel(compact = false) {
  return `<section class="forecast-panel ${compact ? "is-compact" : ""}" aria-label="Bilan prévisionnel de l’expédition">
    <header><div><p class="eyebrow">Avant l’ordre de départ</p><h2>Ce qui est certain, ce qui ne l’est pas</h2></div>${certaintyLegend()}</header>
    <div class="forecast-grid">
      <article class="known"><small>Coûts certains</small><strong>Vivres −0,3 j · Eau −0,2 j</strong><span>${equipmentOptions[state.equipment].cost}</span></article>
      <article class="estimated"><small>Issue estimée</small><strong>Eau +1,8–2,7 j</strong><span>Durée 4 h 10–5 h 20</span></article>
      <article class="risk"><small>Risque principal</small><strong>Exposition à la cendre · marquée</strong><span>Filtration intérieure inconnue</span></article>
    </div>
  </section>`;
}

function teamCard() {
  return `<article class="team-card">
    <div class="portrait" aria-hidden="true">M</div>
    <div><p class="eyebrow">Responsable · profil de test</p><h3>Maëlle</h3><p>Terrain majeur · Technique secondaire</p><small>Trait : méthodique — sûre si le plan tient, lente à improviser.</small></div>
    <div class="team-count"><strong>+4</strong><span>Habitants agrégés</span></div>
  </article>`;
}

function selectControl(id, label, value, options, disabled = false) {
  return `<label class="field-control" for="${id}"><span>${label}</span><select id="${id}" data-field="${id}" ${disabled ? "disabled" : ""}>
    ${Object.entries(options).map(([key, option]) => `<option value="${key}" ${key === value ? "selected" : ""}>${option.name}</option>`).join("")}
  </select><small>${options[value].short ?? options[value].effect}</small></label>`;
}

function reportsControl(disabled = false) {
  const reports = {
    landmarks: { name: "À chaque jalon", short: "Départ, entrée, objectif et retour." },
    exception: { name: "Seulement si le mandat casse", short: "Silence radio tant que l’équipe reste dans l’enveloppe." },
  };
  return selectControl("reports", "Rythme des rapports", state.reports, reports, disabled);
}

function preparationControls(layout = "grid") {
  const disabled = state.phase !== "prepare";
  return `<section class="preparation-controls is-${layout}" aria-label="Préparation de l’expédition">
    ${selectControl("equipment", "Équipement spécialisé", state.equipment, equipmentOptions, disabled)}
    ${selectControl("autonomy", "Consigne d’autonomie", state.autonomy, autonomyOptions, disabled)}
    ${selectControl("retreat", "Seuil de repli", state.retreat, retreatOptions, disabled)}
    ${reportsControl(disabled)}
  </section>`;
}

const nodes = [
  { id: "phare", label: "Phare", x: 8, y: 76, step: 0 },
  { id: "canal", label: "Canal sec", x: 28, y: 59, step: 1 },
  { id: "passerelle", label: "Passerelle", x: 48, y: 67, step: 2 },
  { id: "hall", label: "Hall filtré", x: 66, y: 42, step: 3 },
  { id: "pompe", label: "Pompe", x: 86, y: 24, step: 4 },
];

function mapPanel(mode = "standard") {
  const activeStep = Math.min(state.expeditionStep, 4);
  return `<section class="operation-map is-${mode}" aria-label="Carte de l’opération">
    <header><div><p class="eyebrow">Opération cartographiée</p><h2>Station des Vannes Grises</h2></div><span class="map-scale">7,2 km · halo hors portée</span></header>
    <div class="map-canvas">
      <div class="ash-contours" aria-hidden="true"></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="route-base" pathLength="100" d="M8 76 C18 62, 23 63, 28 59 S42 66, 48 67 S58 55, 66 42 S78 31, 86 24" />
        <path class="route-progress" pathLength="100" style="--route-progress:${state.expeditionProgress}" d="M8 76 C18 62, 23 63, 28 59 S42 66, 48 67 S58 55, 66 42 S78 31, 86 24" />
      </svg>
      ${nodes.map((node) => {
        const reached = node.step <= activeStep && state.phase !== "prepare";
        const current = node.step === activeStep && state.phase !== "complete";
        return `<button type="button" class="map-node ${reached ? "is-reached" : ""} ${current ? "is-current" : ""}" data-node="${node.id}" style="--x:${node.x}%;--y:${node.y}%" aria-label="${node.label}, ${reached ? "atteint" : "à venir"}"><span></span><small>${node.label}</small></button>`;
      }).join("")}
      ${state.phase === "escalation" ? `<div class="waiting-marker"><span>!</span><strong>Ordre requis</strong><small>L’équipe reste abritée dans le hall.</small></div>` : ""}
      <div class="wind" aria-hidden="true">vent de cendre ↗</div>
    </div>
    <footer><span>Renseignement confirmé</span><span>≈ Estimation datée</span><span>! Décision hors mandat</span></footer>
  </section>`;
}

function radioLog(limit) {
  const entries = limit ? state.journal.slice(-limit) : state.journal;
  return `<section class="radio-log" aria-label="Journal causal de l’expédition">
    <header><div><p class="eyebrow">Canal 3 · chiffré</p><h2>Journal de liaison</h2></div><span class="radio-quality">▮▮▮□ stable</span></header>
    <div class="log-entries">
      ${entries.slice().reverse().map((entry) => `<article class="log-entry is-${entry.kind}"><time>${entry.at}</time><div><strong>${entry.title}</strong><p>${entry.detail}</p></div></article>`).join("")}
    </div>
  </section>`;
}

function escalationCard() {
  if (state.phase !== "escalation") return "";
  return `<section class="escalation-card" role="alertdialog" aria-labelledby="escalation-title" aria-describedby="escalation-description">
    <p class="eyebrow">Hors de la consigne d’autonomie · expédition suspendue</p>
    <h2 id="escalation-title">La salle des pompes est encore alimentée</h2>
    <p id="escalation-description">Le passage prévu est noyé de cendre. Maëlle peut couper l’alimentation et perdre une partie du débit, forcer la galerie exposée, ou renoncer. Aucune option ne tient dans le mandat actuel.</p>
    <div class="voice-separation">
      <p><small>Fait connu · capteur de l’équipe</small><strong>La galerie courte reste praticable 20 à 35 min.</strong></p>
      <p><small>Recommandation de Maëlle</small><strong>Couper l’alimentation et préserver l’équipe.</strong></p>
      <p><small>Enjeu personnel</small><strong>Son trait méthodique la rend réticente à forcer une installation active.</strong></p>
    </div>
    <div class="decision-options">
      <button type="button" data-decision="cut"><strong>Couper puis contourner</strong><span>+45 min certain · Eau +1,2–1,9 j · risque faible</span><small>Recommandé · conséquence réversible</small></button>
      <button type="button" data-decision="force"><strong>Forcer la galerie</strong><span>+20 min estimé · Eau +2,2–2,9 j · exposition forte</span><small>Le seuil de repli peut être atteint</small></button>
      <button type="button" data-decision="retreat"><strong>Ordonner le repli</strong><span>Perte des coûts de départ · renseignement conservé</span><small>Aucune cicatrice</small></button>
    </div>
    <p class="escalation-footnote">Le Temps du convoi ${state.convoyPaused ? "est suspendu par votre ordre" : "continue pendant cette attente"}.</p>
  </section>`;
}

function resultPanel() {
  if (state.phase !== "complete") return "";
  const outcome = state.decision === "retreat"
    ? { title: "Équipe rentrée sans la pompe", water: "Aucun gain", delay: "+1 h 15", cause: "Repli ordonné avant l’accès à la salle des pompes." }
    : state.decision === "force"
      ? { title: "Pompe réamorcée, exposition traitée", water: "Eau +2,6 j", delay: "+28 min", cause: "Galerie forcée ; filtre fissuré traité avec l’équipement préparé." }
      : { title: "Pompe partiellement réamorcée", water: "Eau +1,6 j", delay: "+52 min", cause: "Alimentation coupée ; débit réduit mais retour sans blessure." };
  return `<section class="result-panel">
    <p class="eyebrow">Bilan de retour · prévu contre réalisé</p><h2>${outcome.title}</h2>
    <div class="result-grid">
      <article><small>Gain réalisé</small><strong>${outcome.water}</strong><span>Prévu : Eau +1,8–2,7 j</span></article>
      <article><small>Durée réalisée</small><strong>${Math.floor(state.expeditionMinutes / 60)} h ${String(state.expeditionMinutes % 60).padStart(2, "0")}</strong><span>Écart : ${outcome.delay}</span></article>
      <article><small>Équipe</small><strong>${state.decision === "force" ? "1 exposition traitée" : "Aucune blessure"}</strong><span>4 Habitants revenus</span></article>
    </div>
    <p class="causal-summary"><strong>Cause de l’écart :</strong> ${outcome.cause}</p>
  </section>`;
}

function primaryActions() {
  if (state.phase === "prepare") {
    return `<div class="primary-actions"><button class="primary-button" type="button" data-action="launch">Confirmer le mandat et lancer</button><span>Le convoi restera à la halte ; l’opération se déroulera en parallèle.</span></div>`;
  }
  if (state.phase === "active") {
    return `<div class="primary-actions"><button class="primary-button" type="button" data-action="advance">Avancer le scénario</button><span>Prochaine transmission selon le rythme choisi.</span></div>`;
  }
  if (state.phase === "returning") {
    return `<div class="primary-actions"><button class="primary-button" type="button" data-action="return">Recevoir l’équipe et comparer le bilan</button><span>Le retour reste autonome sauf nouvelle crise.</span></div>`;
  }
  return "";
}

function phaseRail() {
  const order = ["prepare", "active", "escalation", "returning", "complete"];
  const index = order.indexOf(state.phase);
  return `<nav class="phase-rail" aria-label="Étapes du contrat"><ol>
    ${[
      ["Préparer", "Objectif, équipe, mandat"],
      ["Suivre", "Jalons et écarts autonomes"],
      ["Décider", "Seulement hors mandat"],
      ["Rentrer", "Retour autonome"],
      ["Comprendre", "Prévu contre réalisé"],
    ].map(([label, detail], itemIndex) => `<li class="${itemIndex === index ? "is-current" : itemIndex < index ? "is-done" : ""}"><span>${itemIndex < index ? "✓" : itemIndex + 1}</span><div><strong>${label}</strong><small>${detail}</small></div></li>`).join("")}
  </ol></nav>`;
}

function mandateSummary() {
  return `<section class="mandate-summary">
    <p><span>Équipement</span><strong>${equipmentOptions[state.equipment].name}</strong><small>${equipmentOptions[state.equipment].effect}</small></p>
    <p><span>Autonomie</span><strong>${autonomyOptions[state.autonomy].name}</strong><small>${autonomyOptions[state.autonomy].short}</small></p>
    <p><span>Repli</span><strong>${retreatOptions[state.retreat].name}</strong><small>${retreatOptions[state.retreat].short}</small></p>
    <p><span>Rapports</span><strong>${state.reports === "landmarks" ? "À chaque jalon" : "Seulement hors mandat"}</strong><small>Les décisions réversibles restent déléguées.</small></p>
  </section>`;
}

function stateDump() {
  return `<details class="state-dump"><summary>État simulé complet</summary><pre>${escapeHtml(JSON.stringify(state, null, 2))}</pre></details>`;
}

function renderVariantA() {
  return `<div class="variant variant-a">
    ${phaseRail()}
    <div class="a-topline">${missionStatus(true)}${convoyClock()}</div>
    ${state.phase === "prepare" ? `<div class="a-preparation"><div>${teamCard()}${preparationControls("grid")}${primaryActions()}</div>${forecastPanel()}</div>` : ""}
    ${state.phase !== "prepare" ? `<div class="a-operation">${mapPanel()}<div class="a-side">${state.phase === "complete" ? resultPanel() : escalationCard() || radioLog(5)}${primaryActions()}${mandateSummary()}</div></div>` : mapPanel("preview")}
    ${stateDump()}
  </div>`;
}

function renderVariantB() {
  return `<div class="variant variant-b">
    <aside class="b-convoy">${convoyClock()}${missionStatus(true)}${state.phase === "prepare" ? forecastPanel(true) : mandateSummary()}</aside>
    <div class="b-map">${mapPanel("immersive")}</div>
    <aside class="b-radio">${radioLog()}${state.phase === "complete" ? resultPanel() : ""}</aside>
    <section class="b-command-deck">
      ${state.phase === "prepare" ? `<div><p class="eyebrow">Composer l’ordre de départ</p>${teamCard()}</div>${preparationControls("row")}${primaryActions()}` : escalationCard() || primaryActions() || `<p class="operation-complete">Opération archivée dans le journal du phare.</p>`}
    </section>
    ${stateDump()}
  </div>`;
}

function renderVariantC() {
  const locked = state.phase !== "prepare";
  return `<div class="variant variant-c">
    <header class="c-header">${missionStatus()}${convoyClock()}</header>
    <div class="c-layout">
      <section class="mandate-sheet">
        <header><p class="eyebrow">Mandat d’expédition · brouillon ${locked ? "verrouillé" : "modifiable"}</p><h1>Rétablir la pompe des Vannes Grises</h1><p>Ramener une alimentation exploitable sans engager la cité-caravane ni déplacer directement les membres de l’équipe.</p></header>
        ${teamCard()}
        ${preparationControls("document")}
        <section class="mandate-clause"><span>Clause d’escalade</span><p>La responsable rappelle si une décision dépasse la consigne d’autonomie, franchit le seuil de repli, transforme l’objectif ou crée une conséquence irréversible.</p></section>
        ${forecastPanel(true)}
        ${primaryActions()}
      </section>
      <section class="execution-ledger">
        <header><p class="eyebrow">Exécution du mandat</p><h2>${state.phase === "prepare" ? "Ce que l’équipe fera sans vous" : "Ce que l’équipe a fait et pourquoi"}</h2></header>
        ${mapPanel("ledger")}
        ${state.phase === "complete" ? resultPanel() : escalationCard() || radioLog()}
      </section>
    </div>
    ${stateDump()}
  </div>`;
}

function render(announcement = "") {
  const key = getVariant();
  variantChip.textContent = `${key} — ${variants[key].description}`;
  switcherLabel.textContent = `${key} — ${variants[key].name}`;
  main.innerHTML = key === "A" ? renderVariantA() : key === "B" ? renderVariantB() : renderVariantC();
  bindInteractions();
  if (announcement) announcer.textContent = announcement;
}

function bindInteractions() {
  main.querySelectorAll("[data-field]").forEach((control) => control.addEventListener("change", () => {
    state[control.dataset.field] = control.value;
    render(`${control.previousElementSibling?.textContent ?? "Préparation"} modifié.`);
  }));
  main.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action)));
  main.querySelectorAll("[data-decision]").forEach((button) => button.addEventListener("click", () => chooseDecision(button.dataset.decision)));
  main.querySelectorAll("[data-node]").forEach((button) => button.addEventListener("click", () => {
    state.selectedNode = button.dataset.node;
    const node = nodes.find((item) => item.id === state.selectedNode);
    announcer.textContent = `${node.label} sélectionné sur la carte.`;
  }));
}

function handleAction(action) {
  if (action === "toggle-convoy") {
    state.convoyPaused = !state.convoyPaused;
    render(state.convoyPaused ? "Temps du convoi suspendu." : "Temps du convoi repris.");
    return;
  }
  if (action === "certainty") {
    state.certaintyOpen = !state.certaintyOpen;
    render(state.certaintyOpen ? "Sources des estimations affichées." : "Sources des estimations masquées.");
    return;
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
  state.expeditionStep = 1;
  state.expeditionProgress = 18;
  state.expeditionMinutes = 42;
  state.selectedNode = "canal";
  log("order", "Mandat confirmé", `${equipmentOptions[state.equipment].name} · ${autonomyOptions[state.autonomy].name.toLowerCase()} · repli ${retreatOptions[state.retreat].name.toLowerCase()}.`);
  log("report", "Canal sec atteint", "L’équipe quitte le halo ; aucun ordre demandé.");
  render("Expédition lancée. Premier jalon atteint.");
}

function advanceMission() {
  if (state.phase !== "active") return;
  if (state.expeditionStep === 1) {
    state.expeditionStep = 2;
    state.expeditionProgress = 41;
    state.expeditionMinutes += 54;
    state.selectedNode = "passerelle";
    log("autonomy", "Passerelle rompue : détour autonome", `${autonomyOptions[state.autonomy].name}. Maëlle emprunte le lit du canal ; +28 min, aucune dépense supplémentaire.`);
    render("Écart réversible traité par la responsable dans son mandat.");
    return;
  }
  if (state.expeditionStep === 2) {
    state.expeditionStep = 3;
    state.expeditionProgress = 66;
    state.expeditionMinutes += 61;
    state.selectedNode = "hall";
    const treatment = state.equipment === "filters"
      ? "Les filtres doubles permettent d’isoler le sas sans dépense supplémentaire."
      : state.equipment === "remedies"
        ? "Une exposition légère consomme 1 Remède, dans l’enveloppe autorisée."
        : "Le sas est franchi lentement ; +17 min, sans franchir le seuil de repli.";
    log("autonomy", "Sas contaminé traité sans ordre", treatment);
    render("Incident ordinaire traité par l’équipe selon la préparation.");
    return;
  }
  state.phase = "escalation";
  state.expeditionStep = 3;
  state.expeditionProgress = 68;
  state.selectedNode = "hall";
  log("escalation", "Ordre demandé depuis le hall filtré", "Salle alimentée, passage noyé de cendre : les trois issues dépassent le mandat préparé.");
  render("L’expédition est suspendue. Un ordre important est requis ; le Temps du convoi continue.");
}

function chooseDecision(decision) {
  state.decision = decision;
  state.phase = "returning";
  state.expeditionStep = 4;
  state.expeditionProgress = decision === "retreat" ? 70 : 92;
  state.selectedNode = decision === "retreat" ? "hall" : "pompe";
  if (decision === "cut") {
    state.expeditionMinutes += 74;
    state.realized.waterDays = 1.6;
    state.realized.delay = 52;
    log("order", "Ordre transmis : couper puis contourner", "Maëlle confirme un débit réduit et un retour sans exposition.");
  }
  if (decision === "force") {
    state.expeditionMinutes += 49;
    state.realized.waterDays = 2.6;
    state.realized.remedies = state.equipment === "remedies" ? -1 : -2;
    state.realized.delay = 28;
    log("order", "Ordre transmis : forcer la galerie", "Pompe réamorcée ; une exposition reste sous surveillance pendant le retour.");
  }
  if (decision === "retreat") {
    state.expeditionMinutes += 35;
    state.realized.delay = 75;
    log("order", "Ordre transmis : repli", "L’équipe balise le hall et revient sans franchir la salle des pompes.");
  }
  log("report", "Retour engagé", "La responsable reprend l’autonomie prévue ; aucun nouvel ordre attendu.");
  render("Ordre transmis. L’équipe entame son retour.");
}

function completeMission() {
  state.phase = "complete";
  state.expeditionStep = 5;
  state.expeditionProgress = 100;
  state.expeditionMinutes += 76;
  state.selectedNode = "phare";
  log("result", "Équipe revenue au Poste d’opérations", state.decision === "retreat" ? "Aucune blessure ; la station reste inactive." : state.decision === "force" ? "Débit élevé ; une exposition traitée, sans séquelle annoncée." : "Débit réduit stabilisé ; aucune blessure.");
  render("Bilan de retour reçu. Les écarts entre prévu et réalisé sont expliqués.");
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

window.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select, [contenteditable]")) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
});

window.setInterval(() => {
  if (state.phase === "prepare" || state.phase === "complete" || state.convoyPaused) return;
  state.convoyMinutes += 1;
  document.querySelectorAll("[data-convoy-clock]").forEach((node) => { node.textContent = formatClock(state.convoyMinutes); });
}, 2000);

render();
