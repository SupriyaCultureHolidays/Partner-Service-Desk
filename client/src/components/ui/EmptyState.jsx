import './EmptyState.css'

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="card empty-state">
      <div className="empty-icon-wrap">
        <Icon size={26} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
