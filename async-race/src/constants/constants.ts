export const BASE_URL = 'http://127.0.0.1:3000';
export const ENDPOINTS = {
  garage: 'garage',
  engine: 'engine',
  winners: 'winners',
};
export const HEADERS = {
  contentType: 'Content-Type',
  totalCount: 'X-Total-Count',
};
export const SEPARATOR = {
  url: '/',
  query: '&',
};
export const MAX_CARS_PER_PAGE = 7;
export const MAX_WINNERS_PER_PAGE = 10;

export const BUTTON_TEXT = {
  garage: 'GARAGE',
  winners: 'WINNERS',
  create: 'CREATE',
  update: 'UPDATE',
  race: 'RACE',
  reset: 'RESET',
  generate: 'GENERATE CARS',
  select: 'SELECT',
  remove: 'REMOVE',
  start: 'START',
  stop: 'STOP',
  previous: 'PREVIOUS',
  next: 'NEXT',
};

export const WINNERS_TABLE_COLUMN_NAMES = ['№', 'Car', 'Name', 'Wins', 'Best time (sec)'];
export const WINNERS_TABLE_COLUMN_NAMES_CLASSES = [
  'number',
  'car-image',
  'car-name',
  'car-wins',
  'car-time',
];

export const CAR_BRANDS = [
  'Acura',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Bentley',
  'Cadillac',
  'Chevrolet',
  'Dodge',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Lincoln',
  'Mazda',
  'Mercedes-Benz',
  'Nissan',
  'Porsche',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

export const CAR_MODELS = [
  'X5',
  'Cayenne',
  'Polo',
  'CX-5',
  'Passat',
  'Ulysse',
  'Panamera',
  'Zafira',
  'Vito',
  'Meteor',
  'Escalade',
  'Accent',
  'Rio',
  'Impreza',
];

export const HASH_SYMBOL = '#';
export const HEXADECIMAL_BASE = 16;

export const GENERATOR_COUNTER = 100;
export const NO_TEXT_CONTENT = '';

export const TEXT_MESSAGE_CONTENT = {
  raceInProgress: 'Race in progress. Wait for the end of the race and click "RESET"',
  showWinner: 'The winner is',
  noInput: 'Please, enter a name',
  noSelectedCar: 'Please, select a car',
};
