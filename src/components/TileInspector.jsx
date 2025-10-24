import React from 'react'
import { useTerrainStore } from '../store/useTerrainStore'
import { TILE_TYPES } from '../utils/tileTypes'

export default function TileInspector() {
  const { tiles, selectedTileId, updateTile, deleteSelected } = useTerrainStore()
  const tile = tiles.find(t => t.id === selectedTileId)

  if (!tile) {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-2 opacity-80">Inspector</h3>
        <div className="text-sm opacity-70">Hiçbir tile seçili değil.</div>
      </div>
    )
  }

  const def = TILE_TYPES[tile.type]

  const toggleConn = (key) => {
    updateTile(tile.id, { connectors: { ...tile.connectors, [key]: !tile.connectors[key] } })
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 opacity-80">Inspector</h3>

      <div className="space-y-2 text-sm">
        <div><span className="opacity-70">ID:</span> {tile.id}</div>
        <div><span className="opacity-70">Type:</span> {def?.name || tile.type}</div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">Rotation:</span>
          <button
            className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700"
            onClick={() => updateTile(tile.id, { rotation: (tile.rotation + 90) % 360 })}
          >
            +90°
          </button>
          <span className="opacity-70">{tile.rotation}°</span>
        </div>

        <div className="mt-3">
          <div className="opacity-70 mb-1">Connectors</div>
          {['top','right','bottom','left'].map(c => (
            <label key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={!!tile.connectors[c]}
                onChange={() => toggleConn(c)}
              />
              <span className="capitalize">{c}</span>
            </label>
          ))}
        </div>

        <button
          className="mt-3 px-3 py-2 rounded bg-red-700 hover:bg-red-600 border border-red-600"
          onClick={deleteSelected}
        >
          Delete Tile
        </button>
      </div>
    </div>
  )
}
