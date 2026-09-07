# Partner Service Desk — Client

React + Vite frontend for the Culture Holidays Partner Service Desk. UI/UX (sidebar, header, theming) mirrors the `culturehotelbook` hotel portal so both apps feel like one product family.

## Stack

- **React 19** + **Vite**
- **React Router** — client-side routing
- **TanStack Query (React Query)** — server-state fetching/caching
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev      # starts Vite dev server (http://localhost:5173)
```

The app expects the [server](../server) to be running on `http://localhost:5000`. To point at a different backend, create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Folder structure

```
src/
├── main.jsx                  Entry point — wraps <App/> in QueryClientProvider + BrowserRouter
├── App.jsx                   Route table: which URL renders which page
├── index.css                 Design tokens (CSS variables) + global reset + dark/light theme
│
├── components/
│   ├── layout/                The app shell — same on every page
│   │   ├── AppLayout.jsx      Renders Sidebar + Header + <Outlet/>, owns theme/collapse/mobile-drawer state
│   │   ├── Sidebar.jsx        Left nav: logo, menu (from config/navigation.js), user footer
│   │   └── Header.jsx         Top bar: page title/subtitle, date, LIVE pill, theme toggle, logout
│   └── ui/                    Small reusable pieces used across pages
│       ├── StatCard.jsx       KPI-style stat box (icon + value + label)
│       └── EmptyState.jsx     "No X yet" placeholder card
│
├── pages/                    One folder per screen, matching the sidebar menu
│   ├── Dashboard/
│   ├── Tickets/
│   ├── Partners/
│   └── Reports/
│
├── config/
│   └── navigation.js          Single source of truth for sidebar links + header title/subtitle per route
│
├── api/                      Talks to the backend
│   ├── client.js              Thin fetch wrapper (base URL, error handling)
│   └── endpoints/              One file per resource (e.g. health.js)
│
├── hooks/                    TanStack Query hooks, one per endpoint (e.g. useHealth.js)
│
└── app/
    └── queryClient.js         TanStack Query client configuration
```

## Adding a new page

1. Create `pages/<Name>/<Name>.jsx` (+ a `.css` file if it needs custom styles).
2. Add an entry to `config/navigation.js` — `{ path, label, icon, title, subtitle }`. This automatically adds the sidebar link and wires the header title/subtitle for that route.
3. Add a `<Route>` for it in `App.jsx`.

## Adding a new API call

1. Add a function in `api/endpoints/<resource>.js` that calls `apiFetch(...)`.
2. Wrap it in a hook in `hooks/use<Resource>.js` using `useQuery` (see `useHealth.js` for the pattern).
3. Call the hook from whatever page/component needs the data.

## Theming

Dark is the default theme; toggling adds a `light-theme` class to `<body>` (see `AppLayout.jsx`). All colors are CSS variables defined in `index.css`, overridden under `body.light-theme` — new components should read colors from those variables (`var(--text)`, `var(--surface)`, `var(--accent)`, etc.) rather than hardcoding hex values, so they work in both themes automatically.
