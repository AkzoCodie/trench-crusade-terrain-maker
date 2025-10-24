import React from 'react'
import { TYPE_LIST } from '../utils/tileTypes'
import { useTerrainStore } from '../store/useTerrainStore'

export default function Palette() {
  const { selectedType, setSelectedType } = useTerrainStore()

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2 opacity-80">Palette</h3>
      <div className="flex flex-col gap-2">
        {TYPE_LIST.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedType(key)}
            className={
              'text-left px-2 py-1 rounded-md border ' +
              (selectedType === key
                ? 'bg-emerald-800/40 border-emerald-600'
                : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700')
            }
          >
            <div className="text-sm">{label}</div>
            <div className="text-[11px] opacity-60">{key}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
