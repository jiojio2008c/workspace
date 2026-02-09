import React, { useRef, useEffect, useState } from "react"

const WIDTH = 400
const HEIGHT = 400
const TANK_SIZE = 20
const BULLET_SIZE = 4

export default function TankWars() {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    let playerTank = { x: WIDTH / 2 - TANK_SIZE / 2, y: HEIGHT - 40, angle: 0 }
    let bullets = []
    let enemies = [
      { x: 50, y: 50, angle: Math.random() * Math.PI * 2 },
      { x: WIDTH - 50, y: 50, angle: Math.random() * Math.PI * 2 },
      { x: WIDTH / 2, y: 30, angle: Math.random() * Math.PI * 2 }
    ]
    let enemyBullets = []
    let running = true
    let gameScore = 0

    const keys = {}

    function drawTank(tank, color) {
      ctx.save()
      ctx.translate(tank.x + TANK_SIZE / 2, tank.y + TANK_SIZE / 2)
      ctx.rotate(tank.angle)

      // 坦克身体
      ctx.fillStyle = color
      ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE)

      // 炮塔
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(TANK_SIZE / 2, 0)
      ctx.stroke()

      ctx.restore()
    }

    function drawBullet(bullet, color) {
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowColor = "transparent"
    }

    function draw() {
      // 背景
      ctx.fillStyle = "rgba(0, 10, 20, 0.8)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      // 网格
      ctx.strokeStyle = "rgba(0, 255, 136, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i <= WIDTH; i += TANK_SIZE * 2) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, HEIGHT)
        ctx.stroke()
      }

      // 绘制玩家坦克
      drawTank(playerTank, "#00ffff")

      // 绘制敌方坦克
      enemies.forEach((tank) => drawTank(tank, "#ff00c8"))

      // 绘制子弹
      bullets.forEach((b) => drawBullet(b, "#00ff88"))
      enemyBullets.forEach((b) => drawBullet(b, "#ff1744"))
    }

    function updatePlayerTank() {
      if (keys["ArrowLeft"]) playerTank.angle -= 0.1
      if (keys["ArrowRight"]) playerTank.angle += 0.1
      if (keys["ArrowUp"]) {
        playerTank.x += Math.cos(playerTank.angle) * 3
        playerTank.y += Math.sin(playerTank.angle) * 3
      }
      if (keys["ArrowDown"]) {
        playerTank.x -= Math.cos(playerTank.angle) * 3
        playerTank.y -= Math.sin(playerTank.angle) * 3
      }

      // 边界检查
      playerTank.x = Math.max(0, Math.min(WIDTH - TANK_SIZE, playerTank.x))
      playerTank.y = Math.max(0, Math.min(HEIGHT - TANK_SIZE, playerTank.y))
    }

    function updateBullets() {
      bullets = bullets.filter((b) => {
        b.x += Math.cos(b.angle) * 5
        b.y += Math.sin(b.angle) * 5
        return b.x > 0 && b.x < WIDTH && b.y > 0 && b.y < HEIGHT
      })

      enemyBullets = enemyBullets.filter((b) => {
        b.x += Math.cos(b.angle) * 4
        b.y += Math.sin(b.angle) * 4
        return b.x > 0 && b.x < WIDTH && b.y > 0 && b.y < HEIGHT
      })
    }

    function checkCollisions() {
      // 检查玩家子弹与敌方坦克碰撞
      bullets = bullets.filter((bullet) => {
        for (let i = 0; i < enemies.length; i++) {
          const e = enemies[i]
          const dx = bullet.x - (e.x + TANK_SIZE / 2)
          const dy = bullet.y - (e.y + TANK_SIZE / 2)
          if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE) {
            enemies.splice(i, 1)
            gameScore++
            setScore(gameScore)
            return false
          }
        }
        return true
      })

      // 检查敌方子弹与玩家碰撞
      for (let bullet of enemyBullets) {
        const dx = bullet.x - (playerTank.x + TANK_SIZE / 2)
        const dy = bullet.y - (playerTank.y + TANK_SIZE / 2)
        if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE) {
          running = false
          setGameOver(true)
          return
        }
      }
    }

    function updateEnemies() {
      enemies.forEach((tank) => {
        // 随机移动
        tank.x += Math.cos(tank.angle) * 1.5
        tank.y += Math.sin(tank.angle) * 1.5

        if (tank.x < 0 || tank.x > WIDTH - TANK_SIZE || tank.y < 0 || tank.y > HEIGHT - TANK_SIZE) {
          tank.angle += Math.PI
        }

        // 随机射击
        if (Math.random() < 0.02) {
          enemyBullets.push({
            x: tank.x + TANK_SIZE / 2,
            y: tank.y + TANK_SIZE / 2,
            angle: tank.angle
          })
        }
      })

      // 如果敌人全部被消灭，生成新的
      if (enemies.length === 0) {
        enemies = [
          { x: 50, y: 50, angle: Math.random() * Math.PI * 2 },
          { x: WIDTH - 50, y: 50, angle: Math.random() * Math.PI * 2 },
          { x: WIDTH / 2, y: 30, angle: Math.random() * Math.PI * 2 }
        ]
      }
    }

    function step() {
      if (!running) return

      updatePlayerTank()
      updateBullets()
      updateEnemies()
      checkCollisions()
      draw()
    }

    const id = setInterval(step, 50)

    function handleKeyDown(e) {
      keys[e.key] = true
      if (e.key === " ") {
        e.preventDefault()
        bullets.push({
          x: playerTank.x + TANK_SIZE / 2,
          y: playerTank.y + TANK_SIZE / 2,
          angle: playerTank.angle
        })
      }
    }

    function handleKeyUp(e) {
      keys[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    draw()

    return () => {
      clearInterval(id)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "3px solid #ff00c8",
          boxShadow: "0 0 20px #ff00c8, inset 0 0 10px rgba(255, 0, 200, 0.2)",
          display: "block",
          margin: "0 auto",
          background: "#000"
        }}
      />
      <div className="score">
        💥 DESTROYED: [{score.toString().padStart(3, "0")}]
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
          ❌ MISSION FAILED - 刷新页面重新开始
        </div>
      )}
      <div className="hint">
        ◄ ► 转向 | ▲ ▼ 移动 | 空格 射击
      </div>
    </div>
  )
}
