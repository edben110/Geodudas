import { COLOMBIA_PLACES, type ColombiaPlace } from '../map/colombia-places';

export type ContinentId =
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Asia'
  | 'Europe'
  | 'Oceania';

export type MissionId = 'paises' | 'banderas' | 'colombia';

export interface CountryTarget {
  name: string;
  iso2: string;
  iso3: string;
  capital: string;
  continent: ContinentId;
  center: [number, number];
}

export interface Continent {
  id: ContinentId;
  name: string;
  icon: string;
  countries: CountryTarget[];
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'blue' | 'orange';
  topic: string;
  instructions: string;
}

export interface ActivityQuestion {
  id: string;
  continent: ContinentId;
  continentName: string;
  country?: CountryTarget;
  place?: ColombiaPlace;
  prompt: string;
  hint: string;
}

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'paises',
    title: 'Encuentra el país',
    description:
      'Toca en el mapa el país que te pedimos. Cada ronda te lleva a un continente diferente.',
    icon: 'globe-hemisphere-west-duotone',
    color: 'green',
    topic: 'El mundo',
    instructions: 'Lee el nombre del país y tócalo en el mapa.',
  },
  {
    id: 'banderas',
    title: 'Descubre la bandera',
    description:
      'Observa la bandera y busca en el mapa el país al que pertenece.',
    icon: 'flag-banner-duotone',
    color: 'blue',
    topic: 'El mundo',
    instructions: 'Mira la bandera y toca el país correcto en el mapa.',
  },
  {
    id: 'colombia',
    title: 'Colombia en el mapa',
    description:
      'Recorre Colombia y encuentra sus ciudades y departamentos más importantes.',
    icon: 'mountains-duotone',
    color: 'orange',
    topic: 'Mi país',
    instructions: 'Toca el punto donde se encuentra el lugar que te pedimos.',
  },
];

export const CONTINENTS: Continent[] = [
  {
    id: 'Africa',
    name: 'África',
    icon: '🌍',
    countries: [
      {
        name: 'Egipto',
        iso2: 'EG',
        iso3: 'EGY',
        capital: 'El Cairo',
        continent: 'Africa',
        center: [29.445837, 26.186173],
      },
      {
        name: 'Kenia',
        iso2: 'KE',
        iso3: 'KEN',
        capital: 'Nairobi',
        continent: 'Africa',
        center: [37.907632, 0.549043],
      },
      {
        name: 'Sudáfrica',
        iso2: 'ZA',
        iso3: 'ZAF',
        capital: 'Pretoria',
        continent: 'Africa',
        center: [23.665734, -29.708776],
      },
      {
        name: 'Nigeria',
        iso2: 'NG',
        iso3: 'NGA',
        capital: 'Abuya',
        continent: 'Africa',
        center: [7.50322, 9.439799],
      },
      {
        name: 'Marruecos',
        iso2: 'MA',
        iso3: 'MAR',
        capital: 'Rabat',
        continent: 'Africa',
        center: [-7.187296, 31.650723],
      },
      {
        name: 'Madagascar',
        iso2: 'MG',
        iso3: 'MDG',
        capital: 'Antananarivo',
        continent: 'Africa',
        center: [46.704241, -18.628288],
      },
      {
        name: 'Ghana',
        iso2: 'GH',
        iso3: 'GHA',
        capital: 'Acra',
        continent: 'Africa',
        center: [-1.036941, 7.717639],
      },
    ],
  },
  {
    id: 'North America',
    name: 'América del Norte',
    icon: '🌎',
    countries: [
      {
        name: 'Canadá',
        iso2: 'CA',
        iso3: 'CAN',
        capital: 'Ottawa',
        continent: 'North America',
        center: [-101.9107, 60.324287],
      },
      {
        name: 'Estados Unidos',
        iso2: 'US',
        iso3: 'USA',
        capital: 'Washington D. C.',
        continent: 'North America',
        center: [-97.482602, 39.538479],
      },
      {
        name: 'México',
        iso2: 'MX',
        iso3: 'MEX',
        capital: 'Ciudad de México',
        continent: 'North America',
        center: [-102.289448, 23.919988],
      },
      {
        name: 'Costa Rica',
        iso2: 'CR',
        iso3: 'CRI',
        capital: 'San José',
        continent: 'North America',
        center: [-84.077922, 10.0651],
      },
      {
        name: 'Cuba',
        iso2: 'CU',
        iso3: 'CUB',
        capital: 'La Habana',
        continent: 'North America',
        center: [-77.975855, 21.334024],
      },
      {
        name: 'Panamá',
        iso2: 'PA',
        iso3: 'PAN',
        capital: 'Ciudad de Panamá',
        continent: 'North America',
        center: [-80.352106, 8.72198],
      },
      {
        name: 'Jamaica',
        iso2: 'JM',
        iso3: 'JAM',
        capital: 'Kingston',
        continent: 'North America',
        center: [-77.318767, 18.137124],
      },
    ],
  },
  {
    id: 'South America',
    name: 'América del Sur',
    icon: '🌎',
    countries: [
      {
        name: 'Colombia',
        iso2: 'CO',
        iso3: 'COL',
        capital: 'Bogotá',
        continent: 'South America',
        center: [-73.174347, 3.373111],
      },
      {
        name: 'Brasil',
        iso2: 'BR',
        iso3: 'BRA',
        capital: 'Brasilia',
        continent: 'South America',
        center: [-49.55945, -12.098687],
      },
      {
        name: 'Argentina',
        iso2: 'AR',
        iso3: 'ARG',
        capital: 'Buenos Aires',
        continent: 'South America',
        center: [-64.173331, -33.501159],
      },
      {
        name: 'Chile',
        iso2: 'CL',
        iso3: 'CHL',
        capital: 'Santiago',
        continent: 'South America',
        center: [-72.318871, -38.151771],
      },
      {
        name: 'Perú',
        iso2: 'PE',
        iso3: 'PER',
        capital: 'Lima',
        continent: 'South America',
        center: [-72.90016, -12.976679],
      },
      {
        name: 'Ecuador',
        iso2: 'EC',
        iso3: 'ECU',
        capital: 'Quito',
        continent: 'South America',
        center: [-78.188375, -1.259076],
      },
      {
        name: 'Uruguay',
        iso2: 'UY',
        iso3: 'URY',
        capital: 'Montevideo',
        continent: 'South America',
        center: [-55.966942, -32.961127],
      },
    ],
  },
  {
    id: 'Asia',
    name: 'Asia',
    icon: '🌏',
    countries: [
      {
        name: 'Japón',
        iso2: 'JP',
        iso3: 'JPN',
        capital: 'Tokio',
        continent: 'Asia',
        center: [138.44217, 36.142538],
      },
      {
        name: 'India',
        iso2: 'IN',
        iso3: 'IND',
        capital: 'Nueva Delhi',
        continent: 'Asia',
        center: [79.358105, 22.686852],
      },
      {
        name: 'China',
        iso2: 'CN',
        iso3: 'CHN',
        capital: 'Pekín',
        continent: 'Asia',
        center: [106.337289, 32.498178],
      },
      {
        name: 'Corea del Sur',
        iso2: 'KR',
        iso3: 'KOR',
        capital: 'Seúl',
        continent: 'Asia',
        center: [128.129504, 36.384924],
      },
      {
        name: 'Tailandia',
        iso2: 'TH',
        iso3: 'THA',
        capital: 'Bangkok',
        continent: 'Asia',
        center: [101.073198, 15.45974],
      },
      {
        name: 'Arabia Saudita',
        iso2: 'SA',
        iso3: 'SAU',
        capital: 'Riad',
        continent: 'Asia',
        center: [44.6996, 23.806908],
      },
      {
        name: 'Turquía',
        iso2: 'TR',
        iso3: 'TUR',
        capital: 'Ankara',
        continent: 'Asia',
        center: [34.508268, 39.345388],
      },
      {
        name: 'Indonesia',
        iso2: 'ID',
        iso3: 'IDN',
        capital: 'Yakarta',
        continent: 'Asia',
        center: [101.892949, -0.954404],
      },
    ],
  },
  {
    id: 'Europe',
    name: 'Europa',
    icon: '🌍',
    countries: [
      {
        name: 'España',
        iso2: 'ES',
        iso3: 'ESP',
        capital: 'Madrid',
        continent: 'Europe',
        center: [-3.464718, 40.090953],
      },
      {
        name: 'Francia',
        iso2: 'FR',
        iso3: 'FRA',
        capital: 'París',
        continent: 'Europe',
        center: [2.552275, 46.696113],
      },
      {
        name: 'Italia',
        iso2: 'IT',
        iso3: 'ITA',
        capital: 'Roma',
        continent: 'Europe',
        center: [11.076907, 44.732482],
      },
      {
        name: 'Alemania',
        iso2: 'DE',
        iso3: 'DEU',
        capital: 'Berlín',
        continent: 'Europe',
        center: [9.678348, 50.961733],
      },
      {
        name: 'Reino Unido',
        iso2: 'GB',
        iso3: 'GBR',
        capital: 'Londres',
        continent: 'Europe',
        center: [-2.116346, 54.402739],
      },
      {
        name: 'Portugal',
        iso2: 'PT',
        iso3: 'PRT',
        capital: 'Lisboa',
        continent: 'Europe',
        center: [-8.271754, 39.606675],
      },
      {
        name: 'Grecia',
        iso2: 'GR',
        iso3: 'GRC',
        capital: 'Atenas',
        continent: 'Europe',
        center: [21.72568, 39.492763],
      },
      {
        name: 'Noruega',
        iso2: 'NO',
        iso3: 'NOR',
        capital: 'Oslo',
        continent: 'Europe',
        center: [9.679975, 61.357092],
      },
    ],
  },
  {
    id: 'Oceania',
    name: 'Oceanía',
    icon: '🌏',
    countries: [
      {
        name: 'Australia',
        iso2: 'AU',
        iso3: 'AUS',
        capital: 'Canberra',
        continent: 'Oceania',
        center: [134.04972, -24.129522],
      },
      {
        name: 'Nueva Zelanda',
        iso2: 'NZ',
        iso3: 'NZL',
        capital: 'Wellington',
        continent: 'Oceania',
        center: [172.787, -39.759],
      },
      {
        name: 'Fiyi',
        iso2: 'FJ',
        iso3: 'FJI',
        capital: 'Suva',
        continent: 'Oceania',
        center: [177.975427, -17.826099],
      },
      {
        name: 'Papúa Nueva Guinea',
        iso2: 'PG',
        iso3: 'PNG',
        capital: 'Port Moresby',
        continent: 'Oceania',
        center: [143.910216, -5.695285],
      },
      {
        name: 'Islas Salomón',
        iso2: 'SB',
        iso3: 'SLB',
        capital: 'Honiara',
        continent: 'Oceania',
        center: [159.170468, -8.029548],
      },
      {
        name: 'Vanuatu',
        iso2: 'VU',
        iso3: 'VUT',
        capital: 'Port Vila',
        continent: 'Oceania',
        center: [166.908762, -15.37153],
      },
    ],
  },
];

export const ALL_COUNTRIES = CONTINENTS.flatMap((continent) => continent.countries);

export const COLOMBIA_MISSION_PLACES = COLOMBIA_PLACES;

export function getContinent(continentId: ContinentId): Continent {
  return CONTINENTS.find((continent) => continent.id === continentId) ?? CONTINENTS[0];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
