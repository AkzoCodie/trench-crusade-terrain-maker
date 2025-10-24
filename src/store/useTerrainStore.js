import { create } from 'zustand'
import { TILE_TYPES } from '../utils/tileTypes'

const LS_KEY = 'tctm_state_v1'

export const useTerrainStore = create((set, get) => ({
  boardSize: 48,                 // 36 veya 48 (inch)
  gridUnit: 1,                   // 1"
  tiles: [],                     // yerleştirilen modüller
  selectedTileId: null,
  selectedType: 'trench-straight',
  canvasRef: null,               // PNG export için

  setBoardSize: (size) => set({ boardSize: size }),
  setSelectedType: (type) => set({ selectedType: type }),
  setCanvasRef: (ref) => set({ canvasRef: ref }),

  clearAll: () => set({ tiles: [], selectedTileId: null }),

  addTileCentered: (gx, gy) => {
    const size = 3
    const half = Math.floor(size / 2) // 1
    const { boardSize, tiles, selectedType } = get()
    let x = gx - half
    let y = gy - half

    // Sınırda taşmayı engelle
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (x + size > boardSize) x = boardSize - size
    if (y + size > boardSize) y = boardSize - size

    // Çakışma kontrolü: Bu 3x3 içine başka bir tile var mı?
    const collides = tiles.some(t =>
      !(x + size - 1 < t.x || t.x + t.size - 1 < x || y + size - 1 < t.y || t.y + t.size - 1 < y)
    )
    if (collides) {
      // çakışma varsa koyma yerine oradaki tile’ı seç
      const found = tiles.find(t =>
        gx >= t.x && gx <= t.x + t.size - 1 && gy >= t.y && gy <= t.y + t.size - 1
      )
      if (found) set({ selectedTileId: found.id })
      return
    }

    const def = TILE_TYPES[selectedType] || TILE_TYPES['trench-straight']
    const tile = {
      id: `t-${crypto.randomUUID?.() || Date.now()}`,
      x,
      y,
      size,
      type: selectedType,
      rotation: 0,
      connectors: { ...def.connectors },
      color: def.color
    }
    set({ tiles: [...tiles, tile], selectedTileId: tile.id })
  },

  removeTileAt: (gx, gy) => {
    const { tiles, selectedTileId } = get()
    const idx = tiles.findIndex(t =>
      gx >= t.x && gx <= t.x + t.size - 1 && gy >= t.y && gy <= t.y + t.size - 1
    )
    if (idx >= 0) {
      const removed = tiles[idx]
      const newTiles = [...tiles.slice(0, idx), ...tiles.slice(idx + 1)]
      set({
        tiles: newTiles,
        selectedTileId: removed.id === selectedTileId ? null : selectedTileId
      })
    }
  },

  selectTileAt: (gx, gy) => {
    const { tiles } = get()
    const found = tiles.find(t =>
      gx >= t.x && gx <= t.x + t.size - 1 && gy >= t.y && gy <= t.y + t.size - 1
    )
    set({ selectedTileId: found ? found.id : null })
  },

  selectTile: (id) => set({ selectedTileId: id }),

  updateTile: (id, updates) => {
    const { tiles } = get()
    set({
      tiles: tiles.map(t => (t.id === id ? { ...t, ...updates } : t))
    })
  },

  deleteSelected: () => {
    const { tiles, selectedTileId } = get()
    if (!selectedTileId) return
    set({ tiles: tiles.filter(t => t.id !== selectedTileId), selectedTileId: null })
  },

  // LocalStorage
  hydrateFromLocal: () => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data && typeof data === 'object') {
        set({
          boardSize: data.boardSize ?? 48,
          tiles: Array.isArray(data.tiles) ? data.tiles : [],
          selectedTileId: null
        })
      }
    } catch {}
  },

  persistToLocal: () => {
    const { boardSize, tiles } = get()
    const payload = { boardSize, tiles }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
  },

  // JSON export/import
  exportJSON: () => {
    const { boardSize, tiles } = get()
    const payload = { boardSize, tiles }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terrain_${boardSize}in_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importJSON: (obj) => {
    if (!obj || typeof obj !== 'object') return
    set({
      boardSize: obj.boardSize === 36 || obj.boardSize === 48 ? obj.boardSize : 48,
      tiles: Array.isArray(obj.tiles) ? obj.tiles : [],
      selectedTileId: null
    })
  },

  exportPNG: () => {
    const { canvasRef, boardSize } = get()
    if (!canvasRef) return
    const link = document.createElement('a')
    link.href = canvasRef.toDataURL('image/png')
    link.download = `terrain_${boardSize}in_${Date.now()}.png`
    link.click()
  }
}))
