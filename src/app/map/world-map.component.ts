import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import type { Map } from 'maplibre-gl';
import type { ColombiaPlace } from './colombia-places';
import {
  createWorldMap,
  focusColombia,
  focusContinent,
  focusCountry,
  focusPlace,
  setColombiaPlaceLabelsVisible,
  setColombiaPlacesVisible,
  setContinentFilter,
  setCountryHighlight,
  setPlaceHighlight,
  type CountryProperties,
  type MapMode,
} from './worldMap';
import type { CountryTarget } from '../missions/activity-data';

@Component({
  selector: 'app-world-map',
  template: `
    <div
      #mapContainer
      class="world-map"
      role="application"
      [attr.aria-label]="ariaLabel()"
    ></div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .world-map {
        width: 100%;
        height: 100%;
        min-height: 420px;
        overflow: hidden;
        border-radius: 18px;
        background: #b8e7f7;
      }
    `,
  ],
})
export class WorldMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer?: ElementRef<HTMLDivElement>;

  readonly mode = input<MapMode>('explore');
  readonly continent = input<string | null>(null);
  readonly highlight = input<CountryTarget | null>(null);
  readonly highlightPlaceId = input<string | null>(null);
  readonly showPlaces = input(false);
  readonly showPlaceLabels = input(false);
  readonly ariaLabel = input('Mapa interactivo del mundo');

  readonly countrySelected = output<CountryProperties>();
  readonly placeSelected = output<ColombiaPlace>();

  private worldMap?: Map;
  private destroyed = false;
  private readonly loaded = signal(false);
  private lastFocusKey = '';

  constructor() {
    effect(() => {
      const options = {
        mode: this.mode(),
        continent: this.continent(),
        highlight: this.highlight(),
        highlightPlaceId: this.highlightPlaceId(),
        showPlaces: this.showPlaces(),
        showPlaceLabels: this.showPlaceLabels(),
      };

      if (!this.loaded() || !this.worldMap) {
        return;
      }

      this.applyOptions(options);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.mapContainer) {
      return;
    }

    if (this.destroyed) {
      return;
    }

    this.worldMap = createWorldMap(this.mapContainer.nativeElement, {
      mode: this.mode(),
      onCountryClick: (country) => this.countrySelected.emit(country),
      onPlaceClick: (place) => this.placeSelected.emit(place),
    });

    this.worldMap.on('load', () => {
      this.loaded.set(true);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.worldMap?.remove();
  }

  private applyOptions(options: {
    mode: MapMode;
    continent: string | null;
    highlight: CountryTarget | null;
    highlightPlaceId: string | null;
    showPlaces: boolean;
    showPlaceLabels: boolean;
  }): void {
    const map = this.worldMap;
    if (!map) {
      return;
    }

    setContinentFilter(map, options.continent);
    setCountryHighlight(map, options.highlight);
    setColombiaPlacesVisible(map, options.showPlaces);
    setColombiaPlaceLabelsVisible(
      map,
      options.showPlaces && options.showPlaceLabels,
    );
    setPlaceHighlight(map, options.highlightPlaceId);

    const focusKey = [
      options.mode,
      options.continent ?? '',
      options.highlight?.iso3 ?? '',
      options.highlightPlaceId ?? '',
    ].join('|');

    if (focusKey === this.lastFocusKey) {
      return;
    }

    this.lastFocusKey = focusKey;

    if (options.highlight) {
      focusCountry(map, options.highlight);
    } else if (options.highlightPlaceId) {
      focusPlace(map, options.highlightPlaceId);
    } else if (options.mode === 'colombia' || options.showPlaces) {
      focusColombia(map);
    } else if (options.continent) {
      focusContinent(map, options.continent);
    }
  }
}
