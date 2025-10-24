export const TILE_TYPES = {
  'trench-straight': {
    name: 'Trench Straight',
    connectors: { top: true, bottom: true, left: false, right: false },
    color: '#7b5e57'
  },
  'trench-corner': {
    name: 'Trench Corner',
    connectors: { top: true, right: true, bottom: false, left: false },
    color: '#7b5e57'
  },
  'trench-T': {
    name: 'Trench T',
    connectors: { top: true, right: true, left: true, bottom: false },
    color: '#7b5e57'
  },
  'trench-X': {
    name: 'Trench X',
    connectors: { top: true, right: true, bottom: true, left: true },
    color: '#7b5e57'
  },
  'crater': {
    name: 'Crater',
    connectors: {},
    color: '#6b6b6b'
  },
  'bunker': {
    name: 'Bunker',
    connectors: {},
    color: '#4b4b4b'
  }
}

export const TYPE_LIST = Object.entries(TILE_TYPES).map(([key, v]) => ({
  key, label: v.name
}))
