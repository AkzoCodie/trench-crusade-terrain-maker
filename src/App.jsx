import React, { useEffect } from 'react'
import Toolbar from './components/Toolbar.jsx'
import Palette from './components/Palette.jsx'
import BoardCanvas from './components/BoardCanvas.jsx'
import TileInspector from './components/TileInspector.jsx'
import { useTerrainStore } from './store/useTerrainStore.js'

export default function App() {
  const { hydrateFromLocal, persistToLocal, boardSize, tiles } = useTerrainStore()

  // İlk açılışta LocalStorage yükle
  useEffect(() => {
    hydrateFromLocal()
  }, [hydrateFromLocal])

  // Otomatik kaydetme
  useEffect(() => {
    persistToLocal()
  }, [boardSize, tiles, persistToLocal])

  return (
    <div className="h-full flex flex-col">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        <div className="w-64 border-r border-neutral-800 p-3 overflow-auto">
          <Palette />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <BoardCanvas />
        </div>
        <div className="w-72 border-l border-neutral-800 p-3 overflow-auto">
          <TileInspector />
        </div>
      </div>
    </div>
  )
}
