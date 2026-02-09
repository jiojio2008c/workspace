import React, { useRef, useEffect, useState } from "react"

const WIDTH = 400
const HEIGHT = 400
const CELL = 20

function randPos() {
  const x = Math.floor(Math.random() * (WIDTH / CELL))
  const y = Math.floor(Math.random() * (HEIGHT / CELL))
  return { x, y }
}

export default function SnakeGame() {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    let snake = [{ x: 5, y: 5 }]
    let dir = { x: 1, y: 0 }
    let apple = randPos()
    let running = true

    function draw() {
      // 背景网格
      ctx.fillStyle = "rgba(0, 10, 20, 0.8)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      // 绘制网格
      ctx.strokeStyle = "rgba(0, 255, 136, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i <= WIDTH; i += CELL) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, HEIGHT)
        ctx.stroke()
      }
      for (let i = 0; i <= HEIGHT; i += CELL) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(WIDTH, i)
        ctx.stroke()
      }

      // 绘制苹果 (紫色荧光)
      ctx.fillStyle = "#ff00c8"
      ctx.shadowColor = "#ff00c8"
      ctx.shadowBlur = 10
      const apx = apple.x * CELL
      const apy = apple.y * CELL
      ctx.fillRect(apx + 3, apy + 3, CELL - 6, CELL - 6)

      // 绘制贪食蛇 (绿色荧光)
      ctx.fillStyle = "#00ff88"
      ctx.shadowColor = "#00ff88"
      ctx.shadowBlur = 8
      snake.forEach((s, idx) => {
        const sx = s.x * CELL
        const sy = s.y * CELL
        if (idx === 0) {
          // 头部更亮
          ctx.fillStyle = "#00ffff"
          ctx.shadowColor = "#00ffff"
        } else {
          ctx.fillStyle = "#00ff88"
          ctx.shadowColor = "#00ff88"
        }
        ctx.fillRect(sx + 2, sy + 2, CELL - 4, CELL - 4)
      })
      ctx.shadowColor = "transparent"
    }

    function step() {
      if (!running) return
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

      // 撞墙
      if (
        head.x < 0 ||
        head.x >= WIDTH / CELL ||
        head.y < 0 ||
        head.y >= HEIGHT / CELL
      ) {
        running = false
        setGameOver(true)
        return
      }

      // 自碰撞
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        running = false
        setGameOver(true)
        return
      }

      snake.unshift(head)

      // 吃到苹果
      if (head.x === apple.x && head.y === apple.y) {
        apple = randPos()
        setScore((s) => s + 1)
      } else {
        snake.pop()
      }

      draw()
    }

    const id = setInterval(step, 120)

    function handleKey(e) {
      const k = e.key
      if (k === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 }
      if (k === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 }
      if (k === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 }
      if (k === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 }
    }

    window.addEventListener("keydown", handleKey)
    draw()

    return () => {
      clearInterval(id)
      window.removeEventListener("keydown", handleKey)
    }
  }, [])

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={WIDTH} 
        height={HEIGHT}
        style={{
          border: "3px solid #00ff88",
          boxShadow: "0 0 20px #00ff88, inset 0 0 10px rgba(0, 255, 136, 0.2)",
          display: "block",
          margin: "0 auto",
          background: "#000"
        }}
      />
      <div className="score">
        ⚡ SCORE: [{score.toString().padStart(3, "0")}]
      </div>
      {gameOver && (
        <div style={{
          color: "#ff1744",
          textAlign: "center",
          marginTop: "8px",
          fontSize: "14px",
          textShadow: "0 0 10px #ff1744",
          fontWeight: "bold"
        }}>
          ❌ GAME OVER - 刷新页面重新开始
        </div>
      )}
      <div className="hint">▲ ▼ ◄ ► 方向键控制</div>
    </div>
  )
}
