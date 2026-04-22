import { useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

function Sidebar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setActivePage('login')
      setIsOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handlePageChange = (page) => {
    setActivePage(page)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="mobile-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Dark overlay */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-logo">
              <span>❤</span>
            </div>
            <div>
              <h2>Amuma</h2>
              <h2>Smart Bra</h2>
            </div>
          </div>

          {/* Close button inside sidebar */}
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handlePageChange('dashboard')}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          {/* <button
            className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => handlePageChange('history')}
          >
            <span className="nav-icon">🕘</span>
            <span>History</span>
          </button> */}

          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar