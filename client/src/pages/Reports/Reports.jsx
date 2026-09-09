import { useEffect, useState } from 'react'
import {
  Activity,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Crown,
  Headset,
  Medal,
  MessageSquare,
  PieChart,
  Smile,
  Ticket,
  Users,
  XCircle,
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import PageLoader from '../../components/ui/PageLoader'
import { avatarTone, initials } from '../../utils/avatar'
import './Reports.css'

const STATUS_BREAKDOWN = [
  { label: 'Resolved', value: 40, tone: 'green', icon: CheckCircle2 },
  { label: 'Open', value: 32, tone: 'blue', icon: Circle },
  { label: 'In Progress', value: 21, tone: 'amber', icon: Clock },
  { label: 'Closed', value: 7, tone: 'purple', icon: XCircle },
]

const TOP_PARTNERS = [
  { name: 'Sunrise Tours & Travel', tickets: 18 },
  { name: 'Golden Gate Holidays', tickets: 14 },
  { name: 'Nusantara Escapes', tickets: 11 },
  { name: 'Pacific Rim Adventures', tickets: 9 },
  { name: 'Emerald Isle Journeys', tickets: 6 },
]

const TEAM_PERFORMANCE = [
  {
    name: 'Harsit Sharma',
    role: 'Support Agent',
    resolved: 47,
    avgResponse: '1.8h',
    satisfaction: 96,
    resolutionRate: 94,
  },
  {
    name: 'Dipak Kalal',
    role: 'Operations Manager',
    resolved: 41,
    avgResponse: '1.5h',
    satisfaction: 98,
    resolutionRate: 97,
  },
  {
    name: 'Ayesha Khan',
    role: 'Sales Executive',
    resolved: 34,
    avgResponse: '2.4h',
    satisfaction: 91,
    resolutionRate: 88,
  },
].sort((a, b) => b.resolved - a.resolved)

const RECENT_ACTIVITY = [
  {
    partner: 'Sunrise Tours & Travel',
    action: 'sent a new message on',
    ticket: 'TCK-1042',
    time: '2h ago',
    icon: MessageSquare,
    tone: 'blue',
  },
  {
    partner: 'Golden Gate Holidays',
    action: 'ticket resolved —',
    ticket: 'TCK-1024',
    time: '4d ago',
    icon: CheckCircle2,
    tone: 'green',
  },
  {
    partner: 'Nusantara Escapes',
    action: 'refund approved on',
    ticket: 'TCK-1041',
    time: '5h ago',
    icon: Clock,
    tone: 'amber',
  },
  {
    partner: 'Emerald Isle Journeys',
    action: 'urgent ticket opened —',
    ticket: 'TCK-1031',
    time: '2d ago',
    icon: Ticket,
    tone: 'red',
  },
  {
    partner: 'Andes Trail Co.',
    action: 'ticket closed —',
    ticket: 'TCK-1028',
    time: '3d ago',
    icon: CheckCircle2,
    tone: 'green',
  },
]

const TOTAL_TICKETS = 128

const maxPartnerTickets = Math.max(...TOP_PARTNERS.map((p) => p.tickets))

const RANK_MEDAL = ['#fbbf24', '#cbd5e1', '#d97706']

const STATUS_DONUT_COLOR = {
  green: 'var(--green)',
  blue: 'var(--accent)',
  amber: 'var(--amber)',
  purple: 'var(--purple)',
}

const statusDonutGradient = (() => {
  let cursor = 0
  const stops = STATUS_BREAKDOWN.map((s) => {
    const start = cursor
    cursor += s.value
    return `${STATUS_DONUT_COLOR[s.tone]} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})()

function SectionHeader({ icon: Icon, tone = 'blue', title, sub }) {
  return (
    <div className="rp-card-header">
      <div className={`rp-header-icon rp-header-icon-${tone}`}>
        <Icon size={15} />
      </div>
      <div className="rp-card-header-text">
        <h3>{title}</h3>
        {sub && <span className="rp-card-sub">{sub}</span>}
      </div>
    </div>
  )
}

export default function Reports() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <PageLoader />

  return (
    <div className="page">
      <div className="stats-grid">
        <StatCard
          icon={Ticket}
          value={TOTAL_TICKETS}
          label="Total Tickets"
          hint="Last 6 months"
          tone="blue"
          trend={{ up: true, label: '+12%' }}
        />
        <StatCard icon={Clock} value="6.4h" label="Avg. Resolution" hint="Time to close" tone="amber" />
        <StatCard
          icon={Smile}
          value="94%"
          label="Satisfaction"
          hint="Partner feedback"
          tone="green"
          trend={{ up: true, label: '+3%' }}
        />
        <StatCard icon={Users} value="42" label="Active Partners" hint="This month" tone="purple" />
      </div>

      <div className="rp-row">
        <div className="card rp-card rp-card-accent-green">
          <SectionHeader icon={PieChart} tone="green" title="Tickets by status" />
          <div className="rp-donut-wrap">
            <div className="rp-donut" style={{ background: statusDonutGradient }}>
              <div className="rp-donut-hole">
                <span className="rp-donut-total">{TOTAL_TICKETS}</span>
                <span className="rp-donut-total-label">Total</span>
              </div>
            </div>
            <div className="rp-donut-legend">
              {STATUS_BREAKDOWN.map((s) => (
                <div className="rp-legend-row" key={s.label}>
                  <div className={`rp-legend-icon rp-legend-icon-${s.tone}`}>
                    <s.icon size={12} />
                  </div>
                  <span className="rp-legend-label">{s.label}</span>
                  <span className="rp-legend-pct">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card rp-card rp-card-accent-amber">
          <SectionHeader icon={Award} tone="amber" title="Top partners by volume" />
          <div className="rp-partner-list">
            {TOP_PARTNERS.map((p) => (
              <div className="rp-partner-row" key={p.name}>
                <span className="rp-partner-name">{p.name}</span>
                <div className="rp-partner-track">
                  <div
                    className="rp-partner-fill"
                    style={{ width: `${(p.tickets / maxPartnerTickets) * 100}%` }}
                  />
                </div>
                <span className="rp-partner-count">{p.tickets}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card rp-card rp-card-accent-red">
        <SectionHeader icon={Activity} tone="red" title="Recent activity" />
        <div className="rp-activity-list">
          {RECENT_ACTIVITY.map((a, i) => (
            <div className="rp-activity-row" key={i}>
              <div className={`rp-activity-avatar rp-activity-avatar-${avatarTone(a.partner)}`}>
                {initials(a.partner)}
              </div>
              <div className="rp-activity-body">
                <p>
                  <strong>{a.partner}</strong> {a.action} <span className="rp-activity-ticket">{a.ticket}</span>
                </p>
                <span className="rp-activity-time">{a.time}</span>
              </div>
              <div className={`rp-activity-icon rp-activity-icon-${a.tone}`}>
                <a.icon size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card rp-card rp-card-accent-purple">
        <SectionHeader icon={Headset} tone="purple" title="Team performance" sub="Sales · Operations · Support" />
        <div className="rp-leaderboard">
          {TEAM_PERFORMANCE.map((p, i) => (
            <div className={`rp-lb-row ${i === 0 ? 'rp-lb-row-top' : ''}`} key={p.name}>
              <div className="rp-lb-rank" style={{ color: RANK_MEDAL[i] }}>
                {i === 0 ? <Crown size={18} /> : <Medal size={18} />}
                <span>#{i + 1}</span>
              </div>

              <div className={`rp-lb-avatar tk-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>

              <div className="rp-lb-info">
                <span className="rp-lb-name">{p.name}</span>
                <span className="rp-lb-role">{p.role}</span>
              </div>

              <div className="rp-lb-stats">
                <div className="rp-lb-stat">
                  <strong>{p.resolved}</strong>
                  <span>Resolved</span>
                </div>
                <div className="rp-lb-stat">
                  <strong>{p.avgResponse}</strong>
                  <span>Avg. response</span>
                </div>
                <div className="rp-lb-stat">
                  <strong>{p.satisfaction}%</strong>
                  <span>Satisfaction</span>
                </div>
              </div>

              <div className="rp-lb-ring-wrap">
                <div
                  className="rp-lb-ring"
                  style={{
                    background: `conic-gradient(var(--green) ${p.resolutionRate}%, rgba(255,255,255,0.08) ${p.resolutionRate}% 100%)`,
                  }}
                >
                  <div className="rp-lb-ring-hole">{p.resolutionRate}%</div>
                </div>
                <span className="rp-lb-ring-label">Resolution</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
