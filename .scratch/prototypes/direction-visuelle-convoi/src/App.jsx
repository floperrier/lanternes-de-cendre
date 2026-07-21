import { useEffect, useMemo, useState } from "react";
import coupeHabitee from "./assets/coupe-habitee.png";
import atlasExploitation from "./assets/atlas-exploitation.png";
import vigiePhare from "./assets/vigie-phare.png";
import lioraPortrait from "./assets/liora.png";

const VARIANTS = [
  { key: "A", name: "Coupe habitée" },
  { key: "B", name: "Atlas d’exploitation" },
  { key: "C", name: "Vigie du phare" },
];

const SURFACES = [
  { key: "convoi", label: "Convoi", icon: "lighthouse" },
  { key: "meteo", label: "Météo", icon: "weather" },
  { key: "conseil", label: "Conseil", icon: "people" },
  { key: "journal", label: "Journal", icon: "journal" },
];

const PLATFORMS = [
  { key: "phare", name: "Phare", detail: "Commande", status: "Stable" },
  { key: "intendance", name: "Intendance", detail: "Eau · Vivres", status: "Sous tension" },
  { key: "foyers", name: "Foyers", detail: "Habitat · Soin", status: "Stable" },
  { key: "machines", name: "Machines", detail: "Chaleur · Traction", status: "Stable" },
  { key: "operations", name: "Atelier–Opérations", detail: "Technique · Veille", status: "Encrassé" },
];

const ICON_PATHS = {
  lighthouse: <><path d="M10 3h4l1 4H9l1-4Z"/><path d="M9 7h6l2 14H7L9 7Z"/><path d="M8 12h8M7 18h10M5 21h14"/></>,
  weather: <><path d="M4 8h9a3 3 0 1 0-3-3"/><path d="M3 12h14a2.5 2.5 0 1 1-2.2 3.7"/><path d="M6 16h5"/></>,
  people: <><circle cx="8" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M2.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M13 15c3.6-.7 6 1 7 5"/></>,
  journal: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M8 4v16M11 8h5M11 12h5"/></>,
  warning: <><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 18h.01"/></>,
  droplet: <path d="M12 2S5.5 10 5.5 15.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2 12 2Z"/>,
  flame: <path d="M13 2c1 5-3 5-1 9 1-2 3-3 4-5 2 3 4 6 4 10a8 8 0 1 1-16 0c0-4 2-7 6-11 0 3 1 4 3 5-1-3 0-5 0-8Z"/>,
  pause: <><path d="M8 5v14M16 5v14"/></>,
  play: <path d="m8 5 11 7-11 7V5Z"/>,
  chevronLeft: <path d="m15 18-6-6 6-6"/>,
  chevronRight: <path d="m9 18 6-6-6-6"/>,
  route: <><path d="M4 19c3-9 6-2 9-10s5-4 7-4"/><circle cx="4" cy="19" r="1.5"/><circle cx="20" cy="5" r="1.5"/></>,
  wrench: <path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/>,
};

function Icon({ name, size = 20 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

function SurfaceNav({ surface, onChange, orientation = "horizontal" }) {
  return (
    <nav className={`surface-nav surface-nav--${orientation}`} aria-label="Surfaces du jeu">
      {SURFACES.map((item) => (
        <button
          className={surface === item.key ? "is-active" : ""}
          key={item.key}
          onClick={() => onChange(item.key)}
          aria-current={surface === item.key ? "page" : undefined}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function TimeControls({ paused, setPaused, speed, setSpeed, compact = false }) {
  return (
    <div className={`time-controls ${compact ? "time-controls--compact" : ""}`} aria-label="Temps du convoi">
      <button className={paused ? "is-active" : ""} onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Reprendre le Temps du convoi" : "Suspendre le Temps du convoi"}>
        <Icon name={paused ? "play" : "pause"} size={18} />
        <span>{paused ? "Reprendre" : "Pause"}</span>
      </button>
      {[1, 2, 4].map((value) => (
        <button key={value} className={!paused && speed === value ? "is-active" : ""} onClick={() => { setPaused(false); setSpeed(value); }} aria-pressed={!paused && speed === value}>
          ×{value}
        </button>
      ))}
    </div>
  );
}

function Metrics({ layout = "rail" }) {
  const items = [
    { label: "Autonomie", value: "8", unit: "jours", icon: "droplet", emphasis: true },
    { label: "Habitants", value: "184", unit: "sur 250", icon: "people" },
    { label: "Chaleur", value: "+2", unit: "marge", icon: "flame" },
    { label: "Entretien", value: "Soutenu", unit: "6 équipes", icon: "wrench" },
  ];
  return (
    <section className={`metrics metrics--${layout}`} aria-label="État du convoi">
      {items.map((item) => (
        <div className={item.emphasis ? "metric metric--primary" : "metric"} key={item.label}>
          <Icon name={item.icon} />
          <span className="metric__label">{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.unit}</small>
        </div>
      ))}
    </section>
  );
}

function Incident({ resolved, onResolve, expanded = false }) {
  return (
    <section className={`incident ${resolved ? "is-resolved" : ""} ${expanded ? "incident--expanded" : ""}`} aria-live="polite">
      <div className="section-heading">
        <Icon name={resolved ? "wrench" : "warning"} />
        <span>{resolved ? "Incident confié" : "Incident en cours"}</span>
      </div>
      <h2>Filtre nord — {resolved ? "nettoyage planifié" : "encrassé"}</h2>
      <p>{resolved ? "L’Intendance interviendra au prochain changement de quart." : "Le débit d’eau diminue. Sans ordre, l’incident se résoudra selon la doctrine actuelle."}</p>
      <dl>
        <div><dt>Effet connu</dt><dd>Autonomie −1 jour sous 48 h</dd></div>
        <div><dt>Incertitude</dt><dd>Usure du collecteur</dd></div>
      </dl>
      <button className="primary-action" onClick={onResolve} disabled={resolved}>
        <Icon name="wrench" size={17} />
        {resolved ? "Ordre transmis" : "Confier à l’Intendance"}
      </button>
    </section>
  );
}

function Advice({ compact = false }) {
  return (
    <section className={`advice ${compact ? "advice--compact" : ""}`}>
      <img src={lioraPortrait} alt="Portrait peint de Liora, veilleuse du convoi" />
      <div>
        <span className="advice__speaker">Liora · Terrain</span>
        <h2>Le Front accélère au nord</h2>
        <p><strong>Fait connu :</strong> le relevé de Veille-Basse date de deux jours.</p>
        {!compact && <p><strong>Recommandation :</strong> gardons une route de repli, même si elle coûte du combustible.</p>}
        {!compact && <p><strong>Enjeu personnel :</strong> j’ai promis aux veilleurs de ne pas couper leur dernière liaison.</p>}
      </div>
    </section>
  );
}

function PlatformList({ selected, onSelect, compact = false }) {
  return (
    <div className={`platform-list ${compact ? "platform-list--compact" : ""}`} aria-label="Plateformes mobiles">
      {PLATFORMS.map((platform, index) => (
        <button key={platform.key} className={selected === platform.key ? "is-selected" : ""} onClick={() => onSelect(platform.key)} aria-pressed={selected === platform.key}>
          <span className="platform-list__number">{index + 1}</span>
          <span><strong>{platform.name}</strong><small>{platform.detail}</small></span>
          <em>{platform.status}</em>
        </button>
      ))}
    </div>
  );
}

function WeatherMap({ tone = "dark" }) {
  return (
    <section className={`weather-map weather-map--${tone}`} style={{ backgroundImage: `url(${atlasExploitation})` }} aria-label="Carte météorologique des Bassins fendus">
      <div className="map-legend">
        <h2>Bassins fendus</h2>
        <p><span className="line line--safe" /> Route renseignée</p>
        <p><span className="line line--risk" /> Route incertaine</p>
        <p><span className="line line--front" /> Front de cendre</p>
      </div>
      <button className="map-marker map-marker--north"><span>Route du nord</span><small>Source · Éclaireurs · J−2</small></button>
      <button className="map-marker map-marker--well"><span>Haut-Puits</span><small>Stable · Eau disponible</small></button>
      <button className="map-marker map-marker--low"><span>Veille-Basse</span><small>Fragile · Afflux de réfugiés</small></button>
      <div className="front-label"><Icon name="weather"/><strong>Front de cendre</strong><span>Avancée estimée · 2 à 4 jours</span></div>
    </section>
  );
}

function CouncilSurface({ compact = false }) {
  return (
    <section className={`council-surface ${compact ? "council-surface--compact" : ""}`}>
      <Advice />
      <div className="council-copy">
        <span className="section-kicker">Sujet 1 sur 2</span>
        <h2>Préserver la route du nord ?</h2>
        <p>Réserver deux équipes protège un renseignement récent, mais reporte le nettoyage du filtre et fragilise l’Autonomie.</p>
        <div className="decision-facts">
          <span><strong>Coût connu</strong> 2 équipes · 1 jour</span>
          <span><strong>Personnes</strong> Veilleurs · Intendance</span>
          <span><strong>Incertitude</strong> Vitesse réelle du Front</span>
        </div>
        <div className="decision-actions">
          <button>Maintenir la route</button>
          <button>Rappeler les équipes</button>
        </div>
      </div>
    </section>
  );
}

function JournalSurface() {
  const entries = [
    ["Aujourd’hui · 14:20", "Filtre nord encrassé", "Incident ordinaire · résolution selon doctrine"],
    ["Aujourd’hui · 09:10", "Rapport de Veille-Basse", "Renseignement daté · Front au nord-est"],
    ["Hier · 18:40", "Atelier–Opérations réaffecté", "Liora prend la veille jusqu’à la halte"],
    ["J−2 · Conseil", "Route des Falaise de l’Os", "Engagement sans retour · vivres réservés"],
  ];
  return (
    <section className="journal-surface">
      <header><h2>Journal du Porte-Lanterne</h2><p>Les causes restent attachées à leurs conséquences.</p></header>
      <ol>
        {entries.map(([time, title, detail]) => <li key={title}><time>{time}</time><strong>{title}</strong><span>{detail}</span></li>)}
      </ol>
    </section>
  );
}

function Brand({ subtitle }) {
  return <div className="brand"><strong>Les Lanternes de Cendre</strong><span>{subtitle}</span></div>;
}

function VariantA(props) {
  const { surface, setSurface, selected, setSelected, incidentResolved, resolveIncident, paused, setPaused, speed, setSpeed } = props;
  return (
    <div className="game-screen variant-a" style={{ backgroundImage: `url(${coupeHabitee})` }}>
      <header className="a-topbar">
        <Brand subtitle="Bassins fendus · Alt. 422 m" />
        <SurfaceNav surface={surface} onChange={setSurface} />
        <TimeControls paused={paused} setPaused={setPaused} speed={speed} setSpeed={setSpeed} compact />
      </header>

      {surface === "convoi" && <>
        <section className="a-weather-brief"><span>Vent nord-ouest · fort</span><strong>Prochaine halte · 2,5 jours</strong></section>
        <div className="a-platforms"><PlatformList selected={selected} onSelect={setSelected} compact /></div>
        <aside className="a-incident"><Incident resolved={incidentResolved} onResolve={resolveIncident} /></aside>
      </>}
      {surface === "meteo" && <div className="a-surface-overlay"><WeatherMap tone="warm" /></div>}
      {surface === "conseil" && <div className="a-surface-overlay a-surface-overlay--paper"><CouncilSurface /></div>}
      {surface === "journal" && <div className="a-surface-overlay a-surface-overlay--paper"><JournalSurface /></div>}
      <div className="a-metrics"><Metrics /></div>
    </div>
  );
}

function RouteNote({ className, title, source, state }) {
  return <button className={`route-note ${className}`}><strong>{title}</strong><span>{source}</span><em>{state}</em></button>;
}

function VariantB(props) {
  const { surface, setSurface, selected, setSelected, incidentResolved, resolveIncident, paused, setPaused, speed, setSpeed } = props;
  return (
    <div className="game-screen variant-b" style={{ backgroundImage: `url(${atlasExploitation})` }}>
      <header className="b-topbar">
        <Brand subtitle="Atlas d’exploitation" />
        <Metrics layout="header" />
        <SurfaceNav surface={surface} onChange={setSurface} />
        <TimeControls paused={paused} setPaused={setPaused} speed={speed} setSpeed={setSpeed} compact />
      </header>

      <aside className="b-legend"><h1>Bassins fendus</h1><p><span className="line line--safe"/> Renseignée</p><p><span className="line line--risk"/> Incertaine</p><p><span className="line line--front"/> Condamnée</p></aside>
      {surface === "meteo" && <>
        <RouteNote className="route-note--north" title="Route du nord" source="Éclaireurs · J−2" state="Praticable" />
        <RouteNote className="route-note--center" title="Route des gorges" source="Veille-Basse · J−10" state="Incertaine" />
        <div className="b-front"><Icon name="weather"/><strong>Front de cendre</strong><span>2 à 4 jours</span></div>
      </>}
      {surface === "convoi" && <div className="b-convoy-focus"><h2>Cité-caravane</h2><p>Cinq plateformes · formation en grappe</p><PlatformList selected={selected} onSelect={setSelected} compact /></div>}
      {surface === "conseil" && <div className="b-council-focus"><CouncilSurface compact /></div>}
      {surface === "journal" && <div className="b-journal-focus"><JournalSurface /></div>}

      <aside className="b-right-rail">
        <Advice compact={surface !== "conseil"} />
        <Incident resolved={incidentResolved} onResolve={resolveIncident} />
      </aside>
      <footer className="b-operations"><strong>Doctrine · Prudence éclairée</strong><span>Préserver l’Autonomie</span><span>Éviter le Front</span><span>Affectations · 23 disponibles</span></footer>
    </div>
  );
}

function RadialReadouts({ selected, onSelect }) {
  return (
    <div className="radial-readouts">
      <button onClick={() => onSelect("phare")} className={selected === "phare" ? "is-selected" : ""}>Halo de veille <strong>Stable</strong></button>
      <button onClick={() => onSelect("machines")} className={selected === "machines" ? "is-selected" : ""}>Demande de Chaleur <strong>Élevée</strong></button>
      <button onClick={() => onSelect("operations")} className={selected === "operations" ? "is-selected" : ""}>Charge d’Entretien <strong>Soutenue</strong></button>
      <button onClick={() => onSelect("intendance")} className={selected === "intendance" ? "is-selected" : ""}>Vent et direction <strong>Nord-ouest</strong></button>
    </div>
  );
}

function VariantC(props) {
  const { surface, setSurface, selected, setSelected, incidentResolved, resolveIncident, paused, setPaused, speed, setSpeed } = props;
  return (
    <div className="game-screen variant-c" style={{ backgroundImage: `url(${vigiePhare})` }}>
      <aside className="c-nav"><Brand subtitle="Vigie du phare"/><SurfaceNav surface={surface} onChange={setSurface} orientation="vertical" /></aside>
      <header className="c-heading"><span>Région</span><strong>Bassins fendus</strong></header>
      {surface === "convoi" && <RadialReadouts selected={selected} onSelect={setSelected} />}
      {surface === "meteo" && <div className="c-surface"><WeatherMap tone="red" /></div>}
      {surface === "conseil" && <div className="c-surface c-surface--paper"><CouncilSurface compact /></div>}
      {surface === "journal" && <div className="c-surface c-surface--paper"><JournalSurface /></div>}
      <aside className="c-status"><Metrics layout="stack"/><Incident resolved={incidentResolved} onResolve={resolveIncident} /><PlatformList selected={selected} onSelect={setSelected} compact /></aside>
      <footer className="c-ribbon"><Advice /><TimeControls paused={paused} setPaused={setPaused} speed={speed} setSpeed={setSpeed} /></footer>
    </div>
  );
}

function PrototypeSwitcher({ variant, setVariant }) {
  const currentIndex = VARIANTS.findIndex((item) => item.key === variant);
  const cycle = (offset) => setVariant(VARIANTS[(currentIndex + offset + VARIANTS.length) % VARIANTS.length].key);
  return (
    <div className="prototype-switcher" aria-label="Changer de direction visuelle">
      <button onClick={() => cycle(-1)} aria-label="Direction précédente"><Icon name="chevronLeft" /></button>
      <span><small>Prototype jetable</small><strong>{variant} — {VARIANTS[currentIndex].name}</strong></span>
      <button onClick={() => cycle(1)} aria-label="Direction suivante"><Icon name="chevronRight" /></button>
    </div>
  );
}

export function App() {
  const initialVariant = useMemo(() => {
    const candidate = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
    return VARIANTS.some((item) => item.key === candidate) ? candidate : "A";
  }, []);
  const [variant, setVariant] = useState(initialVariant);
  const [surface, setSurface] = useState("convoi");
  const [selected, setSelected] = useState("operations");
  const [incidentResolved, setIncidentResolved] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variant);
    window.history.replaceState({}, "", url);
  }, [variant]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, [contenteditable='true']"))) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const index = VARIANTS.findIndex((item) => item.key === variant);
      const offset = event.key === "ArrowLeft" ? -1 : 1;
      setVariant(VARIANTS[(index + offset + VARIANTS.length) % VARIANTS.length].key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [variant]);

  const sharedProps = {
    surface,
    setSurface,
    selected,
    setSelected,
    incidentResolved,
    resolveIncident: () => setIncidentResolved(true),
    paused,
    setPaused,
    speed,
    setSpeed,
  };

  return (
    <main>
      {variant === "A" && <VariantA {...sharedProps} />}
      {variant === "B" && <VariantB {...sharedProps} />}
      {variant === "C" && <VariantC {...sharedProps} />}
      <PrototypeSwitcher variant={variant} setVariant={setVariant} />
    </main>
  );
}
