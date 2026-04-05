export const INITIAL_STATE = {
  day: 1,
  tick: 0,
  resources: { food: 100, water: 100, energy: 80, mats: 50 },
  maxRes:     { food: 300, water: 300, energy: 200, mats: 500 },

  rooms: [
    { id: 'kitchen',   name: 'Cuisine',     icon: '🍖', floor: 0, col: 1, level: 1, maxWorkers: 2, workers: [], production: { food: 3 },   consumption: { energy: 1 } },
    { id: 'dormitory', name: 'Dortoir',     icon: '🛏', floor: 0, col: 0, level: 1, maxWorkers: 0, workers: [], production: {},            consumption: { food: 0.5, water: 0.3 }, special: 'rest' },
    { id: 'lounge',    name: 'Salon',       icon: '🛋', floor: 1, col: 0, level: 1, maxWorkers: 0, workers: [], production: {},            consumption: {}, special: 'mood' },
    { id: 'water',     name: 'Filtration',  icon: '💧', floor: 1, col: 1, level: 1, maxWorkers: 2, workers: [], production: { water: 3 },  consumption: { energy: 1 } },
    { id: 'generator', name: 'Générateur',  icon: '⚡', floor: 2, col: 0, level: 1, maxWorkers: 2, workers: [], production: { energy: 5 }, consumption: { mats: 0.3 } },
    { id: 'server',    name: 'Serveurs',    icon: '💻', floor: 2, col: 1, level: 1, maxWorkers: 1, workers: [], production: { mats: 1 },   consumption: { energy: 2 } },
    { id: 'workshop',  name: 'Atelier',     icon: '🔩', floor: 3, col: 0, level: 1, maxWorkers: 2, workers: [], production: { mats: 2 },   consumption: { energy: 0.5 } },
    { id: 'farm',      name: 'Ferme',       icon: '🌿', floor: 3, col: 1, level: 1, maxWorkers: 2, workers: [], production: { food: 4 },   consumption: { water: 1, energy: 0.5 } },
  ],

  survivors: [
    { id: 's1', name: 'ARIA',   icon: '👩', hp: 100, maxHp: 100, strength: 7, intelligence: 9, agility: 6, room: null, mood: 80 },
    { id: 's2', name: 'MARCUS', icon: '👨', hp: 100, maxHp: 100, strength: 9, intelligence: 5, agility: 7, room: null, mood: 75 },
    { id: 's3', name: 'ZEN',    icon: '🧑', hp: 80,  maxHp: 100, strength: 6, intelligence: 7, agility: 9, room: null, mood: 60 },
  ],

  exploration: {
    zones: [
      { id: 'z1', name: 'Centre Commercial', icon: '🏪', risk: 'MOYEN',  duration: 15, rewards: { food: [20,60], mats: [10,30] }, active: false, progress: 0, survivor: null },
      { id: 'z2', name: 'Hôpital',           icon: '🏥', risk: 'ÉLEVÉ',  duration: 25, rewards: { mats: [15,40] },               active: false, progress: 0, survivor: null },
      { id: 'z3', name: 'Station Service',   icon: '⛽', risk: 'FAIBLE', duration: 10, rewards: { energy: [30,80] },             active: false, progress: 0, survivor: null },
      { id: 'z4', name: 'Ferme Irradiée',    icon: '🌾', risk: 'ÉLEVÉ',  duration: 30, rewards: { food: [40,100] },             active: false, progress: 0, survivor: null },
    ]
  },

  logs: [],
  eventCooldown: 0,
  pendingEvent: null,
}