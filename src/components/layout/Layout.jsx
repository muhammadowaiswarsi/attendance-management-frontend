import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  const { role } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar role={role} collapsed={collapsed} mobileOpen={mobileOpen} />

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`layout-main ${mobileOpen ? 'layout-main--shifted' : ''}`}>
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
