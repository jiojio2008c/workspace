import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../auth"
import SnakeGame from "../components/SnakeGame"
import TankWars from "../components/TankWars"

const samplePosts = [
  {
    id: 1,
    title: "欢迎来到赛博朋克博客",
    body: "这是一个以霓虹灯和赛博朋克风格装饰的现代博客。顶部有多个小游戏，祝你玩得愉快！"
  },
  {
    id: 2,
    title: "关于量子计算的思考",
    body: "量子计算标志着计算技术的一个新纪元。这种革命性的方法将改变我们处理数据的方式。"
  },
  {
    id: 3,
    title: "人工智能与未来",
    body: "AI 正在塑造我们的未来。从神经网络到深度学习，技术的边界不断被打破。"
  }
]

export default function Home() {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState("snake")

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>🔮 CYBER BLOG 🔮</h1>
        </div>
        <button onClick={handleLogout}>[ 登出 ]</button>
      </header>

      <div className="tabs">
        <button
          className={`tab ${selectedGame === "snake" ? "active" : ""}`}
          onClick={() => setSelectedGame("snake")}
        >
          🐍 贪食蛇
        </button>
        <button
          className={`tab ${selectedGame === "tank" ? "active" : ""}`}
          onClick={() => setSelectedGame("tank")}
        >
          🚀 坦克大战
        </button>
      </div>

      <main className="main-grid">
        <section className="game">
          <h2>▸ {selectedGame === "snake" ? "贪食蛇游戏" : "坦克大战"}</h2>
          {selectedGame === "snake" ? <SnakeGame /> : <TankWars />}
        </section>

        <section className="posts">
          <h2>▸ 文章列表</h2>
          {samplePosts.map((p) => (
            <article key={p.id} className="post">
              <h3>► {p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
