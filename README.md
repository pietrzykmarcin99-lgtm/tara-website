# UX/UI Designer Portfolio

Personal portfolio website for a UX/UI designer, built with TypeScript, SASS and Vite. It is a multi-page static site: a homepage plus one page per case study.

## Pages

| File | Description |
| --- | --- |
| `index.html` | Homepage (hero, recent work, slider, "this is me", contact) |
| `smart-fridge-plan.html` | Smart fridge / smart meal case study |
| `learning-interface-of-robot-pepper.html` | Learning interface of robot Pepper case study |
| `elearning.html` | E-learning case study |
| `reinvinted.html` | Reinvinted case study |
| `cooking-adventure.html` | Cooking adventure case study |

`smart-fridge-plan copy.html` is a leftover copy that is not part of the build (see [Adding a page](#adding-a-page)).

## Tech Stack

- **Vite 5** - dev server and bundler
- **TypeScript 5** (strict mode) - all site logic
- **SASS** - modular stylesheets, one SCSS partial per component
- **GSAP 3** - animations
- **Terser** - production minification (`console` and `debugger` are stripped in production)
- **Lexend** - font, loaded from Google Fonts

## Project Structure

```
tara/
├── index.html, *.html            # Pages (each is a Vite entry point)
├── public/                       # Static assets, copied as-is to dist/
│   ├── icons/
│   └── images/                   # portfolio, project/<name>, recent-work, this-is-me
├── src/
│   ├── scripts/
│   │   ├── main.ts               # Single JS entry used by every page
│   │   ├── modules/              # Feature modules (slider, video, modals, navigation, ...)
│   │   │   └── animations/       # GSAP animations per section / project page
│   │   └── utils/logger.ts
│   └── styles/
│       ├── main.scss             # Single SCSS entry, @use's everything
│       ├── _variables.scss       # Colors, fonts, breakpoints
│       ├── _mixins.scss          # Responsive and layout mixins
│       ├── _base.scss
│       ├── _project-specific.scss
│       └── components/           # One partial per component
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

Requires Node.js 18 or higher.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` and opens automatically.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` (minified) |
| `npm run build:dev` | Unminified build with source maps |
| `npm run build:dev-watch` | Same as `build:dev`, rebuilding on change |
| `npm run preview` | Serve the production build at `http://localhost:4173` |

## Architecture

### Scripts

Every page loads `src/scripts/main.ts`, which calls the `init*` function of each module on `DOMContentLoaded`. Modules only act when their markup exists on the page, so the same bundle works on all pages.

- `main.ts` also swaps the `js-loading` class on `<html>` for `js-ready`. Each page hides `<body>` until then to avoid a flash of unstyled content.
- `modules/animations.ts` initializes the homepage animations (header, in-view, decors, "this is me" and its modals, recent work, "me", robot).
- `modules/animations/` holds the per-section and per-project GSAP code (`project-page`, `smart-fridge`, `elearning`, `process-screens`, `prototype-with-mobile-screens`, `screen-iterations`, ...).
- Other modules: `slider`, `tablet-slider`, `video`, `scrollable-mobile-image`, `mobile-fullscreen-image`, `project-poster-modal`, `robot-background-width`, `scroll-to`, `toggleable-section`, `navigation`.

To add a module, create it in `src/scripts/modules/`, export an `init...()` function and call it from `main.ts` (or from `animations.ts` for homepage animations).

### Styles

Every page links `src/styles/main.scss`, which forwards `_variables` and `_mixins` and then `@use`s `_base`, each partial in `components/`, and `_project-specific`.

To add a component style:

1. Create `src/styles/components/_my-component.scss`.
2. Add `@use 'components/my-component';` to `main.scss`.

Available mixins (`_mixins.scss`): `flex-center`, `mobile`, `tablet`, `desktop`, `smaller-desktop`, `transition(...)`, `font-size($size, $weight, $line-height)`, `roundBox`, and the `rem($px)` function. Colors, font and breakpoints are defined in `_variables.scss`.

```scss
@use '../variables' as *;
@use '../mixins' as *;

.my-component {
  color: $text-color;
  @include flex-center;
  @include mobile {
    flex-direction: column;
  }
}
```

### Path aliases

Defined in `vite.config.ts` and `tsconfig.json`:

- `@` -> `src`
- `@styles` -> `src/styles`
- `@scripts` -> `src/scripts`

### Static assets

Files in `public/` are served from the site root and copied to `dist/`. Reference them with absolute paths, e.g. `/images/project/cooking/...`.

## Adding a page

1. Create the HTML file in the project root. Copy the `<head>` (loading-state script and style, `main.scss` link, fonts) and the `<script type="module" src="/src/scripts/main.ts">` tag from an existing page.
2. Register it in `build.rollupOptions.input` in `vite.config.ts`:

```ts
input: {
  main: resolve(__dirname, 'index.html'),
  myPage: resolve(__dirname, 'my-page.html'),
}
```

HTML files that are not listed in `input` are not included in the production build.

## Build Output

`npm run build` writes to `dist/` with a relative base (`./`). Code splitting is disabled, so each page entry gets its own JS file and the CSS is emitted separately:

```
dist/
├── *.html
└── assets/
    ├── css/        # Bundled CSS
    ├── js/         # One JS file per page entry (main.js, elearning.js, ...)
    └── ...         # Other assets
```

## Documentation

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/)
- [GSAP](https://gsap.com/docs/v3/)
