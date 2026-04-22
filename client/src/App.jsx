import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('login')

  return (
    <>
      {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}
      {activePage === 'signup' && <SignupPage setActivePage={setActivePage} />}
      {activePage === 'dashboard' && (
        <DashboardPage setActivePage={setActivePage} />
      )}
      {activePage === 'history' && (
        <HistoryPage setActivePage={setActivePage} />
      )}
    </>
  )
}

export default App