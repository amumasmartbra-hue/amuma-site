import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setActivePage('dashboard') // stay logged in after refresh
      } else {
        setUser(null)
        setActivePage('login')
      }
    })

    return () => unsubscribe()
  }, [])

  // Loading screen while checking auth
  if (activePage === 'loading') {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <>
      {activePage === 'login' && (
        <LoginPage setActivePage={setActivePage} />
      )}

      {activePage === 'signup' && (
        <SignupPage setActivePage={setActivePage} />
      )}

      {activePage === 'dashboard' && user && (
        <DashboardPage setActivePage={setActivePage} />
      )}

      {activePage === 'history' && user && (
        <HistoryPage setActivePage={setActivePage} />
      )}
    </>
  )
}

export default App