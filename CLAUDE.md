# MedClinic

Medical clinic network website — Vue 3 SPA with Russian localization.

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check (`vue-tsc -b`) then build (`vite build`)
- `npm run preview` — preview production build

No test runner is configured.

## Tech Stack

- **Vue 3** + TypeScript + Vite 8
- **Pinia** for state management
- **TailwindCSS 3** with custom theme (see `tailwind.config.js`)
- **Vue Router 4** with HTML5 history mode
- **VeeValidate + Zod** for form validation
- **Leaflet** for maps
- **Swiper** for carousels
- **date-fns** for date formatting
- **VueUse** for composables

## Architecture

### Component Organization (`src/components/`)

| Directory      | Purpose                                        |
|----------------|-------------------------------------------------|
| `layout/`      | AppHeader, AppFooter, MobileMenu, FloatingWidgets |
| `ui/`          | Reusable primitives: AppButton, AppModal, AppBadge, AppRating, AppPagination, AppLoader, AppBreadcrumbs, AppTabs, AppAccordion |
| `home/`        | Homepage sections: HeroSection, ServicesSection, DoctorsSlider, ClinicsMap, etc. |
| `doctors/`     | DoctorCard, DoctorFilters, DoctorSchedule       |
| `appointment/` | AppointmentModal                                 |

### Pages (`src/pages/`)

Each route lazily loads a page component. Routes are defined in `src/router/index.ts` with `meta.title` and `meta.description` for SEO (set via `beforeEach` guard).

### Stores (`src/stores/`)

- `useDoctorsStore` — doctor list with filtering, sorting, pagination, and 5-min cache
- `useAppointmentStore` — appointment booking state
- `useRegionStore` — region/city selection

### Data Layer

**No backend yet.** All data comes from mock files in `src/mocks/`. Stores simulate async loading with `setTimeout`. When a real API is added, replace mock imports in stores with HTTP calls.

### Types

Shared TypeScript interfaces live in `src/types/` (e.g., `Doctor`, `DoctorsFilter`).

## Conventions

- **Composition API** with `<script setup lang="ts">` everywhere
- **Russian UI text** — all user-facing strings are in Russian
- UI components are prefixed with `App` (AppButton, AppModal, etc.)
- Tailwind custom colors: `primary` (blue #003D9C), `secondary` (cyan #00AEEF), `success`, `warning`, `error`
- Font: Golos Text (fallback: Inter, system-ui)
- Custom border-radius tokens: `btn`, `card`, `input`, `modal`
- Custom shadows: `card`, `header`, `card-hover`
