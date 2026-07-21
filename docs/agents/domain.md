# Domain Docs

## Before exploring, read these

- `CONTEXT.md` at the repository root.
- `CONTEXT-MAP.md` if it exists.
- ADRs in `docs/adr/` that affect the area being changed.

If a file does not exist, proceed silently. Domain-modeling creates documentation lazily when a term or decision is resolved.

## Layout

This repository uses a single domain context:

/
├── CONTEXT.md
├── docs/adr/
└── src/

## Use the glossary’s vocabulary

Use domain concepts exactly as defined in `CONTEXT.md`, including in issue titles, tests and implementation plans. Avoid synonyms explicitly rejected by the glossary.

If a required concept is absent, reconsider the terminology or record the gap for Domain Modeling.

## Flag ADR conflicts

Explicitly surface any proposal that contradicts an existing ADR instead of silently overriding it.
