import './StatCard.css'

export default function StatCard({ icon: Icon, value, label, hint, tone = 'blue' }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon-wrap">
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {hint && <div className="stat-sub">{hint}</div>}
      </div>
    </div>
  )
}
