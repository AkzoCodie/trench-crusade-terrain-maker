export function drawGrid(ctx, size, cell) {
  ctx.save()
  ctx.strokeStyle = '#3a3a3a'
  ctx.lineWidth = 1
  for (let i = 0; i <= size; i++) {
    // dikey
    ctx.beginPath()
    ctx.moveTo(i * cell + 0.5, 0.5)           // 0.5 ile keskin grid
    ctx.lineTo(i * cell + 0.5, size * cell + 0.5)
    ctx.stroke()
    // yatay
    ctx.beginPath()
    ctx.moveTo(0.5, i * cell + 0.5)
    ctx.lineTo(size * cell + 0.5, i * cell + 0.5)
    ctx.stroke()
  }
  ctx.restore()
}

export function drawTile(ctx, tile, cell) {
  const { x, y, size, color, connectors } = tile
  const px = x * cell
  const py = y * cell
  const w = size * cell
  const h = size * cell

  // gövde
  ctx.save()
  ctx.fillStyle = color || '#777'
  ctx.fillRect(px, py, w, h)

  // çerçeve
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 2
  ctx.strokeRect(px + 1, py + 1, w - 2, h - 2)

  // trench giriş çentikleri (kenar ortası)
  ctx.strokeStyle = '#2b1a16'
  ctx.lineWidth = 4
  const midX = px + w / 2
  const midY = py + h / 2
  const notch = Math.max(6, cell * 0.6) // çentik uzunluğu

  if (connectors?.top) {
    ctx.beginPath()
    ctx.moveTo(midX, py)
    ctx.lineTo(midX, py + notch)
    ctx.stroke()
  }
  if (connectors?.bottom) {
    ctx.beginPath()
    ctx.moveTo(midX, py + h)
    ctx.lineTo(midX, py + h - notch)
    ctx.stroke()
  }
  if (connectors?.left) {
    ctx.beginPath()
    ctx.moveTo(px, midY)
    ctx.lineTo(px + notch, midY)
    ctx.stroke()
  }
  if (connectors?.right) {
    ctx.beginPath()
    ctx.moveTo(px + w, midY)
    ctx.lineTo(px + w - notch, midY)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawSelection(ctx, tile, cell) {
  const { x, y, size } = tile
  const px = x * cell
  const py = y * cell
  const w = size * cell
  const h = size * cell

  ctx.save()
  ctx.strokeStyle = '#ffffff'
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 2
  ctx.strokeRect(px + 2, py + 2, w - 4, h - 4)
  ctx.restore()
}

export function drawGhost(ctx, gx, gy, cell, boardSize) {
  if (gx === null || gy === null) return
  const size = 3
  let x = gx - 1
  let y = gy - 1
  if (x < 0) x = 0
  if (y < 0) y = 0
  if (x + size > boardSize) x = boardSize - size
  if (y + size > boardSize) y = boardSize - size

  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fillRect(x * cell, y * cell, size * cell, size * cell)
  ctx.restore()
}
