
import { SemanticData } from './types';

// Sports database with type, equipment, and features
export const sportsDatabase: Record<string, SemanticData> = {
  'soccer': {
    name: 'soccer',
    related: ['football', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'ball sport', 'outdoor'],
      equipment: ['ball', 'goal', 'cleats', 'field'],
      features: ['worldwide', 'popular', 'world cup', 'leagues']
    }
  },
  'basketball': {
    name: 'basketball',
    related: ['hoops', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'ball sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'hoop', 'court', 'backboard'],
      features: ['nba', 'jumping', 'scoring', 'fast-paced']
    }
  },
  'tennis': {
    name: 'tennis',
    related: ['racket sport', 'sport'],
    properties: {
      type: ['racket sport', 'individual sport', 'outdoor', 'indoor'],
      equipment: ['racket', 'ball', 'net', 'court'],
      features: ['grand slam', 'serve', 'volley', 'tournaments']
    }
  },
  'baseball': {
    name: 'baseball',
    related: ['bat and ball', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'bat and ball', 'outdoor'],
      equipment: ['bat', 'ball', 'glove', 'field', 'bases'],
      features: ['mlb', 'innings', 'pitching', 'hitting']
    }
  },
  'golf': {
    name: 'golf',
    related: ['club sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'club sport', 'outdoor'],
      equipment: ['clubs', 'ball', 'tee', 'course'],
      features: ['pga', 'putting', 'driving', 'holes']
    }
  },
  'hockey': {
    name: 'hockey',
    related: ['ice sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'stick sport', 'ice sport'],
      equipment: ['stick', 'puck', 'skates', 'rink', 'goal'],
      features: ['nhl', 'checking', 'penalties', 'goalie']
    }
  },
  'volleyball': {
    name: 'volleyball',
    related: ['net sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'net sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'net', 'court'],
      features: ['spiking', 'serving', 'blocking', 'sets']
    }
  },
  'swimming': {
    name: 'swimming',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'olympic'],
      equipment: ['swimsuit', 'goggles', 'pool', 'water'],
      features: ['strokes', 'races', 'laps', 'diving']
    }
  },
  'cycling': {
    name: 'cycling',
    related: ['biking', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor'],
      equipment: ['bicycle', 'helmet', 'road', 'track'],
      features: ['tour de france', 'peloton', 'racing', 'stages']
    }
  },
  'rugby': {
    name: 'rugby',
    related: ['football', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'contact sport', 'outdoor'],
      equipment: ['ball', 'field', 'posts'],
      features: ['scrums', 'tackling', 'world cup', 'tries']
    }
  },
  'skiing': {
    name: 'skiing',
    related: ['winter sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'winter sport', 'outdoor'],
      equipment: ['skis', 'poles', 'boots', 'snow', 'mountain'],
      features: ['downhill', 'slalom', 'cross-country', 'jumps']
    }
  },
  'gymnastics': {
    name: 'gymnastics',
    related: ['acrobatics', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'artistic sport', 'indoor'],
      equipment: ['beam', 'bars', 'vault', 'floor', 'rings'],
      features: ['flips', 'routines', 'flexibility', 'strength']
    }
  },
  'boxing': {
    name: 'boxing',
    related: ['fighting', 'sport', 'combat sport'],
    properties: {
      type: ['combat sport', 'individual sport', 'indoor'],
      equipment: ['gloves', 'ring', 'mouthguard'],
      features: ['punches', 'rounds', 'knockouts', 'weight classes']
    }
  },
  'surfing': {
    name: 'surfing',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'outdoor'],
      equipment: ['surfboard', 'wetsuit', 'waves', 'ocean'],
      features: ['riding waves', 'barrels', 'competitions', 'beaches']
    }
  },
  'running': {
    name: 'running',
    related: ['track', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor', 'indoor'],
      equipment: ['shoes', 'track', 'road'],
      features: ['marathon', 'sprints', 'olympics', 'races']
    }
  }
};
