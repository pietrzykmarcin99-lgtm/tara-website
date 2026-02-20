# UX/UI Designer Portfolio

A modern, performant personal website built with TypeScript, SASS, and Vite.

## 🚀 Features

- ✅ **TypeScript** - Type-safe JavaScript with full IntelliSense support
- ✅ **SASS/SCSS** - Modular, maintainable stylesheets with variables, mixins, and nesting
- ✅ **Vite** - Lightning-fast development server and optimized production builds
- ✅ **Code Splitting** - Organize TS and SASS into smaller, maintainable modules
- ✅ **Minification** - Automatic minification for production builds
- ✅ **Single Output Files** - One CSS file and one JS file for optimal performance

## 📁 Project Structure

```
tara/
├── src/
│   ├── scripts/           # TypeScript files
│   │   ├── main.ts        # Main entry point
│   │   ├── modules/       # Feature modules
│   │   │   ├── navigation.ts
│   │   │   └── animations.ts
│   │   └── utils/         # Utility functions
│   │       └── logger.ts
│   └── styles/            # SASS files
│       ├── main.scss      # Main SASS entry point
│       ├── _variables.scss
│       ├── _mixins.scss
│       ├── _base.scss
│       └── components/    # Component styles
│           ├── _header.scss
│           └── _footer.scss
├── dist/                  # Build output (generated)
├── index.html             # Main HTML file
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## 📝 Available Scripts

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The site will open at `http://localhost:3000` with automatic reloading.

### Production Build

Build optimized, minified files for production:

```bash
npm run build
```

Output will be in the `dist/` folder with:
- Minified and bundled JavaScript
- Minified and bundled CSS
- Optimized HTML files

### Development Build

Build without minification (useful for debugging):

```bash
npm run build:dev
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🎨 Working with SASS

### Adding New Stylesheets

1. Create a new `.scss` file in `src/styles/` or `src/styles/components/`
2. Import it in `src/styles/main.scss`:

```scss
@use 'components/your-component';
```

### Using Variables and Mixins

Variables and mixins are automatically available in all SASS files:

```scss
.my-component {
  color: $primary-color;
  padding: $spacing-md;
  @include flex-center;
  @include transition(opacity, transform);
}
```

## 💻 Working with TypeScript

### Adding New Scripts

1. Create new `.ts` files in `src/scripts/modules/` or `src/scripts/utils/`
2. Import them in `src/scripts/main.ts` or other modules:

```typescript
import { myFunction } from './modules/my-module';
```

### Path Aliases

You can use path aliases for cleaner imports:

```typescript
import { log } from '@/scripts/utils/logger';
import '@styles/components/my-component.scss';
```

## 🌐 Adding More HTML Pages

To add new pages (e.g., about.html, portfolio.html):

1. Create the HTML file in the root directory
2. Update `vite.config.ts` to include the new entry point:

```typescript
input: {
  main: resolve(__dirname, 'index.html'),
  about: resolve(__dirname, 'about.html'),
  portfolio: resolve(__dirname, 'portfolio.html'),
}
```

Each page will get the same bundled CSS and JS files.

## 📦 Build Output

After running `npm run build`, the `dist/` folder contains:

```
dist/
├── index.html
├── assets/
│   ├── css/
│   │   └── main.css       # Single bundled CSS file
│   └── js/
│       └── main.js        # Single bundled JS file
```

All HTML files reference these single CSS and JS files.

## 🎯 Next Steps

1. **Replace example content** - Update index.html with your actual portfolio content
2. **Import Figma designs** - Convert your Figma designs to HTML/SASS
3. **Add more pages** - Create additional pages as needed (about, portfolio, contact)
4. **Customize styles** - Modify SASS variables and components to match your design
5. **Add interactivity** - Enhance TypeScript modules with your desired functionality
6. **Optimize assets** - Add images to `public/` folder for automatic optimization

## 📚 Technologies Used

- **Vite 5.4** - Build tool and dev server
- **TypeScript 5.6** - Type-safe JavaScript
- **SASS 1.79** - CSS preprocessor

## 🤝 Support

For issues or questions, refer to:
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SASS Documentation](https://sass-lang.com/)

---

Happy coding! 🎨✨
