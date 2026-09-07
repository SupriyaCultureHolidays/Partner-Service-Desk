# Partner Service Desk — Server

Express API backend for the Partner Service Desk client.

## Stack

- **Express 5**
- **cors** — allows the Vite dev server (different port) to call this API
- **dotenv** — loads config from `.env`
- **nodemon** (dev only) — restarts on file change

## Getting started

```bash
npm install
npm run dev     # nodemon, auto-restarts on changes (http://localhost:5000)
npm start       # plain node, for production
```

Config lives in `.env`:

```
PORT=5000
```

## Folder structure

```
server/
├── server.js / src/index.js   App entry: creates the Express app, registers middleware and routes
```

Currently minimal — one file, one route (`GET /api/health`), used by the client's Dashboard page to confirm the frontend can reach the backend.

## Adding a new route

As the API grows, split routes out of `src/index.js` into their own files, e.g.:

```
src/
├── index.js          Express app setup, mounts routers
└── routes/
    └── tickets.js     express.Router() for /api/tickets
```

and `app.use('/api/tickets', ticketsRouter)` in `index.js` — this keeps `index.js` as a table of contents rather than a growing pile of route handlers.
