# GeoDudas

GeoDudas es una aplicación web educativa para practicar geografía mediante misiones interactivas. Un estudiante elige nombre y avatar, responde retos sobre países, banderas y lugares de Colombia en un mapa, y acumula experiencia (XP), estrellas, racha y logros. Hay una vista de inicio con tareas sugeridas, además de secciones de misiones, logros y perfil.

**Demo:** https://geodudas.vercel.app

## Tecnologías y alcance

- **Angular 21** con componentes *standalone*, señales (`signal`, `computed` y `effect`), `input`/`output` y formularios reactivos.
- **TypeScript 5.9** para la lógica de aplicación y datos.
- **MapLibre GL 6** para el mapa WebGL y sus capas GeoJSON; usa un *worker* JavaScript servido como recurso estático.
- **CSS** global y por componente; iconos SVG almacenados en `public/icons/`.
- **Vitest** y `jsdom` para pruebas unitarias mediante el builder de Angular.

Es una aplicación **del lado del cliente**: no tiene API ni base de datos. El nombre y el avatar identifican una sesión local, **no constituyen una cuenta con autenticación**. La sesión y el progreso se guardan en `localStorage` de cada navegador; no se sincronizan entre dispositivos.

## Requisitos

- Node.js **22.12 o superior** (compatible con Angular 21) y npm. El repositorio declara `npm@11.19.1` en `package.json`.
- Navegador moderno con soporte para WebGL y `localStorage`.
- Acceso a Internet para instalar dependencias; las teselas de OpenStreetMap y las imágenes de banderas dependen de servicios externos cuando se utilizan.

Comprueba las versiones instaladas:

```bash
node --version
npm --version
```

No hace falta instalar Angular CLI globalmente: después de instalar las dependencias, `npx ng` ejecuta el CLI local del proyecto.

## Instalación y ejecución local

1. Clona el repositorio (o abre una copia existente) y entra en su directorio:

   ```bash
   git clone https://github.com/edben110/Geodudas.git
   cd Geodudas
   ```

2. Instala las dependencias según `package-lock.json`:

   ```bash
   npm ci
   ```

3. Inicia el servidor de desarrollo de Angular:

   ```bash
   npx ng serve
   ```

4. Abre **http://localhost:4200/**. Angular recompila automáticamente al modificar los archivos. Detén el servidor con `Ctrl+C`.

Si el puerto 4200 está ocupado, usa `npx ng serve --port 4300` y abre `http://localhost:4300/`. No se requieren variables de entorno ni credenciales para ejecutar la aplicación.

## Comandos de Angular CLI

| Comando | Función |
| --- | --- |
| `npx ng serve` | Inicia el servidor de desarrollo de Angular. |
| `npx ng build` | Genera una compilación optimizada de producción. |
| `npx ng build --watch --configuration development` | Compila en modo desarrollo al detectar cambios; no inicia servidor HTTP. |
| `npx ng test --watch=false` | Ejecuta las pruebas unitarias una vez. |
| `npx ng test` | Ejecuta pruebas en modo observación; termina con `Ctrl+C`. |

La salida de `npx ng build` queda en `dist/geodudas/browser/`. Para publicar, se debe servir ese directorio como sitio estático; no se debe abrir su `index.html` directamente mediante `file://`, porque la aplicación solicita recursos por HTTP.

## Organización del repositorio

```text
Geodudas/
├── angular.json                 # Builders, recursos estáticos, estilos y configuraciones
├── package.json                 # Dependencias y scripts npm
├── package-lock.json            # Versiones fijadas para npm ci
├── tsconfig*.json               # Configuración de TypeScript para app y pruebas
├── public/
│   ├── data/countries.geojson   # Fronteras y propiedades de los países
│   ├── icons/                   # Iconos SVG
│   └── images/                  # Logo y avatares
└── src/
    ├── index.html               # Documento HTML base
    ├── main.ts                  # bootstrapApplication(App, appConfig)
    ├── styles.css               # Variables, reset y estilos globales
    └── app/
        ├── app.ts|html|css      # Componente raíz: sesión o dashboard
        ├── app.config.ts        # Proveedores globales
        ├── app.routes.ts        # Rutas Angular (actualmente vacío)
        ├── login/               # Formulario de nombre y selección de avatar
        ├── dashboard-estudiante/# Navegación, perfil, logros y progreso
        ├── home/                # Inicio y lista de tareas sugeridas
        ├── missions/            # Definiciones, preguntas y flujo de misiones
        ├── map/                 # Integración de MapLibre y datos de Colombia
        └── shared/              # Persistencia local e iconos
```

Cada componente de funcionalidad agrupa su clase TypeScript (`.ts`), plantilla (`.html`) y estilos (`.css`). Los archivos `*.spec.ts` contienen pruebas.

### Arranque y navegación

`src/main.ts` inicia el componente raíz `App` con la configuración de `src/app/app.config.ts`. `App` intenta restaurar la sesión desde `ProgressStore` y muestra `LoginComponent` o `DashboardEstudiante` según exista una sesión. Al cerrar sesión se elimina la clave de sesión, **no** el progreso del estudiante.

Las pestañas **Inicio**, **Misiones**, **Logros** y **Perfil** se seleccionan mediante el estado `activeSection` del dashboard (`src/app/dashboard-estudiante/dashboard-estudiante.ts`); **no son rutas URL**. Aunque `provideRouter` está configurado, `src/app/app.routes.ts` no define rutas.

### Inicio y perfil

- `login/` usa `ReactiveFormsModule` para validar el nombre y requiere seleccionar un avatar. Al enviar, guarda la sesión local y la comunica al componente raíz mediante `sessionStarted`.
- `dashboard-estudiante/` administra XP, nivel, estrellas, racha, aciertos, progreso por tema y logros. Carga el perfil al iniciarse y guarda las actualizaciones mediante `ProgressStore`.
- `home/` presenta estadísticas y una lista de tareas sugeridas. Estas tareas se mantienen **solo en memoria** y se reinician al recargar; no deben confundirse con el progreso persistente del perfil.

### Misiones y mapa

`src/app/missions/activity-data.ts` define los tipos y datos de las tres misiones: **Encuentra el país**, **Descubre la bandera** y **Colombia en el mapa**. `missions.ts` genera seis preguntas por misión, controla las fases (`hub`, `playing`, `summary`) y comprueba las respuestas recibidas desde el mapa. Cada acierto emite `activityCompleted`; el dashboard actualiza y persiste las recompensas.

`WorldMapComponent` (`map/world-map.component.ts`) encapsula el ciclo de vida del mapa y expone entradas como modo, continente y país/lugar destacado, además de eventos para selecciones. `map/worldMap.ts` crea las capas de MapLibre, carga `/data/countries.geojson`, dibuja los puntos definidos en `map/colombia-places.ts` y controla filtros, resaltados y enfoque. Las misiones utilizan una base sin nombres que revelen las respuestas; el modo de exploración definido en el código utiliza teselas de OpenStreetMap. En la interfaz actual, el mapa se monta desde la vista de misiones.

El *worker* `maplibre-gl-worker.mjs` se copia desde `node_modules/maplibre-gl/dist` a la raíz de los recursos de la compilación por la configuración de `angular.json`. Debe estar accesible junto al sitio para que el mapa funcione.

### Persistencia

`src/app/shared/progress-store.ts` gestiona el almacenamiento:

- `geodudas:session`: nombre y ruta del avatar de la sesión actual.
- `geodudas:progress:<nombre normalizado>`: XP, nivel, estrellas, racha, respuestas correctas y progreso por tema.

Un mismo nombre normalizado recupera su perfil **en ese navegador**. Borrar los datos del sitio o cambiar de dispositivo impide recuperarlo; no existe recuperación remota. El servicio captura errores de acceso a `localStorage` para que la aplicación pueda seguir funcionando sin persistencia.

## Recursos externos y despliegue

El GeoJSON, los iconos, los avatares y el *worker* se sirven como archivos estáticos. El modo de exploración solicita teselas a `tile.openstreetmap.org` y la misión de banderas solicita imágenes a `flagcdn.com` (con alternativa de emoji si falla la imagen). Las misiones dibujan las fronteras con el GeoJSON local, sin teselas externas.

Para desplegar en un alojamiento estático como Vercel, usa `npx ng build` como comando de compilación y `dist/geodudas/browser` como directorio de salida. No se requiere backend. La aplicación actual no define rutas profundas, por lo que toda la navegación se realiza dentro de la misma página.

## Comprobación rápida

Después de iniciar `npx ng serve`, registra un nombre y avatar, abre **Misiones**, inicia cualquiera de las tres actividades y comprueba que el mapa aparece, acepta selecciones y muestra retroalimentación. Para ejecutar la comprobación automatizada:

```bash
npx ng test --watch=false
npx ng build
```
