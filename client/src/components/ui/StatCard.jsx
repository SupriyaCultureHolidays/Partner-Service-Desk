import { TrendingDown, TrendingUp } from 'lucide-react'
import './StatCard.css'

export default function StatCard({ icon: Icon, value, label, hint, tone = 'blue', trend }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon-wrap">
        <Icon size={20} />
      </div>
      <div className="stat-body">
        <div className="stat-top-row">
          <div className="stat-value">{value}</div>
          {trend && (
            <span className={`stat-trend ${trend.up ? 'stat-trend-up' : 'stat-trend-down'}`}>
              {trend.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {trend.label}
            </span>
          )}
        </div>
        <div className="stat-label">{label}</div>
        {hint && <div className="stat-sub">{hint}</div>}
      </div>
    </div>
  )
}
