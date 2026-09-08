import { useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  MessageSquare,
  PieChart,
  Plus,
  Star,
  Ticket,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react'
import { useHealth } from '../../hooks/useHealth'
import { avatarTone, initials } from '../../utils/avatar'
import './Dashboard.css'

const TONE_COLOR = {
  blue: 'var(--accent)',
  purple: 'var(--purple)',
  green: 'var(--green)',
  amber: 'var(--amber)',
  red: 'var(--red)',
}

const TREND = [
  { day: 'Mon', value: 14 },
  { day: 'Tue', value: 19 },
  { day: 'Wed', value: 12 },
  { day: 'Thu', value: 21 },
  { day: 'Fri', value: 25 },
  { day: 'Sat', value: 17 },
  { day: 'Sun', value: 23 },
]

const METRICS = [
  {
    icon: Ticket,
    tone: 'blue',
    value: '24',
    label: 'Open Tickets',
    hint: 'Needs response',
    spark: [30, 27, 29, 25, 26, 22, 24],
  },
  {
    icon: Users,
    tone: 'purple',
    value: '42',
    label: 'Active Partners',
    hint: 'Across 18 countries',
    spark: [36, 37, 38, 39, 40, 41, 42],
  },
  {
    icon: CheckCircle2,
    tone: 'green',
    value: '96',
    label: 'Resolved',
    hint: 'This month',
    trend: { up: true, label: '+12%' },
    spark: [62, 68, 74, 80, 85, 90, 96],
  },
  {
    icon: Clock,
    tone: 'amber',
    value: '1.8h',
    label: 'Avg. Response',
    hint: 'Last 7 days',
    trend: { up: true, label: '-18%' },
    spark: [2.6, 2.5, 2.3, 2.2, 2.0, 1.9, 1.8],
  },
]

const PRIORITY_BREAKDOWN = [
  { label: 'Urgent', value: 18, tone: 'red' },
  { label: 'High', value: 27, tone: 'amber' },
  { label: 'Medium', value: 34, tone: 'blue' },
  { label: 'Low', value: 21, tone: 'gray' },
]

const PRIORITY_DONUT_COLOR = {
  red: 'var(--red)',
  amber: 'var(--amber)',
  blue: 'var(--accent)',
  gray: '#94a3b8',
}

const priorityDonutGradient = (() => {
  let cursor = 0
  const stops = PRIORITY_BREAKDOWN.map((s) => {
    const start = cursor
    cursor += s.value
    return `${PRIORITY_DONUT_COLOR[s.tone]} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})()

const NEEDS_ATTENTION = [
  {
    id: 'TCK-1042',
    partner: 'Sunrise Tours & Travel',
    subject: 'Bali itinerary changes for Roberts group',
    priority: 'Urgent',
    time: '2h ago',
  },
  {
    id: 'TCK-1031',
    partner: 'Emerald Isle Journeys',
    subject: 'Payment gateway error during checkout',
    priority: 'Urgent',
    time: '2d ago',
  },
  {
    id: 'TCK-1039',
    partner: 'Sunrise Tours & Travel',
    subject: 'Flight details missing for Thailand leg',
    priority: 'High',
    time: '7h ago',
  },
]

const PRIORITY_TONE = {
  Urgent: 'red',
  High: 'amber',
  Medium: 'blue',
  Low: 'gray',
}

const TOP_PARTNERS = [
  { name: 'Sunrise Tours & Travel', tier: 'Gold', rating: 4.9, bookings: 24 },
  { name: 'Nusantara Escapes', tier: 'Gold', rating: 4.8, bookings: 31 },
  { name: 'Pacific Rim Adventures', tier: 'Silver', rating: 4.6, bookings: 18 },
  { name: 'Golden Gate Holidays', tier: 'Silver', rating: 4.5, bookings: 12 },
]

const TIER_TONE = { Gold: 'amber', Silver: 'gray', Bronze: 'purple' }
const maxBookings = Math.max(...TOP_PARTNERS.map((p) => p.bookings))

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
    partner: 'Nusantara Escapes',
    action: 'refund approved on',
    ticket: 'TCK-1041',
    time: '5h ago',
    icon: Clock,
    tone: 'amber',
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
    partner: 'Emerald Isle Journeys',
    action: 'urgent ticket opened —',
    ticket: 'TCK-1031',
    time: '2d ago',
    icon: Ticket,
    tone: 'red',
  },
]

function SectionHeader({ icon: Icon, tone = 'blue', title, sub }) {
  return (
    <div className="dash-card-header">
      <div className={`dash-header-icon dash-header-icon-${tone}`}>
        <Icon size={15} />
      </div>
      <div className="dash-card-header-text">
        <h3>{title}</h3>
        {sub && <span className="dash-card-sub">{sub}</span>}
      </div>
    </div>
  )
}

function linePath(values, width, height, padY = 4) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = width / (values.length - 1)
  return values.map((v, i) => {
    const x = i * step
    const y = height - padY - ((v - min) / range) * (height - padY * 2)
    return { x, y }
  })
}

function Sparkline({ data, tone }) {
  const width = 100
  const height = 34
  const color = TONE_COLOR[tone]
  const points = linePath(data, width, height)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${d} L ${width} ${height} L 0 ${height} Z`
  const gradId = `spark-${tone}`

  return (
    <svg className="dash-metric-spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard({ icon: Icon, tone, value, label, hint, trend, spark }) {
  return (
    <div className={`dash-metric dash-metric-${tone}`}>
      <div className="dash-metric-head">
        <div className="dash-metric-icon">
          <Icon size={19} />
        </div>
        {trend && (
          <span className={`dash-metric-trend ${trend.up ? 'dash-metric-trend-up' : 'dash-metric-trend-down'}`}>
            {trend.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend.label}
          </span>
        )}
      </div>
      <div className="dash-metric-value">{value}</div>
      <div className="dash-metric-label">{label}</div>
      {hint && <div className="dash-metric-hint">{hint}</div>}
      <Sparkline data={spark} tone={tone} />
    </div>
  )
}

function TrendChart({ data }) {
  const width = 280
  const height = 208
  const padX = 8
  const points = linePath(
    data.map((d) => d.value),
    width - padX * 2,
    height,
    14,
  ).map((p, i) => ({ ...p, x: p.x + padX, ...data[i] }))

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <svg className="dash-trend-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="dashTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={width - padX}
          y1={height * f}
          y2={height * f}
          stroke="var(--border-soft)"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#dashTrendFill)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.day} cx={p.x} cy={p.y} r="3.4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useHealth()

  const weekTotal = TREND.reduce((sum, d) => sum + d.value, 0)
  const dailyAvg = Math.round(weekTotal / TREND.length)
  const today = TREND[TREND.length - 1]
  const peak = TREND.reduce((best, d) => (d.value > best.value ? d : best), TREND[0])
  const weekTrendUp = today.value >= dailyAvg

  const openTotal = PRIORITY_BREAKDOWN.reduce((sum, p) => (p.label !== 'Low' ? sum + p.value : sum), 0)

  return (
    <div className="page">
      <div className="stats-grid dash-metrics-grid">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="card dash-quickbar">
        <div className="dash-quick-actions">
          <button type="button" className="dash-quick-btn" onClick={() => navigate('/tickets')}>
            <Plus size={15} />
            New ticket
          </button>
          <button type="button" className="dash-quick-btn dash-quick-btn-ghost" onClick={() => navigate('/partners')}>
            <UserPlus size={15} />
            Add partner
          </button>
          <button type="button" className="dash-quick-btn dash-quick-btn-ghost" onClick={() => navigate('/reports')}>
            <Activity size={15} />
            View reports
          </button>
        </div>

        <div className={`dash-status-pill ${isLoading ? 'dash-status-pending' : isError ? 'dash-status-error' : 'dash-status-ok'}`}>
          {isLoading && <span className="dash-status-dot" />}
          {!isLoading && !isError && <CheckCircle2 size={14} />}
          {!isLoading && isError && <XCircle size={14} />}
          <span>
            {isLoading && 'Checking API…'}
            {!isLoading && !isError && `API connected · ${data?.status}`}
            {!isLoading && isError && 'API unreachable'}
          </span>
        </div>
      </div>

      <div className="dash-row">
        <div className="card dash-card dash-card-accent-blue">
          <SectionHeader icon={TrendingUp} tone="blue" title="Tickets this week" sub="Last 7 days" />

          <TrendChart data={TREND} />
          <div className="dash-trend-labels">
            {TREND.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>

          <div className="dash-trend-chips">
            <div className="dash-chip">
              <span className="dash-chip-value">{today.value}</span>
              <span className="dash-chip-label">Today</span>
            </div>
            <div className="dash-chip">
              <span className="dash-chip-value">{dailyAvg}</span>
              <span className="dash-chip-label">Daily avg</span>
            </div>
            <div className="dash-chip">
              <span className="dash-chip-value">{peak.value}</span>
              <span className="dash-chip-label">Peak · {peak.day}</span>
            </div>
          </div>

          <div className="dash-trend-footer">
            <div>
              <span className="dash-trend-total">{weekTotal}</span>
              <span className="dash-trend-total-label">tickets this week</span>
            </div>
            <span className={`dash-trend-change ${weekTrendUp ? 'dash-trend-change-up' : 'dash-trend-change-down'}`}>
              <TrendingUp size={12} />
              vs. weekly average
            </span>
          </div>
        </div>

        <div className="dash-col">
          <div className="card dash-card dash-card-accent-purple dash-mini-card">
            <SectionHeader icon={PieChart} tone="purple" title="Priority mix" sub="Open tickets" />
            <div className="dash-mini-donut-wrap">
              <div className="dash-mini-donut" style={{ background: priorityDonutGradient }}>
                <div className="dash-mini-donut-hole">
                  <span className="dash-mini-donut-total">{openTotal}</span>
                  <span className="dash-mini-donut-total-label">need action</span>
                </div>
              </div>
              <div className="dash-mini-legend">
                {PRIORITY_BREAKDOWN.map((p) => (
                  <div className="dash-mini-legend-row" key={p.label}>
                    <span className={`dash-mini-dot dash-mini-dot-${p.tone}`} />
                    <span className="dash-mini-legend-label">{p.label}</span>
                    <span className="dash-mini-legend-pct">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card dash-card dash-card-accent-red dash-mini-card">
            <SectionHeader icon={AlertTriangle} tone="red" title="Needs attention" sub={`${NEEDS_ATTENTION.length} tickets`} />
            <div className="dash-attention-list">
              {NEEDS_ATTENTION.map((t) => (
                <button
                  type="button"
                  className="dash-attention-row"
                  key={t.id}
                  onClick={() => navigate(`/tickets?partner=${encodeURIComponent(t.partner)}`)}
                >
                  <div className={`dash-attention-avatar tk-avatar-${avatarTone(t.partner)}`}>{initials(t.partner)}</div>
                  <div className="dash-attention-body">
                    <span className="dash-attention-subject">{t.subject}</span>
                    <span className="dash-attention-meta">
                      {t.partner} · {t.id} · {t.time}
                    </span>
                  </div>
                  <span className={`tk-badge tk-badge-${PRIORITY_TONE[t.priority]}`}>{t.priority}</span>
                </button>
              ))}
            </div>
            <button type="button" className="dash-view-all" onClick={() => navigate('/tickets')}>
              View all tickets
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="dash-row">
        <div className="card dash-card dash-card-accent-amber">
          <SectionHeader icon={Award} tone="amber" title="Top partners" sub="By rating" />
          <div className="dash-partner-list">
            {TOP_PARTNERS.map((p) => (
              <button
                type="button"
                className="dash-partner-row"
                key={p.name}
                onClick={() => navigate(`/tickets?partner=${encodeURIComponent(p.name)}`)}
              >
                <div className={`dash-partner-avatar tk-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>
                <div className="dash-partner-body">
                  <div className="dash-partner-heading">
                    <span className="dash-partner-name">{p.name}</span>
                    <span className={`pt-badge pt-badge-${TIER_TONE[p.tier]}`}>{p.tier}</span>
                  </div>
                  <div className="dash-partner-track">
                    <div className="dash-partner-fill" style={{ width: `${(p.bookings / maxBookings) * 100}%` }} />
                  </div>
                </div>
                <div className="dash-partner-stats">
                  <div className="dash-partner-rating">
                    <Star size={12} className="pt-star-filled" />
                    {p.rating.toFixed(1)}
                  </div>
                  <span className="dash-partner-bookings">{p.bookings} bookings</span>
                </div>
              </button>
            ))}
          </div>
          <button type="button" className="dash-view-all" onClick={() => navigate('/partners')}>
            View all partners
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="card dash-card dash-card-accent-purple">
          <SectionHeader icon={Activity} tone="purple" title="Recent activity" />
          <div className="dash-activity-list">
            {RECENT_ACTIVITY.map((a, i) => (
              <div className="dash-activity-row" key={i}>
                <div className={`dash-activity-avatar dash-activity-avatar-${avatarTone(a.partner)}`}>
                  {initials(a.partner)}
                </div>
                <div className="dash-activity-body">
                  <p>
                    <strong>{a.partner}</strong> {a.action} <span className="dash-activity-ticket">{a.ticket}</span>
                  </p>
                  <span className="dash-activity-time">{a.time}</span>
                </div>
                <div className={`dash-activity-icon dash-activity-icon-${a.tone}`}>
                  <a.icon size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
