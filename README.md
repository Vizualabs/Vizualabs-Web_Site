# Vizualabs — Official Website

Official website for **Vizualabs**, a venture & tech studio that architects intelligent
digital solutions — high-performance web platforms, AI-driven applications, and scalable
digital products.

Built with [TanStack Start](https://tanstack.com/start), React 19, TanStack Router,
TanStack Query, and Tailwind CSS 4.

## Getting Started

Prerequisites: [Bun](https://bun.sh)

```bash
bun install
bun --bun run dev
```

The dev server runs on `http://localhost:3000`.

## Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `bun --bun run dev`  | Start the development server             |
| `bun --bun run build`| Build the application for production     |
| `bun run preview`    | Preview the production build locally     |
| `bun run generate-routes` | Regenerate the TanStack Router route tree |

## Project Structure

```
src/
├── routes/                  # File-based routing (TanStack Router)
│   ├── __root.tsx           # Root layout / document shell
│   └── index.tsx            # Home page
├── components/
│   ├── hero/                # Hero section (badge, headline, actions, stats, visual)
│   └── layout/              # Navbar and Footer
├── router.tsx               # Router + QueryClient setup
├── routeTree.gen.ts         # Generated route tree (do not edit manually)
└── styles.css               # Tailwind entry + custom theme styles

public/                      # Static assets served at / (e.g. /Frist/*.jpg frames)
```

## Styling

The project uses [Tailwind CSS](https://tailwindcss.com/) v4 (via the Vite plugin) with
custom utility classes (`text-accent-gradient`, `glass-card`, `glass-pill`,
`bg-grid-pattern`, `bg-radial-glow`, `animate-float`, `animate-pulse-slow`) defined in
`src/styles.css`.

## Routing

Routing is managed by [TanStack Router](https://tanstack.com/router) using file-based
routes in `src/routes`. Add a new page by creating a file in `src/routes` and regenerate
the route tree with `bun run generate-routes` (also runs automatically during dev/build).

## Data Fetching

Server state is managed with [TanStack Query](https://tanstack.com/query). The
`QueryClient` is created in `src/router.tsx` and exposed through the router context, so
route loaders can use `queryClient.ensureQueryData(...)` and components consume data via
`useQuery` / `useSuspenseQuery`.

## Learn More

- [TanStack Start docs](https://tanstack.com/start)
- [TanStack Router docs](https://tanstack.com/router)
- [TanStack Query docs](https://tanstack.com/query)
- [Tailwind CSS docs](https://tailwindcss.com)
