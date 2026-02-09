import React, { useRef, useState, useEffect } from "react"

const BOARD_SIZE = 15
const CELL_SIZE = 30

export default function GomokuGame() {
  const canvasRef = useRef(null)
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(0))
  const [isBlackNext, setIsBlackNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [moveCount, setMoveCount] = useState(0)

  // 检查是否有赢家
  function checkWinner(newBoard) {
    const checkLine = (x, y, dx, dy) => {
      const player = newBoard[y * BOARD_SIZE + x]
      if (player === 0) return false
      
      let count = 1
      // 前向检查
      for (let i = 1; i < 5; i++) {
        const nx = x + dx * i
        const ny = y + dy * i
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break
        if (newBoard[ny * BOARD_SIZE + nx] === player) count++
        else break
      }
      // 后向检查
      for (let i = 1; i < 5; i++) {
        const nx = x - dx * i
        const ny = y - dy * i
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break
        if (newBoard[ny * BOARD_SIZE + nx] === player) count++
        else break
      }
      return count >= 5
    }

    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (checkLine(x, y, 1, 0) || // 水平
            checkLine(x, y, 0, 1) || // 竖直
            checkLine(x, y, 1, 1) || // 斜线
            checkLine(x, y, 1, -1)) { // 反斜线
          return newBoard[y * BOARD_SIZE + x]
        }
      }
    }
    return null
  }

  // 绘制棋盘
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    // 清空背景
    ctx.fillStyle = "rgba(10, 20, 40, 0.9)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制网格线
    ctx.strokeStyle = "rgba(0, 255, 136, 0.4)"
    ctx.lineWidth = 1
    for (let i = 0; i < BOARD_SIZE; i++) {
      // 水平线
      ctx.beginPath()
      ctx.moveTo(20, 20 + i * CELL_SIZE)
      ctx.lineTo(20 + (BOARD_SIZE - 1) * CELL_SIZE, 20 + i * CELL_SIZE)
      ctx.stroke()

      // 竖直线
      ctx.beginPath()
      ctx.moveTo(20 + i * CELL_SIZE, 20)
      ctx.lineTo(20 + i * CELL_SIZE, 20 + (BOARD_SIZE - 1) * CELL_SIZE)
      ctx.stroke()
    }

    // 绘制棋子
    for (let i = 0; i < board.length; i++) {
      const x = i % BOARD_SIZE
      const y = Math.floor(i / BOARD_SIZE)
      const px = 20 + x * CELL_SIZE
      const py = 20 + y * CELL_SIZE

      if (board[i] === 1) {
        // 黑棋
        ctx.fillStyle = "#000000"
        ctx.shadowColor = "#00ff88"
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(px, py, 12, 0, Math.PI * 2)
        ctx.fill()
      } else if (board[i] === 2) {
        // 白棋
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = "#ff00c8"
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(px, py, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(0, 255, 136, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    ctx.shadowColor = "transparent"
  }, [board])

  function handleCanvasClick(e) {
    if (winner) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 计算最近的交点
    const col = Math.round((x - 20) / CELL_SIZE)
    const row = Math.round((y - 20) / CELL_SIZE)

    if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return

    const index = row * BOARD_SIZE + col
    if (board[index] !== 0) return

    const newBoard = [...board]
    newBoard[index] = isBlackNext ? 1 : 2
    setBoard(newBoard)
    setMoveCount(moveCount + 1)

    const w = checkWinner(newBoard)
    if (w) {
      setWinner(w === 1 ? "黑棋" : "白棋")
    }

    setIsBlackNext(!isBlackNext)
  }

  function resetGame() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(0))
    setIsBlackNext(true)
    setWinner(null)
    setMoveCount(0)
  }

  return (
    <div className="gomoku-container">
      <div className="gomoku-status">
        <div className="status-text">
          {winner ? (
            <span className="winner-text">🏆 {winner} 赢了!</span>
          ) : (
            <>
              <span className={isBlackNext ? "black-turn" : ""}>●</span>
              <span>{isBlackNext ? "黑棋" : "白棋"}的回合</span>
              <span className="move-count">步数: {moveCount}</span>
            </>
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={20 + (BOARD_SIZE - 1) * CELL_SIZE + 20}
        height={20 + (BOARD_SIZE - 1) * CELL_SIZE + 20}
        onClick={handleCanvasClick}
        className="gomoku-canvas"
      />
      <button onClick={resetGame} className="reset-btn">
        ⟳ 重新开始
      </button>
    </div>
  )
}
