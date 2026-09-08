import {
  Activity,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Crown,
  Headset,
  LineChart,
  MessageSquare,
  PieChart,
  Smile,
  Ticket,
  Users,
  XCircle,
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { avatarTone, initials } from '../../utils/avatar'
import './Reports.css'

const MONTHLY_TICKETS = [
  { month: 'Apr', value: 18 },
  { month: 'May', value: 24 },
  { month: 'Jun', value: 21 },
  { month: 'Jul', value: 29 },
  { month: 'Aug', value: 35 },
  { month: 'Sep', value: 22 },
]

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
    name: 'Priya Sharma',
    role: 'Support Agent',
    resolved: 47,
    avgResponse: '1.8h',
    satisfaction: 96,
    resolutionRate: 94,
  },
  {
    name: 'Ayesha Khan',
    role: 'Operations Manager',
    resolved: 41,
    avgResponse: '1.5h',
    satisfaction: 98,
    resolutionRate: 97,
  },
  {
    name: 'Rahul Verma',
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

const maxMonthly = Math.max(...MONTHLY_TICKETS.map((m) => m.value))
const maxPartnerTickets = Math.max(...TOP_PARTNERS.map((p) => p.tickets))
const maxResolved = Math.max(...TEAM_PERFORMANCE.map((p) => p.resolved))

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
  return (
    <div className="page">
      <div className="stats-grid">
        <StatCard
          icon={Ticket}
          value="128"
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

      <div className="card rp-card">
        <SectionHeader icon={Headset} tone="purple" title="Team performance" sub="Sales · Operations · Support" />
        <div className="rp-team-grid">
          {TEAM_PERFORMANCE.map((p, i) => (
            <div className={`rp-team-card ${i === 0 ? 'rp-team-top' : ''}`} key={p.name}>
              {i === 0 && (
                <div className="rp-team-crown">
                  <Crown size={12} />
                  Top performer
                </div>
              )}
              <div className="rp-team-top-row">
                <div className={`rp-team-avatar tk-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>
                <div className="rp-team-heading">
                  <span className="rp-team-name">{p.name}</span>
                  <span className="rp-team-role">{p.role}</span>
                </div>
              </div>
              <div className="rp-team-stats">
                <div className="rp-team-stat">
                  <span className="rp-team-stat-value">{p.resolved}</span>
                  <span className="rp-team-stat-label">Resolved</span>
                </div>
                <div className="rp-team-stat">
                  <span className="rp-team-stat-value">{p.avgResponse}</span>
                  <span className="rp-team-stat-label">Avg. response</span>
                </div>
                <div className="rp-team-stat">
                  <span className="rp-team-stat-value">{p.satisfaction}%</span>
                  <span className="rp-team-stat-label">Satisfaction</span>
                </div>
              </div>
              <div className="rp-team-progress">
                <div className="rp-team-progress-top">
                  <span>Resolution rate</span>
                  <span>{p.resolutionRate}%</span>
                </div>
                <div className="rp-team-progress-track">
                  <div className="rp-team-progress-fill" style={{ width: `${p.resolutionRate}%` }} />
                </div>
              </div>
              <div className="rp-team-bar-track" title={`${p.resolved} tickets resolved`}>
                <div className="rp-team-bar-fill" style={{ width: `${(p.resolved / maxResolved) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card rp-card">
        <SectionHeader icon={LineChart} tone="blue" title="Tickets per month" sub="Last 6 months" />
        <div className="rp-bars">
          {MONTHLY_TICKETS.map((m) => (
            <div className="rp-bar-col" key={m.month}>
              <span className="rp-bar-value">{m.value}</span>
              <div className="rp-bar-track">
                <div
                  className="rp-bar-fill"
                  style={{ height: `${(m.value / maxMonthly) * 100}%` }}
                  title={`${m.month}: ${m.value} tickets`}
                />
              </div>
              <span className="rp-bar-label">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rp-row">
        <div className="card rp-card">
          <SectionHeader icon={PieChart} tone="green" title="Tickets by status" />
          <div className="rp-status-list">
            {STATUS_BREAKDOWN.map((s) => (
              <div className="rp-status-row" key={s.label}>
                <div className="rp-status-label">
                  <s.icon size={14} className={`rp-status-icon-${s.tone}`} />
                  <span>{s.label}</span>
                </div>
                <div className="rp-status-track">
                  <div className={`rp-status-fill rp-status-fill-${s.tone}`} style={{ width: `${s.value}%` }} />
                </div>
                <span className="rp-status-pct">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card rp-card">
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

      <div className="card rp-card">
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
    </div>
  )
}
