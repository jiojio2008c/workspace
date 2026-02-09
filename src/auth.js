const CREDENTIALS = { email: "test1@gmail.com", password: "123456" }

export function login(email, password) {
  if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
    localStorage.setItem("sb_auth", "true")
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem("sb_auth")
}

export function isAuthenticated() {
  return localStorage.getItem("sb_auth") === "true"
}
