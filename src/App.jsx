import React from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import { isAuthenticated } from "./auth"

function PrivateRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
