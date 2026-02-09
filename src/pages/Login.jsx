import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [scanlines, setScanlines] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setScanlines((s) => (s + 3) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (login(email, password)) {
      navigate("/")
    } else {
      setError("账号或密码不正确")
    }
  }

  return (
    <div className="page center">
      <form className="card" onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            fontSize: "24px",
            color: "#00ff88",
            textShadow: "0 0 15px #00ff88",
            letterSpacing: "3px",
            animation: "pulse 1.5s infinite"
          }}>
            ◆ CYBER BLOG ◆
          </div>
        </div>
        <h2>登录系统</h2>
        <label>
          邮箱
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test1@gmail.com" />
        </label>
        <label>
          密码
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">{"> 进入系统 >>"}</button>
        <div style={{ marginTop: "16px", fontSize: "11px", color: "#00ff88", opacity: 0.5, textAlign: "center" }}>
          默认账号: test1@gmail.com | 密码: 123456
        </div>
      </form>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
