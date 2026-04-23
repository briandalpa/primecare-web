# primecare-web

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

React frontend for PrimeCare — a laundry e-commerce platform built as the final project for the Purwadhika Full Stack Web Development program. The Express backend lives in a separate repository: [`primecare-api`](https://github.com/briandalpa/primecare-api).

---

## Tech Stack

- React 19, TypeScript 5, Vite 7
- Tailwind CSS 4 (via `@tailwindcss/vite`), shadcn/ui (new-york style), Lucide icons
- react-router-dom v7 (client-side routing), TanStack Query v5 (server state), axios (HTTP client)
- Zod v4, react-hook-form (form validation)
- better-auth (auth + Google OAuth), Midtrans Snap (payment)
- Sonner (toasts)

---

## Getting Started

**1. Clone the repository.**

```bash
git clone https://github.com/briandalpa/primecare-web.git
cd primecare-web
```

**2. Install dependencies.**

```bash
npm install
```

**3. Configure environment variables.**

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

- `VITE_API_URL` — backend base URL; defaults to `http://localhost:2000` for local development
- `VITE_MIDTRANS_SNAP_URL` — Midtrans payment gateway script URL; use the sandbox URL for development
- `VITE_MIDTRANS_CLIENT_KEY` — Midtrans public client key (safe to expose in the browser)

**4. Start the development server.**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Commands

```bash
npm run dev       # development server (Vite + HMR, port 5173)
npm run build     # TypeScript check + production build → dist/
npm run lint      # ESLint
npm run preview   # preview the production build locally

npx shadcn@latest add <component>   # add a shadcn/ui component → src/components/ui/
```

---

## Project Structure

```
primecare-web/
└── src/
    ├── main.tsx               # entry point — mounts React app with TanStack Query provider
    ├── App.tsx                # root router — defines all routes across 5 role-based layouts
    ├── pages/                 # route-level page components (one per route)
    ├── features/              # business-domain feature modules
    │   ├── admin/               admin dashboard, user forms, order management, complaint handling
    │   ├── auth/                login schemas, protected routes, Google Sign-In, role guards
    │   ├── customer/            customer dashboard, address selection, pickup flows
    │   ├── driver/              driver dashboard, delivery task cards
    │   ├── worker/              station processing, bypass requests, notifications
    │   ├── orders/              order lists, pagination, status display
    │   ├── navigation/          top navbar, mobile menu drawer, user profile drawer
    │   ├── landing-page/        hero, FAQ, testimonials, pricing, outlet map
    │   └── ...
    ├── layouts/               # shared layout wrappers (Admin, Customer, Worker, Driver, Auth, Main)
    ├── components/
    │   ├── ui/                  shadcn/ui primitives — do not edit manually
    │   └── admin/               admin-specific reusable components
    ├── hooks/                 # custom React hooks (data fetching, forms, business logic)
    ├── services/              # axios API call modules (one per domain)
    ├── types/                 # TypeScript interfaces and enums
    ├── utils/                 # pure utility functions (formatters, status maps, query keys)
    └── lib/
        ├── axiosInstance.ts     configured axios client with VITE_API_URL as base
        ├── auth-client.ts       better-auth client initialization
        └── utils.ts             exports cn() (clsx + tailwind-merge)
```

---

## Role-Based Routing

The app serves five distinct roles, each with its own layout and entry point after login:

| Role           | Entry point         |
| -------------- | ------------------- |
| `CUSTOMER`     | `/`                 |
| `OUTLET_ADMIN` | `/admin/dashboard`  |
| `SUPER_ADMIN`  | `/admin/dashboard`  |
| `WORKER`       | `/worker/dashboard` |
| `DRIVER`       | `/driver/dashboard` |

Unauthenticated users are redirected to `/`. Unverified accounts land on `/` with a banner. Wrong-role access renders a `403 Forbidden` page. Successful login redirects back to the originally requested URL.

---

## API Call Patterns

All business-logic endpoints are called through `src/lib/axiosInstance.ts`, which prepends `VITE_API_URL/api/v1/` to every request. Authentication is handled exclusively through the better-auth client SDK (`src/lib/auth-client.ts`), which calls `VITE_API_URL/api/auth/` internally. Never call `/api/auth/*` directly via axios.

---

## Key Conventions

- **Path alias** — `@/*` maps to `src/*` in both TypeScript and Vite configs
- **Utility classes** — always use `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`)
- **Theming** — CSS custom properties defined in `src/index.css` (OKLch); dark mode toggled via the `.dark` class
- **Forms** — Zod schema + react-hook-form + `Field` component from `@/components/ui/field`
- **Pagination / filtering / sorting** — always request from the server; never process lists on the client
- **File size** — max 200 lines per file, max 15 lines per function

---

## Contributing

Branch from `origin/development` and follow the naming convention:

```bash
git fetch origin
git checkout -b your-name/PCS-###/short-description origin/development
```

Commit format: `type: message` — types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`.

Before pushing, both of these must pass:

```bash
npm run lint && npm run build
```

Open PRs against `development` on GitHub. Never merge locally.

---

## Never

- Edit files in `src/components/ui/` manually
- Call `/api/auth/*` via axios — use the better-auth SDK
- Process pagination, filtering, or sorting on the client side
- Hardcode credentials or API keys
- Push without passing `npm run lint` and `npm run build`
- Merge feature branches locally — always open a PR to `development`
