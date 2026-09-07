import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/ch_logo1.png'
import { navItems } from '../../config/navigation'
import './Sidebar.css'

export default function Sidebar({ mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }) {
  return (
    <>
      {mobileOpen && <div className="sb-overlay" onClick={onCloseMobile} />}

      <aside className={`sidebar${mobileOpen ? ' sb-open' : ''}${collapsed ? ' sb-collapsed' : ''}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <img src={logo} alt="Culture Holidays" className="sb-logo-img" />
          </div>
          <div className="sb-logo-text">
            <span className="sb-brand">Culture Holidays</span>
            <span className="sb-tagline">Partner Service Desk</span>
          </div>

          <button
            type="button"
            className={`sb-ham-toggle${collapsed ? '' : ' is-open'}`}
            onClick={onToggleCollapsed}
            title={collapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            <span className="shm-bar" />
            <span className="shm-bar" />
            <span className="shm-bar" />
          </button>
          <button type="button" className="sb-close-btn" onClick={onCloseMobile}>
            <X size={18} />
          </button>
        </div>

        <p className="sb-section-label">Main menu</p>

        <nav className="sb-nav">
          {navItems.map(({ path, end, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `sb-item${isActive ? ' sb-active' : ''}`}
              onClick={onCloseMobile}
              title={collapsed ? label : undefined}
            >
              <span className="sb-item-icon">
                <Icon size={18} />
              </span>
              <span className="sb-item-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div className="sb-user">
          <div className="sb-avatar">A</div>
          <div className="sb-user-info">
            <span className="sb-user-name">Admin</span>
            <span className="sb-user-email">admin@cultureholidays.com</span>
          </div>
        </div>
      </aside>
    </>
  )
}
