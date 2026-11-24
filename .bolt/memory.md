# Project memory

## Product intent & audience

- Portfolio or agency-style website showcasing completed projects/work.
- Includes project filtering by category and testimonials.

## Brand personality & voice

- Professional, polished presentation suitable for production (per `.bolt/prompt`).

## Visual design & UX direction

- Home page includes a "What We've Built" section with filterable project cards.
- Filter buttons show category counts (e.g., "Mobile App") that auto-adjust when projects are added/removed.
- Multi-page app: at least a home page and a testimonials page.
- Tech stack: Vite + React, JSX, Tailwind CSS, Lucide React icons (details in `.bolt/prompt`).

## Decisions, constraints & rationale

- SnapScan AI removed from both the home page project list and the testimonials page.
- Filter counts are derived from the project list, so removing a project updates counts automatically — no manual count adjustment needed.

## Open questions & assumptions

- Assumes project data is defined in a shared source (e.g., array/object) used by both home and testimonials pages.
- Unknown: whether projects should be fully removed from data or only hidden from display.