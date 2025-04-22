import { SemanticData } from './types';

export const sportsDatabase: Record<string, SemanticData> = {
  'soccer': {
    name: 'soccer',
    related: ['football', 'sport', 'team sport', 'ball game', 'field sport', 'competitive'],
    properties: {
      type: ['team sport', 'ball sport', 'outdoor', 'field game'],
      equipment: ['ball', 'goal', 'cleats', 'field', 'nets'],
      features: ['worldwide', 'popular', 'world cup', 'leagues'],
      skills: ['running', 'kicking', 'passing', 'teamwork'],
      scoring: ['goals', 'points', 'win-loss'],
      players: ['goalkeeper', 'defender', 'midfielder', 'striker'],
      duration: ['timed', 'periods', 'halves'],
      venue: ['stadium', 'field', 'pitch', 'arena']
    }
  },
  'basketball': {
    name: 'basketball',
    related: ['hoops', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'ball sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'hoop', 'court', 'backboard'],
      features: ['nba', 'jumping', 'scoring', 'fast-paced'],
      skills: ['dribbling', 'shooting', 'passing', 'defense'],
      scoring: ['points', 'rebounds', 'assists'],
      players: ['guard', 'forward', 'center', 'point guard'],
      duration: ['quarters', 'halves', 'games'],
      venue: ['basketball court', 'arena', 'stadium']
    }
  },
  'tennis': {
    name: 'tennis',
    related: ['racket sport', 'sport'],
    properties: {
      type: ['racket sport', 'individual sport', 'outdoor', 'indoor'],
      equipment: ['racket', 'ball', 'net', 'court'],
      features: ['grand slam', 'serve', 'volley', 'tournaments'],
      skills: ['forehand', 'backhand', 'return', 'volleying'],
      scoring: ['points', 'sets', 'games'],
      players: ['singles player', 'doubles player'],
      duration: ['sets', 'games', 'matches'],
      venue: ['tennis court', 'arena', 'stadium']
    }
  },
  'baseball': {
    name: 'baseball',
    related: ['bat and ball', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'bat and ball', 'outdoor'],
      equipment: ['bat', 'ball', 'glove', 'field', 'bases'],
      features: ['mlb', 'innings', 'pitching', 'hitting'],
      skills: ['batting', 'throwing', 'fielding', 'base running'],
      scoring: ['runs', 'hits', 'errors'],
      players: ['pitcher', 'batter', 'catcher', 'first baseman'],
      duration: ['innings', 'games', 'seasons'],
      venue: ['baseball stadium', 'park', 'field']
    }
  },
  'golf': {
    name: 'golf',
    related: ['club sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'club sport', 'outdoor'],
      equipment: ['clubs', 'ball', 'tee', 'course'],
      features: ['pga', 'putting', 'driving', 'holes'],
      skills: ['swinging', 'chipping', 'putting', 'scoring'],
      scoring: ['strokes', 'par', 'score'],
      players: ['professional golfer', 'amateur golfer'],
      duration: ['rounds', 'tournaments', 'seasons'],
      venue: ['golf course', 'course', 'course']
    }
  },
  'hockey': {
    name: 'hockey',
    related: ['ice sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'stick sport', 'ice sport'],
      equipment: ['stick', 'puck', 'skates', 'rink', 'goal'],
      features: ['nhl', 'checking', 'penalties', 'goalie'],
      skills: ['shooting', 'checking', 'passing', 'defense'],
      scoring: ['goals', 'assists', 'points'],
      players: ['goalie', 'defender', 'center', 'forward'],
      duration: ['games', 'seasons', 'series'],
      venue: ['ice rink', 'arena', 'stadium']
    }
  },
  'volleyball': {
    name: 'volleyball',
    related: ['net sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'net sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'net', 'court'],
      features: ['spiking', 'serving', 'blocking', 'sets'],
      skills: ['spiking', 'serving', 'blocking', 'setting'],
      scoring: ['points', 'sets', 'games'],
      players: ['setter', 'libero', 'middle blocker', 'outside hitter'],
      duration: ['sets', 'games', 'matches'],
      venue: ['volleyball court', 'arena', 'stadium']
    }
  },
  'swimming': {
    name: 'swimming',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'olympic'],
      equipment: ['swimsuit', 'goggles', 'pool', 'water'],
      features: ['strokes', 'races', 'laps', 'diving'],
      skills: ['freestyle', 'backstroke', 'breaststroke', 'butterfly'],
      scoring: ['laps', 'time', 'score'],
      players: ['swimmer', 'diver', 'freestyle swimmer', 'backstroke swimmer'],
      duration: ['laps', 'events', 'seasons'],
      venue: ['swimming pool', 'arena', 'stadium']
    }
  },
  'cycling': {
    name: 'cycling',
    related: ['biking', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor'],
      equipment: ['bicycle', 'helmet', 'road', 'track'],
      features: ['tour de france', 'peloton', 'racing', 'stages'],
      skills: ['pedaling', 'sprinting', 'mountain biking', 'road biking'],
      scoring: ['points', 'time', 'distance'],
      players: ['cyclist', 'road cyclist', 'mountain biker'],
      duration: ['laps', 'events', 'seasons'],
      venue: ['cycling track', 'arena', 'stadium']
    }
  },
  'rugby': {
    name: 'rugby',
    related: ['football', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'contact sport', 'outdoor'],
      equipment: ['ball', 'field', 'posts'],
      features: ['scrums', 'tackling', 'world cup', 'tries'],
      skills: ['running', 'passing', 'tackling', 'scrumming'],
      scoring: ['tries', 'conversions', 'penalties'],
      players: ['hooker', 'fly-half', 'scrum-half', 'full-back'],
      duration: ['games', 'series', 'seasons'],
      venue: ['rugby field', 'arena', 'stadium']
    }
  },
  'skiing': {
    name: 'skiing',
    related: ['winter sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'winter sport', 'outdoor'],
      equipment: ['skis', 'poles', 'boots', 'snow', 'mountain'],
      features: ['downhill', 'slalom', 'cross-country', 'jumps'],
      skills: ['skating', 'turning', 'jumping', 'cross-country skiing'],
      scoring: ['points', 'time', 'distance'],
      players: ['skier', 'downhill skier', 'cross-country skier'],
      duration: ['laps', 'events', 'seasons'],
      venue: ['skiing resort', 'arena', 'stadium']
    }
  },
  'gymnastics': {
    name: 'gymnastics',
    related: ['acrobatics', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'artistic sport', 'indoor'],
      equipment: ['beam', 'bars', 'vault', 'floor', 'rings'],
      features: ['flips', 'routines', 'flexibility', 'strength'],
      skills: ['balance', 'flexibility', 'strength', 'routines'],
      scoring: ['points', 'routines', 'score'],
      players: ['gymnast', 'balance beam gymnast', 'vault gymnast'],
      duration: ['routines', 'events', 'seasons'],
      venue: ['gymnasium', 'arena', 'stadium']
    }
  },
  'boxing': {
    name: 'boxing',
    related: ['fighting', 'sport', 'combat sport'],
    properties: {
      type: ['combat sport', 'individual sport', 'indoor'],
      equipment: ['gloves', 'ring', 'mouthguard'],
      features: ['punches', 'rounds', 'knockouts', 'weight classes'],
      skills: ['punching', 'striking', 'defense', 'boxing'],
      scoring: ['points', 'rounds', 'knockouts', 'weight classes'],
      players: ['boxer', 'professional boxer', 'amateur boxer'],
      duration: ['rounds', 'matches', 'seasons'],
      venue: ['boxing ring', 'arena', 'stadium']
    }
  },
  'surfing': {
    name: 'surfing',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'outdoor'],
      equipment: ['surfboard', 'wetsuit', 'waves', 'ocean'],
      features: ['riding waves', 'barrels', 'competitions', 'beaches'],
      skills: ['surfing', 'boarding', 'riding', 'surfing'],
      scoring: ['points', 'time', 'distance'],
      players: ['surfer', 'professional surfer', 'amateur surfer'],
      duration: ['laps', 'events', 'seasons'],
      venue: ['surfing beach', 'arena', 'stadium']
    }
  },
  'running': {
    name: 'running',
    related: ['track', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor', 'indoor'],
      equipment: ['shoes', 'track', 'road'],
      features: ['marathon', 'sprints', 'olympics', 'races'],
      skills: ['running', 'speed', 'endurance', 'cross-country'],
      scoring: ['laps', 'time', 'distance'],
      players: ['runner', 'professional runner', 'amateur runner'],
      duration: ['laps', 'events', 'seasons'],
      venue: ['running track', 'arena', 'stadium']
    }
  }
};
