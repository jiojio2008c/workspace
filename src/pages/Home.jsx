import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../auth"
import SnakeGame from "../components/SnakeGame"
import TankWars from "../components/TankWars"
import GomokuGame from "../components/GomokuGame"
import { FaRobot, FaGamepad, FaSignOutAlt, FaFireAlt, FaCode, FaLightbulb, FaStar } from "react-icons/fa"

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
        <div className="header-left">
          <div className="logo-area">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <h1>🔮 CYBER BLOG 🔮</h1>
              <p className="tagline">⸻ 赛博朋克游戏博客 ⸻</p>
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> 登出
        </button>
      </header>

      <nav className="game-tabs">
        <button
          className={`tab ${selectedGame === "snake" ? "active" : ""}`}
          onClick={() => setSelectedGame("snake")}
        >
          <span className="tab-icon">🐍</span>
          <span>贪食蛇</span>
        </button>
        <button
          className={`tab ${selectedGame === "tank" ? "active" : ""}`}
          onClick={() => setSelectedGame("tank")}
        >
          <span className="tab-icon">🚀</span>
          <span>坦克大战</span>
        </button>
        <button
          className={`tab ${selectedGame === "gomoku" ? "active" : ""}`}
          onClick={() => setSelectedGame("gomoku")}
        >
          <span className="tab-icon">⚫</span>
          <span>五子棋</span>
        </button>
      </nav>

      <main className="main-grid">
        <section className="game-section">
          <div className="section-header">
            {selectedGame === "snake" && <><FaFireAlt /> 贪食蛇游戏</>}
            {selectedGame === "tank" && <><FaRobot /> 坦克大战</>}
            {selectedGame === "gomoku" && <><FaGamepad /> 五子棋挑战</>}
          </div>
          <div className="game-container">
            {selectedGame === "snake" && <SnakeGame />}
            {selectedGame === "tank" && <TankWars />}
            {selectedGame === "gomoku" && <GomokuGame />}
          </div>
        </section>

        <section className="posts-section">
          <div className="section-header">
            <FaCode /> 精选文章
          </div>
          <div className="posts-list">
            {samplePosts.map((p) => (
              <article key={p.id} className="post-card">
                <div className="post-icon">
                  {p.id === 1 && <span className="icon">✨</span>}
                  {p.id === 2 && <span className="icon">⚛️</span>}
                  {p.id === 3 && <span className="icon">🧠</span>}
                </div>
                <div className="post-content">
                  <h3><FaStar className="star-icon" /> {p.title}</h3>
                  <p>{p.body}</p>
                  <div className="post-footer">
                    <span className="post-date">2024年02月09日</span>
                    <span className="post-read">阅读 →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p><FaLightbulb /> 由 React + Vite 驱动的赛博朋克博客平台</p>
          <p className="tech-stack">⚙️ Tech Stack: React • Vite • React Router • Canvas API</p>
        </div>
      </footer>
    </div>
  )
}
