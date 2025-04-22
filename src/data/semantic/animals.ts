import { SemanticData } from './types';

export const animalsDatabase: Record<string, SemanticData> = {
  'elephant': {
    name: 'elephant',
    related: ['mammoth', 'pachyderm', 'herbivore', 'land mammal', 'african animal', 'asian animal'],
    properties: {
      species: ['mammal', 'herbivore', 'pachyderm'],
      habitat: ['savanna', 'forest', 'jungle', 'grassland'],
      features: ['trunk', 'tusks', 'large', 'gray'],
      behavior: ['social', 'intelligent', 'maternal', 'peaceful'],
      diet: ['vegetarian', 'herbivorous', 'plant-eater'],
      size: ['large', 'heavy', 'tall'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'tiger': {
    name: 'tiger',
    related: ['cat', 'lion', 'predator'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['jungle', 'forest', 'asia'],
      features: ['stripes', 'orange', 'black', 'predator'],
      behavior: ['agile', 'social', 'intelligent'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'lion': {
    name: 'lion',
    related: ['cat', 'tiger', 'predator'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['mane', 'tan', 'predator', 'pride'],
      behavior: ['dominant', 'social', 'intelligent'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['large', 'heavy'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'zebra': {
    name: 'zebra',
    related: ['horse', 'equine'],
    properties: {
      species: ['mammal', 'herbivore', 'equine'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['stripes', 'black', 'white', 'hooves'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'giraffe': {
    name: 'giraffe',
    related: ['herbivore', 'tall'],
    properties: {
      species: ['mammal', 'herbivore'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['long neck', 'spots', 'tall', 'yellow', 'brown'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['large', 'heavy'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'monkey': {
    name: 'monkey',
    related: ['ape', 'primate', 'chimpanzee'],
    properties: {
      species: ['mammal', 'omnivore', 'primate'],
      habitat: ['jungle', 'forest', 'tropics'],
      features: ['tail', 'climb', 'agile', 'social'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['omnivorous', 'plant-eater', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'dolphin': {
    name: 'dolphin',
    related: ['whale', 'porpoise', 'cetacean'],
    properties: {
      species: ['mammal', 'carnivore', 'cetacean'],
      habitat: ['ocean', 'sea', 'marine'],
      features: ['intelligent', 'fins', 'tail', 'echolocation'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'penguin': {
    name: 'penguin',
    related: ['bird', 'seabird'],
    properties: {
      species: ['bird', 'carnivore', 'flightless'],
      habitat: ['antarctica', 'cold', 'ice', 'ocean'],
      features: ['black', 'white', 'wings', 'waddle', 'swim'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'koala': {
    name: 'koala',
    related: ['marsupial', 'bear-like'],
    properties: {
      species: ['mammal', 'herbivore', 'marsupial'],
      habitat: ['australia', 'trees', 'forests'],
      features: ['eucalyptus', 'pouch', 'gray', 'furry'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'kangaroo': {
    name: 'kangaroo',
    related: ['marsupial', 'wallaby'],
    properties: {
      species: ['mammal', 'herbivore', 'marsupial'],
      habitat: ['australia', 'grassland'],
      features: ['pouch', 'hop', 'jump', 'tail', 'powerful legs'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'cheetah': {
    name: 'cheetah',
    related: ['cat', 'leopard', 'feline'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['spots', 'fast', 'slender', 'tan'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'rhinoceros': {
    name: 'rhinoceros',
    related: ['rhino', 'pachyderm'],
    properties: {
      species: ['mammal', 'herbivore', 'pachyderm'],
      habitat: ['savanna', 'grassland', 'africa', 'asia'],
      features: ['horn', 'thick skin', 'large', 'gray'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['large', 'heavy'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'hippopotamus': {
    name: 'hippopotamus',
    related: ['hippo', 'river horse'],
    properties: {
      species: ['mammal', 'herbivore'],
      habitat: ['river', 'lake', 'water', 'africa'],
      features: ['large mouth', 'water', 'large', 'gray'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['large', 'heavy'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'crocodile': {
    name: 'crocodile',
    related: ['alligator', 'reptile', 'predator'],
    properties: {
      species: ['reptile', 'carnivore', 'predator'],
      habitat: ['river', 'swamp', 'water', 'tropics'],
      features: ['scales', 'teeth', 'tail', 'green'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['carnivorous', 'meat-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  },
  'panda': {
    name: 'panda',
    related: ['bear', 'bamboo'],
    properties: {
      species: ['mammal', 'herbivore', 'bear'],
      habitat: ['forest', 'mountain', 'china'],
      features: ['black', 'white', 'bamboo', 'cute'],
      behavior: ['social', 'intelligent', 'agile'],
      diet: ['herbivorous', 'plant-eater'],
      size: ['medium', 'large'],
      lifespan: ['long-lived', 'elderly'],
      status: ['endangered', 'protected']
    }
  }
};
