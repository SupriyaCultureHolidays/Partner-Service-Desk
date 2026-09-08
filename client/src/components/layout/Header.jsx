import { LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { navItems } from '../../config/navigation'
import './Header.css'

function useCurrentPage() {
  const { pathname } = useLocation()
  return (
    navItems.find((item) => item.path === pathname) ??
    navItems.find((item) => !item.end && pathname.startsWith(item.path)) ??
    navItems[0]
  )
}

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export default function Header({ theme, onLogout, onToggleTheme, onOpenMobileMenu }) {
  const page = useCurrentPage()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="topbar-menu-btn" onClick={onOpenMobileMenu}>
          <Menu size={20} />
        </button>
        <div className="topbar-breadcrumb">
          <span className="topbar-page">{page.title}</span>
          <span className="topbar-sub">{page.subtitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>
        <div className="topbar-live">
          <span className="live-dot" />
          LIVE
        </div>
        <button
          type="button"
          className="topbar-theme-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button type="button" className="topbar-logout" title="Sign out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
