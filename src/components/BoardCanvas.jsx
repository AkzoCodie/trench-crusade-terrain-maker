import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useTerrainStore } from '../store/useTerrainStore'
import { drawGrid, drawTile, drawSelection, drawGhost } from '../utils/drawHelpers'

const CELL = Number(getComputedStyle(document.documentElement).getPropertyValue('--cell-px')) || 20

export default function BoardCanvas() {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const {
    boardSize, tiles, selectedTileId,
    addTileCentered, removeTileAt, selectTileAt, setCanvasRef
  } = useTerrainStore()

  const [hover, setHover] = useState({ gx: null, gy: null })

  // Canvas boyutlarını ayarla + ref’i store’a ver
  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width  = boardSize * CELL
    canvas.height = boardSize * CELL
    setCanvasRef(canvas)
  }, [boardSize, setCanvasRef])

  // Çizim
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid(ctx, boardSize, CELL)
    tiles.forEach(t => {
      drawTile(ctx, t, CELL)
      if (selectedTileId === t.id) drawSelection(ctx, t, CELL)
    })
    drawGhost(ctx, hover.gx, hover.gy, CELL, boardSize)
  }, [tiles, boardSize, hover, selectedTileId])

  useEffect(() => {
    redraw()
  }, [redraw])

  // Piksel → grid koordinatı
  const toGrid = (evt) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.floor((evt.clientX - rect.left) / CELL)
    const y = Math.floor((evt.clientY - rect.top) / CELL)
    return { gx: x, gy: y }
  }

  const onMouseMove = (e) => {
    const g = toGrid(e)
    setHover(g)
  }

  const onMouseLeave = () => setHover({ gx: null, gy: null })

  // Sol tık: boşsa yerleştir, doluysa seç
  const onClick = (e) => {
    const { gx, gy } = toGrid(e)
    // Önce seçme dene
    selectTileAt(gx, gy)
    // Seçilmediyse (boşsa) ekle
    const state = useTerrainStore.getState()
    const wasSelected = state.selectedTileId
    // küçük gecikme yerine direkt kontrol: seçilen tile var mı?
    const found = state.tiles.find(t => gx >= t.x && gx <= t.x + t.size - 1 && gy >= t.y && gy <= t.y + t.size - 1)
    if (!found) addTileCentered(gx, gy)
  }

  // Sağ tık: sil
  const onContextMenu = (e) => {
    e.preventDefault()
    const { gx, gy } = toGrid(e)
    removeTileAt(gx, gy)
  }

  return (
    <div ref={wrapperRef} className="w-full h-full overflow-auto border border-neutral-800 bg-neutral-950 rounded-lg">
      <canvas
        ref={canvasRef}
        className="block"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onContextMenu={onContextMenu}
        // Tab odakları için:
        role="img"
        aria-label={`${boardSize} by ${boardSize} inch board`}
      />
    </div>
  )
}
