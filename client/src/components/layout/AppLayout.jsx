import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import './AppLayout.css'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('psd_sidebar') === 'collapsed')
  const [theme, setTheme] = useState(() => localStorage.getItem('psd_theme') || 'dark')

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light')
    localStorage.setItem('psd_theme', theme)
  }, [theme])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('psd_sidebar', next ? 'collapsed' : 'expanded')
      return next
    })
  }

  return (
    <div className="shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="main-area">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
