# GeoDudas

GeoDudas es una aplicación educativa de ciencias sociales para explorar el mundo y aprender geografía de forma interactiva. El estudiante crea un perfil con nombre y avatar, consulta un mapa y resuelve misiones de seis retos: encontrar países, reconocer banderas y ubicar lugares de Colombia. Los aciertos otorgan experiencia, estrellas, progreso temático y logros.

La aplicación está hecha con **Angular 21**, **TypeScript** y **MapLibre GL**. El progreso y la sesión se almacenan en el `localStorage` del navegador: no hay cuentas, servidor de datos ni sincronización entre dispositivos. El mapa de exploración utiliza teselas de OpenStreetMap; las misiones usan fronteras geográficas locales (`public/data/countries.geojson`) y las banderas se solicitan a flagcdn.com. Para esas imágenes y teselas se necesita conexión a Internet.

## Requisitos

- Node.js 22.12 o superior y npm (el proyecto usa npm 11).
- Un navegador moderno compatible con WebGL.

## Ejecutar en local

Desde la raíz del repositorio:

```bash
npm ci
npm start
```

Abre `http://localhost:4200/`. El servidor de desarrollo actualiza la página al modificar el código.

## Compilar y probar

```bash
npm run build
npm test -- --watch=false
```

`npm run build` genera la versión de producción en `dist/geodudas/browser/`. El comando de pruebas ejecuta las pruebas unitarias con Vitest una sola vez. Para observar cambios continuamente, usa `npm test` (sal con `Ctrl+C`).

## Estructura principal

- `src/app/login/`: creación y recuperación de la sesión local.
- `src/app/dashboard-estudiante/` y `src/app/home/`: navegación, perfil, logros y progreso.
- `src/app/missions/`: preguntas, interacción y resultados de las misiones.
- `src/app/map/`: mapa interactivo, países y lugares de Colombia.
- `src/app/shared/progress-store.ts`: persistencia local de sesión y progreso.
- `public/`: recursos estáticos, GeoJSON, iconos e imágenes.

Versión publicada: https://geodudas.vercel.app
