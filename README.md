# Pattern Lab

A React pattern-design app backed by the separate [Pattern Lab API](https://github.com/jamesflamingo/pattern-lab-backend).

## Features

- React Router views for the workbench, pattern library, editor, measurements, and saved collection.
- Pattern search and category filtering.
- Related pattern components loaded by `garmentId`.
- Modern Skirt offers illustrative long basic, short basic, and punk design previews.
- Classic Skirt offers illustrative basic, ruffled, and ornate ruffled design previews.
- Create, read, update, and delete saved designs through the backend API.
- Save a generic 2D example sheet with a design and view it from the collection. The sheet is illustrative; it is not adapted to the design or a cutting pattern, and the download button is disabled.
- Browse saved designs one at a time using the collection's previous and next controls.
- Responsive layouts and explicit loading/error states.

## Local development

1. Start the backend from its repository by following its README. By default it listens on `http://localhost:3001`.
2. Copy `.env.example` to `.env` if you need to change the API URL.
3. Install dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

Set `VITE_API_URL` to the backend origin (without a trailing path) for a deployed frontend. For example, configure the deployed frontend's build environment with `VITE_API_URL=https://your-backend.example.com`.

## Production build

```sh
npm run build
```

## Deploy on Render

Create a Static Site Blueprint from this repository and use `render.yaml`. Deploy the backend Blueprint first, then set the frontend service's `VITE_API_URL` to the backend's public origin (for example, `https://pattern-lab-backend.onrender.com`) and deploy the frontend. The rewrite in `render.yaml` sends client-side routes back to `index.html`.

## Deploy on Vercel

Import the repository as a Vite project and set `VITE_API_URL` to the deployed backend's public origin. The rewrite in `vercel.json` sends client-side routes back to `index.html`.
