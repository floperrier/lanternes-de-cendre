# Prompts Imagegen

Les images ont été créées avec l’outil Imagegen intégré. Les concepts complets sont des références de composition ; les assets text-free sont ceux consommés par le prototype.

## Concepts d’interface

### A — Coupe habitée

```text
Use case: ui-mockup
Asset type: full-screen 16:9 desktop browser-game interface concept, direction A “Coupe habitée”
Primary request: Design a polished high-fidelity primary game screen for the French 2D management-survival narrative game “Les Lanternes de Cendre”. The player is the stationary Porte-Lanterne commanding a mobile city of 120–250 people. Show the cité-caravane as a compact cluster of five mobile platforms on irregular parallel tracks around a tall lighthouse platform, not a train and not a single vehicle. Use a fixed 2D oblique cutaway camera. The convoy interior is the main readable surface: warm occupied rooms, workshops, infirmary, filtration and engines glow inside; the exterior is cold, abrasive and buried in moving ash.
Information architecture: central convoy cutaway takes about two thirds of the viewport; one compact autonomy-first status rail; one contextual platform inspector; one concise incident/advice surface; minimal top navigation for CONVOI, MÉTÉO, CONSEIL, JOURNAL; pause and speed controls. Known state: “Bassins fendus”, autonomy “8 jours”, heat margin “+2”, 184 inhabitants, incident “Filtre nord — encrassé”, ordinary incident can auto-resolve. All text and controls must look suitable to rebuild as code-native DOM.
Style/medium: painterly 2D gouache environment art combined with precise ink technical overlays, restrained graphic-novel silhouettes, weathered industrial materials without steampunk ornament.
Lighting/mood: warm amber interiors protected by the lighthouse against slate, bone-grey and muted rust ash outside; harsh but humane.
Accessibility: strong text contrast, generous type, visible focus and selected states, alerts use icon + shape + label rather than color alone, readable at 1440×900.
Constraints: no character controlling the world, no tactical combat, no grid tiles, no generic SaaS dashboard, no card grid, no full-width header and footer boxes, no tiny text, no gore, no watermark, no gamepad UI, no mobile layout. Keep center dominated by actual game world art, with at most 25% persistent UI coverage.
```

### B — Atlas d’exploitation

```text
Use case: ui-mockup
Asset type: full-screen 16:9 desktop browser-game interface concept, direction B “Atlas d’exploitation”
Primary request: Design a polished high-fidelity primary game screen for the French 2D management-survival narrative game “Les Lanternes de Cendre”. Make a tactile topographic weather-and-route atlas the dominant command surface, showing the Bassins fendus, the looming Front de cendre, a forecast panache de cendre, branching route intelligence with source dates, Haut-Puits and Veille-Basse. The clustered five-platform cité-caravane remains visible as a linked oblique cutaway strip along the lower-left edge, centered on its lighthouse platform—not a train. The player is a stationary Porte-Lanterne and issues priorities, assignments and doctrine rather than driving people.
Information architecture: map occupies about 60% of viewport; convoy state forms an open horizontal operational strip rather than cards; a narrow right-hand advice/event column shows one companion portrait and “Filtre nord — encrassé”; autonomy “8 jours” is primary, then heat “+2” and 184 inhabitants; minimal navigation for CONVOI, MÉTÉO, CONSEIL, JOURNAL; pause and speed controls. All text and controls must look suitable to rebuild as code-native DOM.
Style/medium: screen-printed expedition atlas, fine contour lines, charcoal rubbings, stamped symbols, selective hand-painted convoy cutaway, crisp editorial typography; no paper parchment fantasy.
Color palette: soot black, mineral grey, dusty ivory, oxidized copper and one pale cyan weather accent; warm amber reserved for inhabited/protected spaces.
Accessibility: high contrast, large typography, route states use line pattern + icon + label, hazards never color-only, clear focus/selected states, readable at 1440×900.
Constraints: no tactical combat, no generic dashboard, no card grid, no dense spreadsheet, no tiny labels, no steampunk gears, no gore, no watermark, no mobile layout. The atlas must feel like a game world surface, not GIS software.
```

### C — Vigie du phare

```text
Use case: ui-mockup
Asset type: full-screen 16:9 desktop browser-game interface concept, direction C “Vigie du phare”
Primary request: Design a polished high-fidelity primary game screen for the French 2D management-survival narrative game “Les Lanternes de Cendre”. Organize the screen as a radial lighthouse command instrument: the tall lighthouse platform is the central focal point, the other four mobile platforms form an irregular compact cluster around it in a fixed 2D oblique schematic, and concentric/radiating layers express halo safety, heat demand, maintenance load, weather direction and known route risks. This is not a train, not a circular menu, and not a sci-fi hologram. The player is the stationary Porte-Lanterne managing a continuous simulation through priorities, assignments and doctrine.
Information architecture: a large open radial convoy schematic occupies center-left; four persistent edge tabs CONVOI, MÉTÉO, CONSEIL, JOURNAL act like indexed leaves; autonomy “8 jours” is a single prominent typographic measure; a bottom narrative ribbon carries a companion’s advice and an event consequence; a slim vertical platform index makes the four stable quartiers legible; pause and speed controls are integrated as physical instrument toggles. Incident: “Filtre nord — encrassé”; region “Bassins fendus”; 184 inhabitants; heat margin “+2”. All text and controls must look suitable to rebuild as code-native DOM.
Style/medium: austere constructivist field manual crossed with charcoal animation cels and luminous technical drafting; hard geometry softened by hand-made ash textures; human warmth only inside inhabited spaces and companion portraits.
Color palette: near-black graphite, pale ash, faded vermilion, warm lamp amber, restrained chalk-white.
Accessibility: large readable typography, high contrast, icons paired with labels and distinctive shapes, clear focus ring, reduced-motion-friendly visual hierarchy, readable at 1440×900.
Constraints: no tactical combat, no generic dashboard, no card grid, no ornate steampunk, no cyberpunk holograms, no tiny radial labels, no full-screen HUD clutter, no gore, no watermark, no mobile layout. Keep the composition materially different from a central panorama and from a map-first layout.
```

## Assets text-free retenus

### Coupe habitée

```text
Use case: stylized-concept
Asset type: project-bound 16:9 browser-game background asset for “Coupe habitée”
Primary request: Create a complete text-free background illustration for a 2D management-survival game. Show a mobile city of exactly five large platforms in a compact irregular cluster on parallel heavy tracks around a tall central lighthouse platform. It is not a train and not one vehicle. Fixed 2D oblique cutaway view. Four surrounding platforms visibly contain warm inhabited rooms: infirmary, food and water works, engines, and workshop. One northern filtration room has a restrained cold cyan service light. The ash-choked exterior is bleak, windy and abrasive; the inside is human, warm and busy.
Style/medium: painterly gouache environment art with precise ink cutaway lines, restrained graphic-novel silhouettes, hand-worked industrial materials without ornate steampunk.
Composition/framing: 16:9 landscape; convoy dominates the central 70%; leave quieter negative-space zones at upper-left, upper-right and along bottom edge for code-native interface overlays; lighthouse readable at a glance; no close-up characters.
Lighting/mood: strong warm amber interiors against slate, bone-grey and muted rust ash; humane refuge under pressure.
Constraints: no words, no letters, no numbers, no labels, no logos, no UI panels, no icons, no watermark, no generic sci-fi, no tactical combat, no gore, no single-file train, no duplicated vehicles.
```

Correction ciblée : suppression de la plateforme surnuméraire à l’avant afin d’obtenir exactement cinq plateformes au total, puis reconstruction naturelle des rails et de la cendre.

### Atlas d’exploitation

```text
Use case: stylized-concept
Asset type: project-bound 16:9 browser-game background asset for “Atlas d’exploitation”
Primary request: Create a complete text-free tactical weather-and-route atlas background for a 2D narrative survival management game. A dark topographic map of cracked basins fills the scene, with branching routes, dry channels and industrial traces. On the right, a gigantic organic Front de cendre intrudes as a dense storm mass; a pale cyan forecast plume bends downwind. Near the lower-left, integrate a small oblique silhouette/cutaway of exactly five clustered mobile platforms around a lighthouse, clearly a compact city cluster and not a train. Leave all naming, legends, route labels and symbols to code-native overlays.
Style/medium: screen-printed expedition atlas, fine contour lines, charcoal rubbings, stamped texture, selective hand-painted convoy detail, sophisticated editorial game art; not parchment fantasy and not GIS software.
Composition/framing: 16:9 landscape; map detail focused center; quieter zones at far left and far right for code-native legend and event column; a horizontal calm zone along the bottom for operational controls.
Color palette: soot black, mineral grey, dusty ivory, oxidized copper, restrained pale cyan weather plume, warm amber only in the tiny inhabited convoy.
Constraints: absolutely no words, no letters, no numbers, no labels, no logos, no UI panels, no readable symbols, no watermark, no card layout, no compass text, no gore.
```

Correction ciblée : suppression d’un véhicule autour du Phare afin d’obtenir exactement cinq plateformes au total, sans modifier la carte ni le Front.

### Vigie du phare

```text
Use case: stylized-concept
Asset type: project-bound 16:9 browser-game background asset for “Vigie du phare”
Primary request: Create a complete text-free visual background for a radial lighthouse command interface in a 2D narrative survival management game. A tall lighthouse platform is the center-left focal point. Exactly four mobile platforms form an irregular compact cluster around it in fixed 2D oblique view. Subtle concentric chalk drafting rings, radial weather traces and maintenance arcs are integrated into the ground plane, but they are not a circular menu and not a hologram. Platforms feel inhabited and practical: workshop, greenhouse, stores and watch post. Leave clear breathing room on the far left for vertical navigation, on the right for code-native status, and across the lower quarter for a narrative ribbon.
Style/medium: austere constructivist field manual crossed with charcoal animation cels and luminous technical drafting, hard geometry softened by handmade ash texture, industrial but not ornate steampunk.
Color palette: near-black graphite, pale ash, faded vermilion accents, warm lamp amber, restrained chalk white.
Lighting/mood: vigilant, sparse, humane, high contrast.
Constraints: no words, no letters, no numbers, no labels, no logos, no UI panels, no icons, no watermark, no sci-fi holograms, no tactical combat, no gore, no train formation.
```

Correction ciblée : remplacement de l’eau, des rochers et des pilotis fixes par des terres de cendre, des rails irréguliers et cinq châssis mobiles visibles, composition et style inchangés.

### Portrait de Liora

```text
Use case: stylized-concept
Asset type: project-bound companion portrait for browser-game advice and event panels
Primary request: Create a half-length portrait of Liora, a weary adult scout and watchkeeper in the ashlands of a narrative survival game. She wears practical dark layered clothing, a filter scarf lowered at the neck, wind-worn skin, short dark hair, intelligent guarded expression, no weapon visible. The portrait must feel like a real member of the mobile city rather than a fantasy hero.
Style/medium: hand-painted gouache and charcoal animation cel, precise ink edges, subtle paper grain, consistent with austere industrial ashland interface art.
Composition/framing: vertical 4:5 portrait, centered subject, dark simple background with soft ash atmosphere and enough separation for use in a panel.
Color palette: graphite, dusty ivory, muted rust, restrained warm amber rim light.
Constraints: no text, no letters, no numbers, no logo, no watermark, no gore, no glamour pose, no steampunk goggles, no weapon, no extra people.
```
