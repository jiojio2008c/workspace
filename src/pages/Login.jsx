import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../auth"
import { FaLock, FaEnvelope, FaRocket, FaEye, FaEyeSlash } from "react-icons/fa"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [scanlines, setScanlines] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
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
      <div className="login-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <form className="card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <div className="logo-icon-large">⚡</div>
          <div className="logo-title">
            CYBER BLOG
          </div>
          <div className="logo-subtitle">
            <FaRocket /> 赛博朋克博客系统
          </div>
        </div>

        <h2>系统登录</h2>

        <div className="form-group">
          <label>
            <FaEnvelope className="input-icon" />
            <span>邮箱地址</span>
          </label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="test1@gmail.com"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>
            <FaLock className="input-icon" />
            <span>密码</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="input-field"
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="submit-btn">
          <FaRocket /> 进入系统
        </button>

        <div className="login-footer">
          <div className="divider"></div>
          <p className="demo-info">
            <span>🔑 演示账号</span>
          </p>
          <div className="demo-credentials">
            <code>test1@gmail.com</code>
            <code>123456</code>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  )
}
