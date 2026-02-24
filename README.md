# HybridAds.ai — Marketing Website

A production-ready marketing website for **HybridAds.ai**, an AI-powered paid advertising agency and full-stack AI development shop. The site positions the company as "Humans + AI" — combining 12+ years of PPC expertise with modern machine learning to help businesses grow through digital advertising and custom AI systems.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [Hooks & Utilities](#hooks--utilities)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Routing](#routing)
- [SEO](#seo)
- [Third-Party Integrations](#third-party-integrations)
- [Styling](#styling)

---

## Overview

HybridAds.ai serves two primary audiences:

1. **Businesses seeking paid ad management** — Google, Meta, TikTok, YouTube, Instagram, LinkedIn, and X/Twitter campaigns managed by human experts and optimized by AI.
2. **Companies needing custom AI development** — Agentic AI systems, voice AI, on-device ML, LLM fine-tuning, and full-stack AI products.

Key metrics highlighted across the site:
- 2M+ leads generated
- $400k/month in e-commerce sales managed
- 3,000+ Google campaigns launched
- 12 years of PPC experience

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.5.3 |
| Build Tool | Vite | 5.4.2 |
| Styling | Tailwind CSS | 3.4.1 |
| Icons | Lucide React | 0.344.0 |
| Backend / DB | Supabase | 2.57.4 |
| Linting | ESLint + typescript-eslint | 9.9.1 / 8.3.0 |
| CSS Processing | PostCSS + Autoprefixer | 8.4.35 / 10.4.18 |

---

## Project Structure

```
/
├── public/                        Static assets (logos, images, sitemap, robots.txt)
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx           Main landing page
│   │   ├── DashboardPage.tsx      Ad performance analytics showcase
│   │   ├── AboutPage.tsx          Company info, team, and case studies
│   │   ├── AIAgencyPage.tsx       AI services, portfolio, and tech stack
│   │   ├── PrivacyPolicyPage.tsx  Privacy policy (GDPR/CCPA compliant)
│   │   ├── TermsOfServicePage.tsx Terms of service
│   │   └── NotFoundPage.tsx       404 error page
│   ├── components/
│   │   ├── Header.tsx             Sticky navigation with mobile menu
│   │   ├── Footer.tsx             Full footer with links and social media
│   │   ├── AnimateIn.tsx          Scroll-triggered animation wrapper
│   │   ├── StatsTicker.tsx        Horizontal scrolling stats ticker
│   │   ├── CookieConsent.tsx      Cookie consent banner
│   │   └── ErrorBoundary.tsx      React error boundary with analytics logging
│   ├── hooks/
│   │   └── useInView.ts           IntersectionObserver hook for animations
│   ├── App.tsx                    Root component — routing, SEO, navigation
│   ├── main.tsx                   Application entry point
│   ├── index.css                  Global styles and Tailwind directives
│   └── vite-env.d.ts              Vite environment type definitions
├── index.html                     HTML entry with meta tags and third-party scripts
├── vite.config.ts                 Vite configuration
├── tailwind.config.js             Tailwind CSS configuration
├── tsconfig.app.json              TypeScript config for src
├── tsconfig.node.json             TypeScript config for Vite config files
└── .env                           Environment variables (not committed)
```

---

## Pages

### Home (`/`)
The primary conversion page. Sections include:
- **Hero** — tagline, CTAs to book a call or view the ad performance dashboard, and four key statistics
- **Stats Ticker** — scrolling bar of 2024–2025 platform achievements
- **Create Once Deploy Everywhere** — platform grid (Google, Meta, TikTok, etc.) with accordion explainers
- **Grow Your Revenue** — ROAS chart and revenue growth accordion
- **Case Study** — $476,109/month revenue growth for a delivery brand
- **Customer Testimonials** — 12 client testimonials from businesses across industries
- **What We've Built** — six recent projects including iOS apps, open-source tools, and AI platforms
- **Core Expertise** — six expertise cards covering AI, voice, mobile, ads, LLM fine-tuning, and full-stack
- **CTA Footer** — final call-to-action with links to book a call, view the dashboard, or explore AI services

### Dashboard (`#dashboard`)
Showcases the AI-powered unified ad performance dashboard. Includes:
- Challenge/solution framing
- Live-style metrics table (ROAS, CPA, CTR per platform)
- Campaign data table
- Platform breakdown
- AI insights panel
- FAQ accordion
- Case study results

### About (`#about`)
Company background, team bios, and past client case studies. Includes:
- Mission statement
- Five team member profiles
- Six client project case studies with results
- Services overview

### AI Agency (`#ai-agency`)
Details AI development services. Includes:
- Service offerings: Agentic AI, RAG pipelines, voice AI, video generation, on-device ML, LLM fine-tuning, full-stack products
- Open-source GitHub projects
- Full tech stack list
- Workflow delivery process
- Project categories

### Privacy Policy (`#privacy`)
GDPR and CCPA compliant privacy policy covering data collection, usage, sharing, retention, user rights, and security practices.

### Terms of Service (`#terms`)
Full terms covering acceptance, user obligations, intellectual property, payment terms, disclaimers, liability limits, termination, and DMCA policy.

### 404 Not Found
Friendly error page with navigation back to the homepage.

---

## Components

### `Header.tsx`
Sticky top navigation bar. Features:
- Logo with link to home
- Desktop navigation links
- "AI Agency" expertise badge
- "Book a Free Call" button linking to Calendly
- Mobile hamburger menu with slide-down nav
- Smooth active-state highlighting based on current page

### `Footer.tsx`
Dark-themed footer. Features:
- Company name, tagline, and description
- Navigation columns: Company, Services, Legal
- Social media icons (LinkedIn, GitHub, X/Twitter)
- Copyright notice

### `AnimateIn.tsx`
A scroll-triggered animation wrapper component. Wraps any child content and fades/slides it in when it enters the viewport. Accepts a `delay` prop (in milliseconds) for staggered animations.

```tsx
<AnimateIn delay={150}>
  <SomeContent />
</AnimateIn>
```

### `StatsTicker.tsx`
An infinite-scroll horizontal ticker displaying platform performance stats from 2024–2025, including metrics for X, LinkedIn, YouTube, TikTok, and the website. Pauses on hover.

### `CookieConsent.tsx`
Cookie consent banner that:
- Appears 1.5 seconds after page load if consent has not been recorded
- Persists the user's choice in `localStorage` under `hybridads_cookie_consent`
- Accepts values: `accepted` or `declined`

### `ErrorBoundary.tsx`
A class-based React error boundary. On error, it:
- Logs the exception to Google Analytics via `gtag`
- Renders a fallback UI with a reload button and support contact
- Prevents the entire app from going blank on unexpected rendering errors

---

## Hooks & Utilities

### `useInView(threshold = 0.12)`
A custom hook that uses the `IntersectionObserver` API to detect when a referenced element enters the viewport.

```ts
const { ref, isVisible } = useInView(0.12);
```

- `ref` — attach to the element you want to observe
- `isVisible` — `true` once the element has entered the viewport
- Automatically disconnects the observer after first trigger (fire-once behavior)

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both variables are prefixed with `VITE_` and are exposed to the browser through Vite's built-in environment variable system. Never commit the `.env` file — it is included in `.gitignore`.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start the local development server with HMR |
| `build` | `vite build` | Build the application for production |
| `preview` | `vite preview` | Serve the production build locally for testing |
| `lint` | `eslint .` | Run ESLint across the entire project |
| `typecheck` | `tsc --noEmit -p tsconfig.app.json` | Run TypeScript type checking without emitting files |

---

## Routing

The app uses **client-side hash routing** implemented manually in `App.tsx` — no external router library is used. Routes are mapped via URL hash fragments.

| Hash | Page |
|---|---|
| `` (empty) or `#` | Home |
| `#dashboard` | Dashboard |
| `#about` | About |
| `#ai-agency` | AI Agency |
| `#privacy` | Privacy Policy |
| `#terms` | Terms of Service |
| Any unrecognized hash | 404 Not Found |

Navigation between pages is handled by a `navigate(page: Page)` function passed as a prop to each page component. The `Page` type is defined as:

```ts
type Page = 'home' | 'dashboard' | 'about' | 'ai-agency' | 'privacy' | 'terms'
```

---

## SEO

SEO is managed dynamically in `App.tsx`. On each route change, the app updates:

- `<title>`
- `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`)
- Twitter Card tags
- `<link rel="canonical">`
- JSON-LD structured data for `Organization` and `WebSite` schemas

Each page has its own title and description defined in a `seoConfig` map inside `App.tsx`.

---

## Third-Party Integrations

| Service | Purpose |
|---|---|
| Google Analytics | Page view and event tracking (`G-V3D5F80MGH`) |
| Twitter/X Pixel | Conversion tracking |
| ChatSimple | AI chat widget embedded in the site |
| Calendly | Meeting booking CTA (`https://calendly.com/hybridadsai`) |
| Supabase | Backend, database, and auth (configured via `.env`) |
| GitHub | Open-source project portfolio links |

---

## Styling

### Tailwind CSS
All component styling uses Tailwind utility classes. The config (`tailwind.config.js`) scans `src/` and `index.html`. No custom theme extensions — the default Tailwind theme is used.

### Global CSS (`index.css`)
- **Font**: Inter (400–900 weights) with system font stack fallback
- **Scroll**: Smooth scrolling on the `html` element
- **Focus**: 2px blue outline with 2px offset for keyboard accessibility
- **Reduced motion**: Animations disabled via `prefers-reduced-motion` media query
- **Ticker animation**: `ticker-scroll` keyframe (translateX 0% to -50%, 40s linear infinite)
- **Scroll animation**: `.animate-on-scroll` sets `opacity: 0` + `translateY(30px)`; `.is-visible` transitions to fully visible using `cubic-bezier(0.16, 1, 0.3, 1)`

### Design System Conventions
- 8px base spacing unit (Tailwind default)
- Color usage: blue (primary), green (success/CTA), pink (accent), gray (neutral), red/yellow/orange (supporting)
- Maximum 3 font weights in use: 400 regular, 600 semibold, 900 black
- Consistent `rounded-2xl` border radius on cards
- Shadow scale: `shadow-sm` for cards, `shadow-lg` for elevated CTAs
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
