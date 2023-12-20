# NomNom

A simple mobile-only WPA for making meal plans and constructing shopping lists

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Production build

```sh
make build
```

### Publish to web hosting

copy the `.envrc.example` -> `.envrc` and fill out the web hosting details

```sh
make publish
```

> NB: You will be prompted to enter the password to upload

## TODO

- Persisted state for every new resource page, to make switching between pages easier
- New resource page state to use ids to reference sub-resources, to make restore work properly
- Swap IndexedDB for a WASM-based SQLite DB -> https://github.com/DallasHoff/sqlocal/tree/main
- new ingredient triggered for a specific recipie item should be set on return