import React, { useRef } from 'react'
import Button from './UI/Button.jsx'
import { useTerrainStore } from '../store/useTerrainStore.js'

export default function Toolbar() {
  const {
    boardSize, setBoardSize, clearAll, exportJSON, importJSON, exportPNG
  } = useTerrainStore()

  const fileRef = useRef()

  const onLoadJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result)
        importJSON(obj)
      } catch (e) {
        alert('JSON parse hatası.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="border-b border-neutral-800 px-3 py-2 flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button onClick={() => clearAll()}>New</Button>
        <Button onClick={() => exportJSON()}>Export JSON</Button>
        <Button onClick={() => fileRef.current?.click()}>Import JSON</Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onLoadJSON}
        />
        <Button onClick={() => exportPNG()}>Export PNG</Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm opacity-80">Board</label>
        <select
          className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm"
          value={boardSize}
          onChange={(e) => setBoardSize(Number(e.target.value))}
        >
          <option value={36}>36" × 36"</option>
          <option value={48}>48" × 48"</option>
        </select>
      </div>
    </div>
  )
}
