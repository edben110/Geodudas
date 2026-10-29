import * as maplibregl from 'maplibre-gl';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function createWorldMap(container: string | HTMLElement): Map {
  const map = new maplibregl.Map({
    container,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
    center: [-77, 1.2], // Pasto
    zoom: 2,
  });

  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.FullscreenControl());

  map.on('load', () => {
    map.setProjection({ type: 'globe' }); // vista 3D tipo globo

    map.addSource('paises', { type: 'geojson', data: '/data/countries.geojson', generateId: true });

    // Relleno de países (cambia de color al pasar el mouse)
    map.addLayer({
      id: 'paises-fill',
      type: 'fill',
      source: 'paises',
      paint: {
        'fill-color': '#4CAF50',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, 0.15],
      },
    });
    map.addLayer({
      id: 'paises-line',
      type: 'line',
      source: 'paises',
      paint: { 'line-color': '#1B5E20', 'line-width': 1 },
    });

    let hoverId: number | string | undefined;

    map.on('mousemove', 'paises-fill', (e: MapLayerMouseEvent) => {
      if (!e.features?.length) return;
      if (hoverId !== undefined) map.setFeatureState({ source: 'paises', id: hoverId }, { hover: false });
      hoverId = e.features[0].id;
      map.setFeatureState({ source: 'paises', id: hoverId! }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'paises-fill', () => {
      if (hoverId !== undefined) map.setFeatureState({ source: 'paises', id: hoverId }, { hover: false });
      hoverId = undefined;
      map.getCanvas().style.cursor = '';
    });

    // Clic: zoom al país + ficha informativa
    map.on('click', 'paises-fill', async (e: MapLayerMouseEvent) => {
      const p = e.features![0].properties as {
        NAME?: string;
        NAME_ES?: string;
        ADMIN?: string;
        ISO_A2: string;
        CONTINENT: string;
      };
      const countryName = p.NAME_ES ?? p.NAME ?? p.ADMIN ?? 'País';
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${p.ISO_A2}`);
      const [c] = await res.json();

      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <img src="${c.flags.svg}" width="80" />
          <h3>${countryName}</h3>
          <p>Capital: ${c.capital?.[0] ?? '—'}</p>
          <p>Continente: ${p.CONTINENT}</p>
          <p>Población: ${c.population.toLocaleString('es-CO')}</p>
        `)
        .addTo(map);

      map.flyTo({ center: e.lngLat, zoom: 4, duration: 2000 });
    });
  });

  return map;
}