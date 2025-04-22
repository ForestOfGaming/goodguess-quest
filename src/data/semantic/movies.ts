
import { SemanticData } from './types';

// Movies database with genre, actors, directors and features
export const moviesDatabase: Record<string, SemanticData> = {
  'avatar': {
    name: 'avatar',
    related: ['scifi', 'james cameron'],
    properties: {
      genre: ['scifi', 'adventure', 'action'],
      director: ['james cameron'],
      features: ['3d', 'aliens', 'pandora', 'visual effects', 'nature']
    }
  },
  'titanic': {
    name: 'titanic',
    related: ['drama', 'james cameron', 'historical'],
    properties: {
      genre: ['drama', 'romance', 'historical'],
      director: ['james cameron'],
      features: ['ship', 'disaster', 'romance', 'iceberg', 'historical']
    }
  },
  'avengers': {
    name: 'avengers',
    related: ['marvel', 'superheroes', 'action'],
    properties: {
      genre: ['action', 'superhero', 'scifi'],
      director: ['joss whedon', 'russo brothers'],
      features: ['iron man', 'thor', 'hulk', 'captain america', 'superheroes']
    }
  },
  'matrix': {
    name: 'matrix',
    related: ['scifi', 'action', 'philosophy'],
    properties: {
      genre: ['scifi', 'action', 'cyberpunk'],
      director: ['wachowskis'],
      features: ['neo', 'virtual reality', 'kung fu', 'dystopian', 'computers']
    }
  },
  'inception': {
    name: 'inception',
    related: ['scifi', 'mind bending', 'dreams'],
    properties: {
      genre: ['scifi', 'thriller', 'action'],
      director: ['christopher nolan'],
      features: ['dreams', 'heist', 'mind', 'complex', 'layers']
    }
  },
  'frozen': {
    name: 'frozen',
    related: ['disney', 'animation', 'musical'],
    properties: {
      genre: ['animation', 'musical', 'fantasy'],
      director: ['jennifer lee', 'chris buck'],
      features: ['elsa', 'anna', 'olaf', 'ice', 'snow', 'princess']
    }
  },
  'joker': {
    name: 'joker',
    related: ['dc', 'batman', 'villain'],
    properties: {
      genre: ['thriller', 'drama', 'crime'],
      director: ['todd phillips'],
      features: ['mental illness', 'villain', 'dark', 'gotham', 'origin story']
    }
  },
  'gladiator': {
    name: 'gladiator',
    related: ['historical', 'ancient rome', 'action'],
    properties: {
      genre: ['action', 'drama', 'historical'],
      director: ['ridley scott'],
      features: ['rome', 'arena', 'revenge', 'emperor', 'battle']
    }
  },
  'jurassic': {
    name: 'jurassic',
    related: ['dinosaurs', 'park', 'world'],
    properties: {
      genre: ['scifi', 'adventure', 'thriller'],
      director: ['steven spielberg', 'colin trevorrow'],
      features: ['dinosaurs', 'park', 'genetic engineering', 'island', 'danger']
    }
  },
  'batman': {
    name: 'batman',
    related: ['dc', 'superhero', 'gotham'],
    properties: {
      genre: ['action', 'superhero', 'crime'],
      director: ['christopher nolan', 'tim burton', 'matt reeves'],
      features: ['gotham', 'joker', 'superhero', 'dark knight', 'detective']
    }
  },
  'superman': {
    name: 'superman',
    related: ['dc', 'superhero', 'krypton'],
    properties: {
      genre: ['action', 'superhero', 'scifi'],
      director: ['richard donner', 'zack snyder'],
      features: ['krypton', 'superhero', 'metropolis', 'reporter', 'flying']
    }
  },
  'wonderwoman': {
    name: 'wonderwoman',
    related: ['dc', 'superhero', 'amazon'],
    properties: {
      genre: ['action', 'superhero', 'war'],
      director: ['patty jenkins'],
      features: ['amazon', 'superhero', 'female hero', 'themyscira', 'world war']
    }
  },
  'starwars': {
    name: 'starwars',
    related: ['scifi', 'space', 'jedi'],
    properties: {
      genre: ['scifi', 'adventure', 'fantasy'],
      director: ['george lucas', 'j.j. abrams', 'rian johnson'],
      features: ['jedi', 'force', 'space', 'lightsaber', 'empire']
    }
  },
  'harrypotter': {
    name: 'harrypotter',
    related: ['fantasy', 'magic', 'wizards'],
    properties: {
      genre: ['fantasy', 'adventure', 'young adult'],
      director: ['chris columbus', 'alfonso cuaron', 'mike newell', 'david yates'],
      features: ['hogwarts', 'magic', 'wizards', 'witchcraft', 'voldemort']
    }
  }
};
