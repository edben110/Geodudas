import * as maplibregl from 'maplibre-gl';
import type { FilterSpecification, Map, MapLayerMouseEvent } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { COLOMBIA_PLACES, type ColombiaPlace } from './colombia-places';
import { CONTINENTS, type CountryTarget } from '../missions/activity-data';

export type MapMode = 'explore' | 'activity' | 'colombia';

export interface CountryProperties {
  NAME?: string;
  NAME_ES?: string;
  ADMIN?: string;
  ISO_A2?: string;
  ISO_A3?: string;
  CONTINENT?: string;
  POP_EST?: number;
  LABEL_X?: number;
  LABEL_Y?: number;
  [key: string]: unknown;
}

const COUNTRY_TARGETS = new globalThis.Map<string, CountryTarget>();

for (const continent of CONTINENTS) {
  for (const country of continent.countries) {
    COUNTRY_TARGETS.set(country.iso2, country);
    COUNTRY_TARGETS.set(country.iso3, country);
    COUNTRY_TARGETS.set(country.name, country);
  }
}

function findCountryTarget(
  properties: CountryProperties,
): CountryTarget | undefined {
  return (
    COUNTRY_TARGETS.get(properties.ISO_A2 ?? '') ??
    COUNTRY_TARGETS.get(properties.ISO_A3 ?? '') ??
    COUNTRY_TARGETS.get(properties.NAME_ES ?? '') ??
    COUNTRY_TARGETS.get(properties.NAME ?? '')
  );
}

export interface WorldMapOptions {
  mode?: MapMode;
  center?: [number, number];
  zoom?: number;
  onCountryClick?: (country: CountryProperties) => void;
  onPlaceClick?: (place: ColombiaPlace) => void;
}

const CONTINENT_VIEWS: Record<
  string,
  { center: [number, number]; zoom: number }
> = {
  Africa: { center: [20, 2], zoom: 2.2 },
  'North America': { center: [-95, 35], zoom: 2 },
  'South America': { center: [-63, -18], zoom: 2.2 },
  Asia: { center: [92, 28], zoom: 1.8 },
  Europe: { center: [7, 48], zoom: 2.4 },
  Oceania: { center: [158, -22], zoom: 2.2 },
};

const COLOMBIA_VIEW = { center: [-73.5, 4] as [number, number], zoom: 4.2 };

// En las misiones no deben verse nombres de países, ciudades, capitales,
// departamentos ni provincias: las etiquetas del mapa delatarían la respuesta.
// Por eso se usa un mapa base sin rótulos durante las actividades.
const BASE_MAPS: Record<
  MapMode,
  { tiles: string[]; attribution: string }
> = {
  explore: {
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    attribution: '© OpenStreetMap',
  },
  activity: {
    tiles: [
      'https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
    ],
    attribution: '© OpenStreetMap © CARTO',
  },
  colombia: {
    tiles: [
      'https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
    ],
    attribution: '© OpenStreetMap © CARTO',
  },
};
const NO_COUNTRY_FILTER: FilterSpecification = [
  '==',
  ['get', 'ISO_A3'],
  '__ninguno__',
];
const NO_PLACE_FILTER: FilterSpecification = [
  '==',
  ['get', 'id'],
  '__ninguno__',
];

function countryFilter(target: CountryTarget): FilterSpecification {
  return [
    'any',
    ['==', ['get', 'ISO_A2'], target.iso2],
    ['==', ['get', 'ISO_A3'], target.iso3],
    ['==', ['get', 'NAME_ES'], target.name],
    ['==', ['get', 'NAME'], target.name],
  ];
}

function placeFeatures(): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: COLOMBIA_PLACES.map((place) => ({
      type: 'Feature',
      id: place.id,
      geometry: {
        type: 'Point',
        coordinates: place.coordinates,
      },
      properties: {
        id: place.id,
        name: place.name,
        department: place.department,
        clue: place.clue,
      },
    })),
  };
}

// Vite prebundles maplibre-gl but does not emit its worker next to the
// optimized bundle, so point MapLibre at the copy served from public assets.
if (typeof document !== 'undefined') {
  maplibregl.setWorkerUrl(
    new URL('maplibre-gl-worker.mjs', document.baseURI).href,
  );
}

export function createWorldMap(
  container: string | HTMLElement,
  options: WorldMapOptions = {},
): Map {
  const mode = options.mode ?? 'explore';
  const baseMap = BASE_MAPS[mode];
  const map = new maplibregl.Map({
    container,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: baseMap.tiles,
          tileSize: 256,
          attribution: baseMap.attribution,
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
    center: options.center ?? [-77, 1.2],
    zoom: options.zoom ?? 2,
  });

  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.FullscreenControl());

  map.on('load', () => {
    map.setProjection({ type: 'globe' });

    map.addSource('paises', {
      type: 'geojson',
      data: '/data/countries.geojson',
      generateId: true,
    });

    map.addLayer({
      id: 'paises-fill',
      type: 'fill',
      source: 'paises',
      paint: {
        'fill-color': '#1F9E8F',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.6,
          0.15,
        ],
      },
    });

    map.addLayer({
      id: 'paises-line',
      type: 'line',
      source: 'paises',
      paint: { 'line-color': '#1F2A44', 'line-width': 1 },
    });

    map.addLayer({
      id: 'paises-highlight-fill',
      type: 'fill',
      source: 'paises',
      filter: NO_COUNTRY_FILTER,
      paint: { 'fill-color': '#F2B134', 'fill-opacity': 0.62 },
    });

    map.addLayer({
      id: 'paises-highlight-line',
      type: 'line',
      source: 'paises',
      filter: NO_COUNTRY_FILTER,
      paint: { 'line-color': '#E8553D', 'line-width': 3 },
    });

    map.addSource('colombia-lugares', {
      type: 'geojson',
      data: placeFeatures(),
      generateId: true,
    });

    map.addLayer({
      id: 'colombia-lugares-halo',
      type: 'circle',
      source: 'colombia-lugares',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': 13,
        'circle-color': '#FFFFFF',
        'circle-opacity': 0.85,
        'circle-stroke-color': '#E8553D',
        'circle-stroke-width': 2,
      },
    });

    map.addLayer({
      id: 'colombia-lugares-circle',
      type: 'circle',
      source: 'colombia-lugares',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': 6,
        'circle-color': '#E8553D',
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2,
      },
    });

    map.addLayer({
      id: 'colombia-lugar-highlight',
      type: 'circle',
      source: 'colombia-lugares',
      filter: NO_PLACE_FILTER,
      paint: {
        'circle-radius': 16,
        'circle-color': '#F2B134',
        'circle-opacity': 0.92,
        'circle-stroke-color': '#1F2A44',
        'circle-stroke-width': 3,
      },
    });

    map.addLayer({
      id: 'colombia-lugares-label',
      type: 'symbol',
      source: 'colombia-lugares',
      layout: {
        visibility: 'none',
        'text-field': ['get', 'name'],
        'text-size': 12,
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#1F2A44',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 2,
      },
    });

    let hoverId: number | string | undefined;

    map.on('mousemove', 'paises-fill', (event: MapLayerMouseEvent) => {
      if (!event.features?.length) {
        return;
      }

      if (hoverId !== undefined) {
        map.setFeatureState({ source: 'paises', id: hoverId }, { hover: false });
      }

      hoverId = event.features[0].id;
      map.setFeatureState({ source: 'paises', id: hoverId! }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'paises-fill', () => {
      if (hoverId !== undefined) {
        map.setFeatureState({ source: 'paises', id: hoverId }, { hover: false });
      }

      hoverId = undefined;
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'paises-fill', async (event: MapLayerMouseEvent) => {
      if (!event.features?.length) {
        return;
      }

      const properties = event.features[0].properties as CountryProperties;

      options.onCountryClick?.(properties);

      if (mode !== 'explore') {
        return;
      }

      openCountryInfo(map, event, properties);
    });

    map.on('mouseenter', 'colombia-lugares-circle', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'colombia-lugares-circle', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'colombia-lugares-circle', (event: MapLayerMouseEvent) => {
      if (!event.features?.length || !options.onPlaceClick) {
        return;
      }

      const properties = event.features[0].properties as {
        id: string;
        name: string;
        department: string;
        clue: string;
      };
      const place = COLOMBIA_PLACES.find((item) => item.id === properties.id);

      if (place) {
        options.onPlaceClick(place);
      }
    });
  });

  return map;
}

function openCountryInfo(
  map: Map,
  event: MapLayerMouseEvent,
  properties: CountryProperties,
): void {
  const countryName =
    properties.NAME_ES ?? properties.NAME ?? properties.ADMIN ?? 'País';
  const target = findCountryTarget(properties);
  const iso2 =
    properties.ISO_A2 && properties.ISO_A2 !== '-99'
      ? properties.ISO_A2
      : target?.iso2;
  const continentName =
    CONTINENTS.find((continent) => continent.id === target?.continent)?.name ??
    properties.CONTINENT ??
    '—';
  const population = properties.POP_EST;

  // Margen superior para que el cuadro de información quepa dentro del mapa.
  const popupRoom = { top: 200, right: 0, bottom: 0, left: 0 };
  const noPadding = { top: 0, right: 0, bottom: 0, left: 0 };

  const popup = new maplibregl.Popup({ maxWidth: '260px', className: 'country-popup' })
    .setLngLat(event.lngLat)
    .setHTML(`
      ${iso2 ? `<img src="https://flagcdn.com/w80/${iso2.toLowerCase()}.png" width="80" alt="" />` : ''}
      <h3>${countryName}</h3>
      <p>Capital: ${target?.capital ?? '—'}</p>
      <p>Continente: ${continentName}</p>
      <p>Población: ${population ? population.toLocaleString('es-CO') : '—'}</p>
    `)
    .addTo(map);

  popup.on('close', () => map.easeTo({ padding: noPadding, duration: 300 }));

  map.flyTo({
    center: event.lngLat,
    zoom: 4,
    duration: 2000,
    padding: popupRoom,
  });
}

export function setContinentFilter(map: Map, continent: string | null): void {
  const filter = continent
    ? (['==', ['get', 'CONTINENT'], continent] as FilterSpecification)
    : null;

  for (const layer of ['paises-fill', 'paises-line']) {
    if (map.getLayer(layer)) {
      map.setFilter(layer, filter);
    }
  }
}

export function setCountryHighlight(
  map: Map,
  target: CountryTarget | null,
): void {
  const filter = target ? countryFilter(target) : NO_COUNTRY_FILTER;

  for (const layer of ['paises-highlight-fill', 'paises-highlight-line']) {
    if (map.getLayer(layer)) {
      map.setFilter(layer, filter);
    }
  }
}

export function setColombiaPlacesVisible(map: Map, visible: boolean): void {
  for (const layer of [
    'colombia-lugares-halo',
    'colombia-lugares-circle',
    'colombia-lugar-highlight',
  ]) {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none');
    }
  }
}

export function setColombiaPlaceLabelsVisible(
  map: Map,
  visible: boolean,
): void {
  if (map.getLayer('colombia-lugares-label')) {
    map.setLayoutProperty(
      'colombia-lugares-label',
      'visibility',
      visible ? 'visible' : 'none',
    );
  }
}

export function setPlaceHighlight(map: Map, placeId: string | null): void {
  if (!map.getLayer('colombia-lugar-highlight')) {
    return;
  }

  map.setFilter(
    'colombia-lugar-highlight',
    placeId
      ? (['==', ['get', 'id'], placeId] as FilterSpecification)
      : NO_PLACE_FILTER,
  );
}

export function focusContinent(map: Map, continent: string | null): void {
  if (!continent) {
    return;
  }

  const view = CONTINENT_VIEWS[continent];

  if (view) {
    map.flyTo({ ...view, duration: 1000 });
  }
}

export function focusCountry(map: Map, target: CountryTarget): void {
  map.flyTo({ center: target.center, zoom: 4, duration: 1200 });
}

export function focusColombia(map: Map): void {
  map.flyTo({ ...COLOMBIA_VIEW, duration: 1100 });
}

export function focusPlace(map: Map, placeId: string): void {
  const place = COLOMBIA_PLACES.find((item) => item.id === placeId);

  if (place) {
    map.flyTo({ center: place.coordinates, zoom: 6.2, duration: 1100 });
  }
}

export function countryMatchesTarget(
  country: CountryProperties,
  target: CountryTarget,
): boolean {
  return (
    country.ISO_A2 === target.iso2 ||
    country.ISO_A3 === target.iso3 ||
    country.NAME_ES === target.name ||
    country.NAME === target.name
  );
}
