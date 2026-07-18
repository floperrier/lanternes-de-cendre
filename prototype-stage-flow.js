// PROTOTYPE JETABLE : trois parcours d’une étape, commutables via ?variant=A|B|C.

const variants = {
  A: { name: "Journal de quart", description: "Parcours guidé" },
  B: { name: "Convoi-hub", description: "Navigation spatiale" },
  C: { name: "Table de commandement", description: "Vue d’ensemble" },
};

const phases = [
  {
    id: "conseil",
    label: "Conseil",
    place: "Phare",
    title: "La nuit sera plus froide que prévu",
    story: "Nara demande le carburant pour maintenir les dortoirs au-dessus du gel. Ivo rappelle que le purificateur doit tourner avant le départ. Les deux opérations ne tiendront pas sur le même cycle.",
    stakes: "Connu : le froid pèsera sur le moral. Une eau insuffisante limitera l’expédition.",
    options: [
      { label: "Chauffer les dortoirs", detail: "Carburant −1 · Moral +8 · Eau inchangée", effects: { carburant: -1, morale: 8 }, flag: "dortoirs_chauffes" },
      { label: "Purifier les réserves", detail: "Carburant −1 · Eau +3 · Moral −4", effects: { carburant: -1, eau: 3, morale: -4 }, flag: "eau_prioritaire" },
    ],
  },
  {
    id: "route",
    label: "Route",
    place: "Cartographie",
    title: "Deux voies sous la cendre",
    story: "Le viaduc des Scories raccourcit le trajet, mais sa pile nord s’est affaissée. Le canal asséché contourne la zone et passe près d’une ancienne station de pompage.",
    stakes: "Connu : le viaduc économise du carburant ; le canal coûte du temps mais peut contenir de l’eau.",
    options: [
      { label: "Tenter le viaduc", detail: "Carburant +1 épargné · Risque structurel", effects: { carburant: 1 }, flag: "route_viaduc" },
      { label: "Suivre le canal", detail: "Carburant −1 · Indice : station de pompage", effects: { carburant: -1 }, flag: "route_canal" },
    ],
  },
  {
    id: "preparation",
    label: "Préparation",
    place: "Hangar",
    title: "Former l’équipe sans gérer chaque sac",
    story: "Deux préparations cohérentes sont proposées à partir des affectations et du matériel disponible. Le Porte-Lanterne choisit une doctrine, pas une liste d’objets individuelle.",
    stakes: "Connu : Nara ouvre les accès mécaniques ; Ivo réduit la gravité des blessures ; Maël révèle les détours.",
    options: [
      { label: "Équipe de récupération", detail: "Nara + Maël · Trousse mécanique · Pièces −1", effects: { pieces: -1 }, team: ["Nara", "Maël"], flag: "doctrine_recuperation" },
      { label: "Équipe de secours", detail: "Ivo + Maël · Médicaments −1 · Blessures mieux contenues", effects: { medicaments: -1 }, team: ["Ivo", "Maël"], flag: "doctrine_secours" },
    ],
  },
  {
    id: "expedition",
    label: "Expédition",
    place: "Radio",
    title: "Une famille sous le tablier effondré",
    story: "La radio grésille. Maël a repéré quatre survivants, dont un enfant fiévreux. Les dégager impose d’utiliser l’essieu de rechange comme levier. L’équipe attend votre ordre depuis le terrain.",
    stakes: "Connu : le secours crée quatre bouches à nourrir et détruit une pièce rare. Refuser préserve le convoi mais sera mémorisé.",
    options: [
      { label: "Employer l’essieu et les secourir", detail: "Pièces −2 · Vivres −1 · 4 réfugiés · Ivo approuve", effects: { pieces: -2, vivres: -1, morale: 4 }, flag: "famille_secourue" },
      { label: "Marquer le lieu et poursuivre", detail: "Aucun coût immédiat · Moral −6 · Maël désapprouve", effects: { morale: -6 }, flag: "famille_abandonnee" },
    ],
  },
  {
    id: "retour",
    label: "Retour",
    place: "Infirmerie",
    title: "Le sas signale des particules organiques",
    story: "Au retour, un filtre porte des traces de contamination. Ivo veut isoler toute l’équipe. Nara affirme que le capteur a déjà donné de faux positifs et demande une inspection rapide.",
    stakes: "Connu : isoler retarde les réparations ; inspecter vite expose le convoi à une contamination non confirmée.",
    options: [
      { label: "Isoler l’équipe", detail: "Temps spécialiste −1 · Sécurité sanitaire · Moral −2", effects: { morale: -2 }, flag: "quarantaine" },
      { label: "Inspection accélérée", detail: "Réparations maintenues · Risque sanitaire caché", effects: { pieces: 1 }, flag: "inspection_rapide" },
    ],
  },
  {
    id: "reparation",
    label: "Réparation",
    place: "Atelier",
    title: "Sauver l’essieu ou préserver la serre",
    story: "Le train arrière ne tiendra pas la prochaine montée. Nara peut cannibaliser les cadres de la petite serre, ou tenter une réparation de fortune qui consommera les dernières pièces.",
    stakes: "Connu : sacrifier la serre réduit les vivres futurs ; la réparation de fortune laisse une cicatrice mécanique.",
    options: [
      { label: "Démonter la serre", detail: "Module perdu · Vivres futurs −1 · Essieu stabilisé", effects: { vivres: -1, phare: 4 }, flag: "serre_sacrifiee" },
      { label: "Réparation de fortune", detail: "Pièces −2 · Cicatrice : essieu fragile", effects: { pieces: -2, phare: -4 }, flag: "essieu_fragile" },
    ],
  },
  {
    id: "consequences",
    label: "Conséquences",
    place: "Réfectoire",
    title: "Dire ce que le filtre a révélé",
    story: "La rumeur de contamination s’est propagée. Le conseil attend une parole claire. Révéler le doute peut provoquer la peur ; le taire protège le calme mais engage votre légitimité.",
    stakes: "Connu : la transparence coûte du moral maintenant ; le silence crée une dette politique si la contamination revient.",
    options: [
      { label: "Rendre le rapport public", detail: "Moral −3 · Confiance future · Ivo soutient", effects: { morale: -3 }, flag: "contamination_revelee" },
      { label: "Classer le rapport", detail: "Moral +2 · Cicatrice politique : secret du filtre", effects: { morale: 2 }, flag: "secret_du_filtre" },
    ],
  },
];

const initialState = () => ({
  phaseIndex: 0,
  resources: { eau: 8, vivres: 6, carburant: 5, medicaments: 2, pieces: 4 },
  morale: 61,
  phare: 78,
  team: [],
  flags: [],
  decisions: [],
  complete: false,
});

let state = initialState();

const main = document.querySelector("#prototype-main");
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
  render({ announce: `Variante ${key}, ${variants[key].name}` });
}

function cycleVariant(direction) {
  const keys = Object.keys(variants);
  const current = keys.indexOf(getVariant());
  setVariant(keys[(current + direction + keys.length) % keys.length]);
}

function resourceCards() {
  const resources = [
    ["Eau", state.resources.eau, "jours"],
    ["Vivres", state.resources.vivres, "rations"],
    ["Carburant", state.resources.carburant, "unités"],
    ["Médicaments", state.resources.medicaments, "doses"],
    ["Pièces", state.resources.pieces, "caisses"],
    ["Moral", state.morale, "/ 100"],
    ["Phare", state.phare, "%"],
  ];
  return `<section class="resource-strip" aria-label="État du convoi">
    ${resources.map(([name, value, unit]) => `<div class="resource"><span class="resource-name">${name}</span><strong>${value}</strong><span class="delta">${unit}</span></div>`).join("")}
  </section>`;
}

function phaseRail() {
  return `<ol class="phase-rail" aria-label="Phases de l’étape">
    ${phases.map((phase, index) => `<li><button class="phase-marker ${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "is-complete" : ""}" type="button" ${!state.complete && index === state.phaseIndex ? 'aria-current="step"' : ""} ${index > state.phaseIndex ? "disabled" : ""} data-inspect-phase="${index}">${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "✓ " : ""}${phase.label}</button></li>`).join("")}
  </ol>`;
}

function choiceButtons(style = "cards") {
  const phase = phases[state.phaseIndex];
  if (state.complete) {
    return `<button class="choice-button" type="button" data-reset><strong>Relire une nouvelle étape</strong><small>Réinitialise uniquement ce prototype.</small></button>`;
  }
  if (style === "orders") {
    return `<div class="command-orders">${phase.options.map((option, index) => `<button class="order-button" type="button" data-choice="${index}"><span class="order-key">${index + 1}</span><strong>${option.label}</strong><span class="order-effect">${option.detail}</span></button>`).join("")}</div>`;
  }
  return `<div class="option-list">${phase.options.map((option, index) => `<button class="choice-button" type="button" data-choice="${index}"><strong>${option.label}</strong><small>${option.detail}</small></button>`).join("")}</div>`;
}

function decisionLog(limit) {
  const list = limit ? state.decisions.slice(-limit) : state.decisions;
  if (!list.length) return `<p class="empty-log">Aucune décision prise. Le conseil attend.</p>`;
  return `<ol class="decision-log">${list.map((decision) => `<li><strong>${decision.phase}</strong><br>${decision.choice}</li>`).join("")}</ol>`;
}

function currentScene(includeRail = false, style = "cards") {
  const phase = state.complete ? phases.at(-1) : phases[state.phaseIndex];
  if (state.complete) {
    return `<p class="phase-kicker">Étape achevée</p><h1 tabindex="-1">Le convoi reprend sa route</h1><p class="scene-copy">Sept décisions ont transformé les réserves, les relations et les cicatrices du convoi. Comparez maintenant cette même étape dans les autres variantes sans perdre l’état simulé.</p><div class="known-stakes"><strong>Trace mémorable</strong>${state.flags.includes("famille_secourue") ? "Quatre réfugiés voyagent désormais près des cuisines." : "Le signal de la famille abandonnée reste inscrit au journal de Maël."}</div>${choiceButtons()}`;
  }
  return `${includeRail ? phaseRail() : ""}<p class="phase-kicker">${phase.label} · ${phase.place}</p><h1 tabindex="-1">${phase.title}</h1><p class="scene-copy">${phase.story}</p><div class="known-stakes"><strong>Ce que le Porte-Lanterne sait</strong>${phase.stakes}</div>${choiceButtons(style)}`;
}

function fullStateDump() {
  return `<details class="state-dump"><summary>État simulé complet — visible pour évaluer le prototype</summary><pre tabindex="0">${escapeHtml(JSON.stringify(state, null, 2))}</pre></details>`;
}

function renderGuided() {
  return `${resourceCards()}${phaseRail()}<div class="guided-layout"><article class="guided-focus">${currentScene(false)}</article><aside class="guided-log" aria-label="Fil des décisions"><h2>Fil du Porte-Lanterne</h2>${decisionLog()}<div class="known-stakes"><strong>Règle de cette variante</strong>Une seule décision est au centre. Le contexte secondaire reste dans le fil.</div></aside></div>${fullStateDump()}`;
}

function renderHub() {
  return `${resourceCards()}<div class="hub-layout"><section class="convoy-cutaway" aria-label="Coupe fonctionnelle du convoi"><div class="hub-modules">${phases.map((phase, index) => `<button class="module-button ${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "is-complete" : ""}" type="button" ${!state.complete && index === state.phaseIndex ? 'aria-current="step"' : ""} ${index > state.phaseIndex ? "disabled" : ""} data-inspect-phase="${index}"><span class="module-label">${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "Terminé" : index === state.phaseIndex ? "À traiter" : "Fermé"}</span><strong>${phase.place}</strong><small>${phase.label}</small></button>`).join("")}</div><article class="hub-workspace">${currentScene(false)}</article></section><aside class="radio-tape"><h2>Bande radio et journal</h2>${state.decisions.length ? state.decisions.map((decision, index) => `<p class="radio-line">${String(index + 1).padStart(2, "0")}: ${decision.phase.toUpperCase()} — ${decision.choice}</p>`).join("") : '<p class="radio-line">00: LE CONSEIL ATTEND VOTRE ORDRE.</p>'}<div class="known-stakes"><strong>Règle de cette variante</strong>Chaque phase habite un lieu du convoi. Le joueur se déplace vers le problème.</div></aside></div>${fullStateDump()}`;
}

function renderCommand() {
  const phase = state.complete ? phases.at(-1) : phases[state.phaseIndex];
  return `${resourceCards()}<div class="command-layout"><nav class="command-timeline" aria-label="Chronologie de commandement"><p class="phase-kicker">Chronologie</p><ol>${phases.map((item, index) => `<li><button class="timeline-button ${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "is-complete" : ""}" type="button" ${!state.complete && index === state.phaseIndex ? 'aria-current="step"' : ""} ${index > state.phaseIndex ? "disabled" : ""} data-inspect-phase="${index}">${index < state.phaseIndex || (state.complete && index === state.phaseIndex) ? "✓ " : ""}${item.label}<br><small>${item.place}</small></button></li>`).join("")}</ol></nav><article class="command-center">${state.complete ? currentScene(false) : `<p class="phase-kicker">Ordre ${state.phaseIndex + 1} / ${phases.length}</p><h1 tabindex="-1">${phase.title}</h1><p class="scene-copy">${phase.story}</p>${choiceButtons("orders")}`}</article><aside class="command-sidebar"><h2>${state.complete ? "Bilan connu" : "Prévision connue"}</h2><ul class="forecast-list">${state.complete ? "<li>Les sept décisions sont enregistrées dans l’état simulé.</li><li>Le convoi conserve ses ressources, ses compagnons et ses cicatrices.</li>" : `<li>${phase.stakes}</li><li>Les conséquences cachées ne sont pas prédites.</li><li>L’ordre sera ajouté au journal avant la phase suivante.</li>`}</ul><h2>Derniers ordres</h2>${decisionLog(3)}<div class="known-stakes"><strong>Règle de cette variante</strong>Chronologie, ordre et prévision restent visibles ensemble.</div></aside></div>${fullStateDump()}`;
}

function applyChoice(index) {
  if (state.complete) return;
  const phase = phases[state.phaseIndex];
  const option = phase.options[index];
  if (!option) return;

  for (const [key, delta] of Object.entries(option.effects ?? {})) {
    if (key === "morale" || key === "phare") state[key] = Math.max(0, Math.min(100, state[key] + delta));
    else state.resources[key] = Math.max(0, (state.resources[key] ?? 0) + delta);
  }
  if (option.team) state.team = [...option.team];
  state.flags.push(option.flag);
  state.decisions.push({ phase: phase.label, choice: option.label, knownEffect: option.detail });
  state.phaseIndex += 1;
  state.complete = state.phaseIndex >= phases.length;
  if (state.complete) state.phaseIndex = phases.length - 1;

  render({ announce: `${option.label}. Phase suivante : ${state.complete ? "étape achevée" : phases[state.phaseIndex].label}.`, focusTitle: true });
}

function inspectCompletedPhase(index) {
  if (index >= state.phaseIndex || index < 0) return;
  const decision = state.decisions[index];
  announcer.textContent = `${phases[index].label} : ${decision.choice}. Cette phase est terminée.`;
}

function reset() {
  state = initialState();
  render({ announce: "Prototype réinitialisé. Conseil.", focusTitle: true });
}

function render({ announce = "", focusTitle = false } = {}) {
  const key = getVariant();
  variantName.textContent = `${key} — ${variants[key].description}`;
  switcherLabel.textContent = `${key} — ${variants[key].name}`;
  main.innerHTML = key === "A" ? renderGuided() : key === "B" ? renderHub() : renderCommand();

  main.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => applyChoice(Number(button.dataset.choice))));
  main.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", reset));
  main.querySelectorAll("[data-inspect-phase]").forEach((button) => button.addEventListener("click", () => inspectCompletedPhase(Number(button.dataset.inspectPhase))));

  if (announce) announcer.textContent = announce;
  if (focusTitle) requestAnimationFrame(() => main.querySelector("h1")?.focus());
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

document.querySelector("#previous-variant").addEventListener("click", () => cycleVariant(-1));
document.querySelector("#next-variant").addEventListener("click", () => cycleVariant(1));
document.querySelector("#reset-prototype").addEventListener("click", reset);

window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (target.matches("input, textarea, select, [contenteditable]")) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
  if (getVariant() === "C" && ["1", "2"].includes(event.key) && !state.complete) applyChoice(Number(event.key) - 1);
});

render();
