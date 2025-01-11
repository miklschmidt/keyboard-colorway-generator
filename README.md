# Keycap Colorway Generator

This is a tool for generating keycap colorways.

## Requirements

- [Node.js v20+](https://nodejs.org/en)

## Usage

Assuming you have cloned the repository, you can run the following commands to build and preview the site.

```bash
npm install --frozen-lockfile
npm run preview
```

To run the development server, use the following command:

```bash
npm run dev
```

When developing in vscode, install the recommended extensions, make sure `eslint` is set as your default formatter, and enable `editor.formatOnSave`. These settings are already saved to the workspace, but you may have overridden them in your user settings.

## Libraries

Full-stack framework:

- [next.js](https://nextjs.org/)

State management:

- [valtio](https://valtio.pmnd.rs/)

3D rendering:

- [three.js](https://threejs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)

KLE Keyboard layout parsing:

- [@kcf-hub/kle-serial](https://github.com/kcf-hub/kle-serial)

Data fetching:

- [@tanstack/react-query](https://github.com/TanStack/query)

UI components:

- [shadcn/ui](https://ui.shadcn.com/)
- [class variance authority](https://www.npmjs.com/package/class-variance-authority)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
- [lucide-react](https://lucide.dev/)
- [geist](https://www.npmjs.com/package/geist)
- [radix-ui](https://www.radix-ui.com/primitives)

Styling:

- [tailwindcss](https://tailwindcss.com/)
- [tailwindcss-animate](https://github.com/jambonrose/tailwindcss-animate)
- [tailwind-scrollbar](https://github.com/jambonrose/tailwind-scrollbar)

DX:

- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [typescript](https://www.typescriptlang.org/)


## TODO

- [ ] Add focus styles
- [ ] Add different keyboard colorway applicators (how colors are applied to individual key types)
- [ ] Add keycap selection to change the properties of an individual keycap
- [ ] Add keyboard simulation
- [ ] Persist settings in local storage, add import / export.
- [ ] Support all 9 legend positions
- [ ] Add more keyboard layouts
- [ ] Add KLE json upload.
