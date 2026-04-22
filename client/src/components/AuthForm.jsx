import { useState } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { Eye, EyeOff } from "lucide-react";


function AuthForm({ type = 'login', onSwitch, setActivePage }) {
  const [showPassword, setShowPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

        if (fullName.trim()) {
          await updateProfile(userCredential.user, {
            displayName: fullName,
          })
        }

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
              <div className="auth-input-group">
                <span className="auth-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

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

            {isLogin ? (
              <div className="auth-forgot-row">
                <a href="#">Forgot password?</a>
              </div>
            ) : (
              <p className="auth-terms-text">
                By signing up, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>
              </p>
            )}

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

          {/* <div className="auth-social-row">
            <button className="auth-social-btn" type="button">
              Google
            </button>
            <button className="auth-social-btn" type="button">
              Apple
            </button>
          </div> */}

          <button className="auth-switch-btn" onClick={onSwitch} type="button">
            {isLogin ? 'Create an account' : 'Back to login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthForm