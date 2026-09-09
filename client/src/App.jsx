import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Partners from './pages/Partners/Partners'
import Reports from './pages/Reports/Reports'
import Tickets from './pages/Tickets/Tickets'

const API = import.meta.env.VITE_API_URL

// Module-level callbacks — set by the App component, called by the interceptor.
// Keeping this outside React means Strict Mode cannot eject the interceptor.
let _onUnauthorized = null
let _onTokenRefreshed = null
let _sessionExpired = false
let _refreshPromise = null

// Live API auth relies on an httpOnly refresh-token cookie forwarded through our backend.
axios.defaults.withCredentials = true

// Auth endpoints handle their own 401s locally (bad password / bad OTP) —
// they must never trigger the global "session expired" logout flow.
const AUTH_PATHS = ['/auth/login', '/auth/verify-otp', '/auth/refresh']
const isAuthEndpoint = (url = '') => AUTH_PATHS.some(path => url.includes(path))

// Reads the `exp` claim straight off the JWT — same "decode, don't verify" stance as the
// server middleware, since we don't hold the Live API's signing secret either.
const getTokenExpiryMs = (token) => {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return exp ? exp * 1000 : null
  } catch {
    return null
  }
}

const refreshAccessToken = () => {
  if (!_refreshPromise) {
    _refreshPromise = axios.post(`${API}/auth/refresh`, {})
      .then(({ data }) => {
        const newToken = data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token
        if (!newToken) throw new Error('No access token in refresh response.')
        localStorage.setItem('psd_token', newToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        _onTokenRefreshed?.(newToken)
        return newToken
      })
      .finally(() => { _refreshPromise = null })
  }
  return _refreshPromise
}

axios.interceptors.response.use(
  res => res,
  async err => {
    const { config, response } = err

    if (response?.status !== 401 || isAuthEndpoint(config?.url || '')) {
      return Promise.reject(err)
    }

    // Try one silent refresh-and-retry before giving up on the session.
    if (!config._retry) {
      config._retry = true
      try {
        const newToken = await refreshAccessToken()
        config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` }
        return axios(config)
      } catch {
        // refresh failed — fall through to session-expired handling below
      }
    }

    if (!_sessionExpired) {
      _sessionExpired = true
      _onUnauthorized?.()
    }
    return Promise.reject(err)
  }
)

function App() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('psd_token') || ''
    if (saved) axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`
    return saved
  })
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`)
      setUser(data?.data || null)
    } catch {
      setUser(null)
    }
  }

  // Load the real logged-in user's profile on first mount if a token was
  // already saved (page refresh).
  useEffect(() => {
    if (!token) return
    fetchMe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep axios Authorization header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const handleLogin = async (newToken) => {
    _sessionExpired = false
    localStorage.setItem('psd_token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    await fetchMe()
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('psd_token')
    setToken('')
    setUser(null)
    navigate('/login', { replace: true })
  }

  // Proactively catch expiry even if the user is idle and no request happens to
  // 401 — schedule a check for the exact moment the current token's `exp` hits,
  // try one silent refresh, and log out to /login if that fails too.
  useEffect(() => {
    if (!token) return

    const expiryMs = getTokenExpiryMs(token)
    if (!expiryMs) return

    const handleExpiry = async () => {
      try {
        await refreshAccessToken()
      } catch {
        if (!_sessionExpired) {
          _sessionExpired = true
          handleLogout()
        }
      }
    }

    const msUntilExpiry = expiryMs - Date.now()
    if (msUntilExpiry <= 0) {
      handleExpiry()
      return
    }

    const timer = setTimeout(handleExpiry, msUntilExpiry)
    return () => clearTimeout(timer)
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wire the module-level interceptor callbacks to this component's state
  useEffect(() => {
    _onUnauthorized = handleLogout
    _onTokenRefreshed = (newToken) => setToken(newToken)
    return () => { _onUnauthorized = null; _onTokenRefreshed = null }
  })

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
      />

      <Route element={<ProtectedRoute isAuthed={!!token} />}>
        <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
