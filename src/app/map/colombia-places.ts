export interface ColombiaPlace {
  id: string;
  name: string;
  department: string;
  clue: string;
  coordinates: [number, number];
}

/**
 * Lugares de Colombia que se usan en la misión "Colombia en el mapa".
 * Las coordenadas están en formato [longitud, latitud], tal como las espera MapLibre.
 */
export const COLOMBIA_PLACES: ColombiaPlace[] = [
  {
    id: 'bogota',
    name: 'Bogotá',
    department: 'Cundinamarca',
    clue: 'Es la capital de Colombia y el centro político del país.',
    coordinates: [-74.0721, 4.711],
  },
  {
    id: 'medellin',
    name: 'Medellín',
    department: 'Antioquia',
    clue: 'La llaman la Ciudad de la Eterna Primavera.',
    coordinates: [-75.5812, 6.2442],
  },
  {
    id: 'cali',
    name: 'Cali',
    department: 'Valle del Cauca',
    clue: 'Es conocida como la capital mundial de la salsa.',
    coordinates: [-76.532, 3.4516],
  },
  {
    id: 'cartagena',
    name: 'Cartagena',
    department: 'Bolívar',
    clue: 'Su ciudad amurallada es Patrimonio de la Humanidad.',
    coordinates: [-75.4794, 10.391],
  },
  {
    id: 'barranquilla',
    name: 'Barranquilla',
    department: 'Atlántico',
    clue: 'Allí se celebra uno de los carnavales más famosos de Colombia.',
    coordinates: [-74.7813, 10.9685],
  },
  {
    id: 'bucaramanga',
    name: 'Bucaramanga',
    department: 'Santander',
    clue: 'Es conocida como la ciudad de los parques.',
    coordinates: [-73.1227, 7.1193],
  },
  {
    id: 'santa-marta',
    name: 'Santa Marta',
    department: 'Magdalena',
    clue: 'Es la ciudad más antigua de Colombia y está junto al mar Caribe.',
    coordinates: [-74.199, 11.2404],
  },
  {
    id: 'pereira',
    name: 'Pereira',
    department: 'Risaralda',
    clue: 'Está en el corazón del Eje Cafetero.',
    coordinates: [-75.6961, 4.8133],
  },
  {
    id: 'manizales',
    name: 'Manizales',
    department: 'Caldas',
    clue: 'Es una ciudad cafetera cercana al Nevado del Ruiz.',
    coordinates: [-75.5174, 5.0689],
  },
  {
    id: 'cucuta',
    name: 'Cúcuta',
    department: 'Norte de Santander',
    clue: 'Es una ciudad fronteriza con Venezuela.',
    coordinates: [-72.4967, 7.8891],
  },
  {
    id: 'ibague',
    name: 'Ibagué',
    department: 'Tolima',
    clue: 'Es conocida como la capital musical de Colombia.',
    coordinates: [-75.2322, 4.4389],
  },
  {
    id: 'villavicencio',
    name: 'Villavicencio',
    department: 'Meta',
    clue: 'Es la puerta de entrada a los Llanos Orientales.',
    coordinates: [-73.6266, 4.142],
  },
  {
    id: 'leticia',
    name: 'Leticia',
    department: 'Amazonas',
    clue: 'Está en la selva amazónica, en la triple frontera con Brasil y Perú.',
    coordinates: [-69.9406, -4.2153],
  },
  {
    id: 'quibdo',
    name: 'Quibdó',
    department: 'Chocó',
    clue: 'Es la capital del Chocó, en la región Pacífica.',
    coordinates: [-76.6611, 5.6947],
  },
  {
    id: 'san-andres',
    name: 'San Andrés',
    department: 'Archipiélago de San Andrés, Providencia y Santa Catalina',
    clue: 'Es una isla del Caribe colombiano.',
    coordinates: [-81.7006, 12.5847],
  },
  {
    id: 'pasto',
    name: 'Pasto',
    department: 'Nariño',
    clue: 'Es la ciudad de los volcanes y del Carnaval de Negros y Blancos.',
    coordinates: [-77.2811, 1.2136],
  },
  {
    id: 'popayan',
    name: 'Popayán',
    department: 'Cauca',
    clue: 'La llaman la Ciudad Blanca.',
    coordinates: [-76.6147, 2.4448],
  },
  {
    id: 'monteria',
    name: 'Montería',
    department: 'Córdoba',
    clue: 'Es una ciudad ganadera de la región Caribe.',
    coordinates: [-75.8814, 8.748],
  },
  {
    id: 'riohacha',
    name: 'Riohacha',
    department: 'La Guajira',
    clue: 'Es tierra de la cultura wayuu y está junto al mar Caribe.',
    coordinates: [-72.9072, 11.5444],
  },
  {
    id: 'yopal',
    name: 'Yopal',
    department: 'Casanare',
    clue: 'Es una ciudad llanera entre ríos y sabanas.',
    coordinates: [-72.3959, 5.3378],
  },
];
