import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './ChatDrawer.css'

export default function ChatDrawer({ onClose, avatarText, avatarTone = 'blue', title, subtitle, badges, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="chat-drawer-header">
          <div className={`chat-avatar chat-avatar-${avatarTone}`}>{avatarText}</div>
          <div className="chat-drawer-heading">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="chat-drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {badges && <div className="chat-drawer-badges">{badges}</div>}
        <div className="chat-drawer-body">{children}</div>
        {footer && <div className="chat-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
