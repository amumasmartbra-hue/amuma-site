import { useState } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'
import { Eye, EyeOff } from 'lucide-react'

function AuthForm({ type = 'login', onSwitch, setActivePage }) {
  const [showPassword, setShowPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [device, setDevice] = useState('device_1')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isLogin = type === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)

        setSuccess('Login successful.')
        setActivePage('dashboard')
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        const user = userCredential.user

        // Save display name
        if (fullName.trim()) {
          await updateProfile(user, {
            displayName: fullName.trim(),
          })
        }

        const db = getDatabase()

        // SAVE USER DATA
        await set(ref(db, `amuma/users/${user.uid}`), {
          uid: user.uid,
          fullName: fullName.trim(),
          email: user.email,
          assignedDevice: device,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        // LINK USER TO DEVICE
        await set(ref(db, `amuma/devices/${device}/user`), {
          uid: user.uid,
          email: user.email,
        })

        setSuccess('Account created successfully.')
        setActivePage('dashboard')
      }
    } catch (err) {
      let message = 'Something went wrong.'

      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.'
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address.'
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.'
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email.'
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password.'
      } else if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.'
      } else if (err.code === 'PERMISSION_DENIED') {
        message = 'Database permission denied.'
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">♥</div>
          <div>
            <h2>Amuma</h2>
            <h2>Smart Bra</h2>
          </div>
        </div>

        <div className="auth-form-box">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Log in to your account' : 'Sign up to get started'}</p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                {/* FULL NAME */}
                <div className="auth-input-group">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* DEVICE DROPDOWN (IMPROVED UI) */}
                <div className="auth-input-group device-select-group">
                  <span className="auth-input-icon">📟</span>

                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    required
                    className="auth-select"
                  >
                    <option value="device_1">Device 1</option>
                    <option value="device_2">Device 2</option>
                  </select>
                </div>
              </>
            )}

            {/* EMAIL */}
            <div className="auth-input-group">
              <span className="auth-input-icon">✉</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="auth-input-group">
              <span className="auth-input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="auth-message error">{error}</p>}
            {success && <p className="auth-message success">{success}</p>}

            <button className="auth-main-btn" type="submit" disabled={loading}>
              {loading
                ? isLogin
                  ? 'Logging in...'
                  : 'Signing up...'
                : isLogin
                ? 'Log In'
                : 'Sign Up'}
            </button>
          </form>

          <div className="auth-divider" />

          <p className="auth-bottom-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>

          <button className="auth-switch-btn" onClick={onSwitch} type="button">
            {isLogin ? 'Create an account' : 'Back to login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthForm