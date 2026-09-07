import { useState, useRef } from 'react'
import axios from 'axios'
import { Eye, EyeOff, LogIn, Lock, Mail, Ticket, Users, BarChart2, KeyRound, ArrowLeft } from 'lucide-react'
import logo from '../../assets/ch_logo1.png'
import './Login.css'

const API = import.meta.env.VITE_API_URL
const OTP_LENGTH = 6

const FEATURES = [
  { icon: Ticket,    text: 'Track & resolve partner support tickets' },
  { icon: Users,     text: 'Manage partner accounts in one place'    },
  { icon: BarChart2, text: 'Reports & insights across every desk'    },
]

export default function Login({ onLogin }) {
  const [step,        setStep]        = useState('credentials') // 'credentials' | 'otp'
  const [loginID,     setLoginID]     = useState('')
  const [password,    setPassword]    = useState('')
  const [otp,         setOtp]         = useState(Array(OTP_LENGTH).fill(''))
  const [staffID,     setStaffID]     = useState(null)
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [resending,   setResending]   = useState(false)
  const [resendMsg,   setResendMsg]   = useState('')
  const [error,       setError]       = useState('')
  const otpRefs = useRef([])

  const requestOtp = () => axios.post(`${API}/auth/login`, { loginID, password }, { withCredentials: true })

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await requestOtp()
      setStaffID(data?.data?.staffID ?? null)
      setOtp(Array(OTP_LENGTH).fill(''))
      setStep('otp')
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Please check your connection or try again.')
      } else {
        setError(err.response.data?.message || err.response.data?.error || 'Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return

    setOtp(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })

    if (error) setError('')

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim().slice(0, OTP_LENGTH).split('')
    if (!pasted.every(ch => /^[0-9]$/.test(ch))) return

    const next = Array(OTP_LENGTH).fill('')
    pasted.forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== OTP_LENGTH) return

    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, { staffID, otp: otpValue, loginID }, { withCredentials: true })
      const accessToken = data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token
      if (!accessToken) throw new Error('No access token returned.')
      onLogin(accessToken)
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Please check your connection or try again.')
      } else {
        setError(err.response.data?.message || err.response.data?.error || 'Invalid or expired OTP.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    setError('')
    try {
      const { data } = await requestOtp()
      setStaffID(data?.data?.staffID ?? staffID)
      setOtp(Array(OTP_LENGTH).fill(''))
      otpRefs.current[0]?.focus()
      setResendMsg('A new OTP has been sent.')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to resend OTP.')
    } finally {
      setResending(false)
    }
  }

  const handleBack = () => {
    setStep('credentials')
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    setResendMsg('')
  }

  return (
    <div className="login-shell">

      {/* ── Left: branded panel ──────────────────────────────────── */}
      <div className="login-brand">
        <div className="login-brand-inner">

          <div className="login-logo">
            <div className="login-logo-icon"><img src={logo} alt="Culture Holidays" className="login-logo-img" /></div>
            <div>
              <div className="login-logo-name">Culture Holidays</div>
              <div className="login-logo-tagline">Partner Service Desk</div>
            </div>
          </div>

          <div className="login-hero-text">
            <h1>Resolve partner issues with confidence</h1>
            <p>
              One dashboard to manage tickets, track partner accounts, and
              monitor performance — all in one place.
            </p>
          </div>

          <div className="login-features">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="login-feature-row">
                <div className="login-feature-icon"><Icon size={15} /></div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* decorative circles */}
          <div className="login-deco login-deco-1" />
          <div className="login-deco login-deco-2" />
        </div>
      </div>

      {/* ── Right: form panel ────────────────────────────────────── */}
      <div className="login-form-side">
        <div className="login-card">

          <div className="login-card-top">
            <div className="login-card-icon">{step === 'otp' ? <KeyRound size={22} /> : <Lock size={22} />}</div>
            <h2>{step === 'otp' ? 'Verify OTP' : 'Welcome back'}</h2>
            <p>{step === 'otp' ? 'Enter the one-time code sent to your account' : 'Sign in to your account to continue'}</p>
          </div>

          {error && <div className="login-error-box">{error}</div>}

          {step === 'credentials' ? (
            <form className="login-form" onSubmit={handleCredentialsSubmit} noValidate>

              <div className="login-field">
                <label htmlFor="lf-loginid">Login ID</label>
                <div className="login-input-wrap">
                  <Mail size={15} className="lf-icon" />
                  <input
                    id="lf-loginid"
                    type="text"
                    placeholder="you@cultureholidays.com"
                    value={loginID}
                    onChange={e => setLoginID(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="lf-password">Password</label>
                <div className="login-input-wrap">
                  <Lock size={15} className="lf-icon" />
                  <input
                    id="lf-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lf-eye-btn"
                    onClick={() => setShowPass(v => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading
                  ? <><span className="lf-spinner" /> Signing in…</>
                  : <><LogIn size={16} /> Sign In</>}
              </button>

            </form>
          ) : (
            <form className="login-form" onSubmit={handleOtpSubmit} noValidate>

              <div className="login-field">
                <label className="login-otp-label">One-Time Password</label>
                <div className="login-otp-row">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { otpRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="login-otp-box"
                      value={digit}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      autoComplete="off"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {resendMsg && <div className="login-resend-msg">{resendMsg}</div>}

              <button type="submit" className="login-submit-btn" disabled={loading || otp.join('').length !== OTP_LENGTH}>
                {loading
                  ? <><span className="lf-spinner" /> Verifying…</>
                  : <><LogIn size={16} /> Verify & Sign In</>}
              </button>

              <div className="login-otp-actions">
                <button type="button" className="login-text-btn" onClick={handleResend} disabled={loading || resending}>
                  {resending ? 'Resending…' : 'Resend OTP'}
                </button>
                <button type="button" className="login-back-btn" onClick={handleBack} disabled={loading || resending}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>

            </form>
          )}

          <div className="login-card-footer">
            © {new Date().getFullYear()} Culture Holidays · Partner Service Desk
          </div>
        </div>
      </div>

    </div>
  )
}
