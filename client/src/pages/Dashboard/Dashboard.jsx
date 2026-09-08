import { useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flame,
  Lightbulb,
  MessageSquare,
  PieChart,
  ShieldCheck,
  Smile,
  Sparkles,
  Ticket,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react'
import { avatarTone, initials } from '../../utils/avatar'
import './Dashboard.css'

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
    tone: 'red',
    value: '12',
    label: 'Open Tickets',
    delta: { direction: 'up', good: false, label: '+8%' },
    context: 'vs yesterday',
  },
  {
    icon: Clock,
    tone: 'amber',
    value: '7',
    label: 'In Progress',
    delta: { direction: 'down', good: true, label: '-3%' },
    context: 'vs yesterday',
  },
  {
    icon: CheckCircle2,
    tone: 'green',
    value: '23',
    label: 'Resolved Today',
    delta: { direction: 'up', good: true, label: '+18%' },
    context: 'vs yesterday',
  },
  {
    icon: ShieldCheck,
    tone: 'purple',
    value: '94%',
    label: 'SLA Health',
    badge: 'Excellent',
  },
  {
    icon: Clock,
    tone: 'blue',
    value: '1.8h',
    label: 'Avg. Response',
    delta: { direction: 'down', good: true, label: '-24m' },
    context: 'vs yesterday',
  },
  {
    icon: Smile,
    tone: 'teal',
    value: '96%',
    label: 'CSAT',
    delta: { direction: 'up', good: true, label: '+2%' },
    context: 'vs last 7 days',
  },
]

const ATTENTION_TAG = {
  Urgent: { label: 'URGENT', tone: 'red' },
  'SLA Risk': { label: 'SLA RISK', tone: 'amber' },
  Waiting: { label: 'WAITING', tone: 'blue' },
  Info: { label: 'INFO', tone: 'purple' },
}

const ATTENTION_REQUIRED = [
  {
    id: 'TCK-1042',
    tag: 'Urgent',
    partner: 'Sunrise Tours & Travel',
    subject: 'Bali itinerary changes for Roberts group',
    meta: '2h ago · Open',
    action: 'View Ticket',
  },
  {
    id: 'TCK-1031',
    tag: 'SLA Risk',
    partner: 'Emerald Isle Journeys',
    subject: 'Payment gateway error during checkout',
    meta: '38m left · In Progress',
    action: 'Take Action',
  },
  {
    id: 'TCK-1041',
    tag: 'Waiting',
    partner: 'Nusantara Escapes',
    subject: 'Refund request for cancelled ATV activity',
    meta: '5h ago · Open',
    action: 'View Ticket',
  },
  {
    id: 'TCK-1035',
    tag: 'Info',
    partner: 'Pacific Rim Adventures',
    subject: 'Hotel upgrade confirmation for anniversary trip',
    meta: '1h ago · In Progress',
    action: 'View Ticket',
  },
  {
    id: 'TCK-1039',
    tag: 'Waiting',
    partner: 'Sunrise Tours & Travel',
    subject: 'Flight details missing for Thailand leg',
    meta: '7h ago · Open',
    action: 'View Ticket',
  },
]

const DISTRIBUTION = [
  { label: 'Open', value: 32, tone: 'blue', trend: { up: false, label: '-2%' } },
  { label: 'In Progress', value: 21, tone: 'amber', trend: { up: true, label: '+3%' } },
  { label: 'Resolved', value: 40, tone: 'green', trend: { up: true, label: '+5%' } },
  { label: 'Closed', value: 7, tone: 'purple', trend: { up: true, label: '+1%' } },
]
const DISTRIBUTION_TOTAL = 128
const DISTRIBUTION_COLOR = {
  blue: 'var(--accent)',
  amber: 'var(--amber)',
  green: 'var(--green)',
  purple: 'var(--purple)',
}
const distributionGradient = (() => {
  let cursor = 0
  const stops = DISTRIBUTION.map((s) => {
    const start = cursor
    cursor += s.value
    return `${DISTRIBUTION_COLOR[s.tone]} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})()

const TOP_PARTNERS = [
  { name: 'Sunrise Tours & Travel', tickets: 18, trend: { up: true, label: '+12%' } },
  { name: 'Golden Gate Holidays', tickets: 14, trend: { up: true, label: '+6%' } },
  { name: 'Nusantara Escapes', tickets: 11, trend: { up: true, label: '+3%' } },
  { name: 'Pacific Rim Adventures', tickets: 9, trend: { up: false, label: '-2%' } },
  { name: 'Emerald Isle Journeys', tickets: 6, trend: { up: false, label: '-5%' } },
]
const maxPartnerTickets = Math.max(...TOP_PARTNERS.map((p) => p.tickets))

const TEAM_PERFORMANCE = [
  { name: 'Harsit Sharma', role: 'Support Agent', resolved: 47, satisfaction: 96 },
  { name: 'Dipak Kalal', role: 'Operations Manager', resolved: 41, satisfaction: 98 },
  { name: 'Ayesha Khan', role: 'Sales Executive', resolved: 34, satisfaction: 91 },
]
const maxResolved = Math.max(...TEAM_PERFORMANCE.map((p) => p.resolved))

const AI_INSIGHTS = [
  {
    icon: TrendingUp,
    tone: 'green',
    text: (
      <>
        <strong>Sunrise Tours</strong> has 42% more tickets than their weekly average.
      </>
    ),
    action: 'View details',
    to: '/tickets?partner=Sunrise%20Tours%20%26%20Travel',
  },
  {
    icon: AlertTriangle,
    tone: 'amber',
    text: <>2 tickets may breach SLA today.</>,
    action: 'Take action',
    to: '/tickets',
  },
  {
    icon: TrendingUp,
    tone: 'blue',
    text: <>Payment-related issues increased 18% this week.</>,
    action: 'View report',
    to: '/reports',
  },
]

const LIVE_ACTIVITY = [
  {
    icon: CheckCircle2,
    tone: 'green',
    title: 'Ticket resolved',
    detail: 'Golden Gate Holidays (TCK-1024)',
    time: '4m ago',
  },
  {
    icon: Flame,
    tone: 'red',
    title: 'Urgent ticket opened',
    detail: 'Sunrise Tours & Travel (TCK-1042)',
    time: '12m ago',
  },
  {
    icon: MessageSquare,
    tone: 'blue',
    title: 'New message',
    detail: 'Nusantara Escapes (TCK-1041)',
    time: '18m ago',
  },
  {
    icon: AlertTriangle,
    tone: 'amber',
    title: 'SLA warning',
    detail: 'Emerald Isle Journeys (TCK-1031)',
    time: '38m ago',
  },
  {
    icon: UserCog,
    tone: 'purple',
    title: 'Partner updated',
    detail: 'Pacific Rim Adventures',
    time: '1h ago',
  },
  {
    icon: CheckCircle2,
    tone: 'green',
    title: 'Ticket closed',
    detail: 'Andes Trail Co. (TCK-1028)',
    time: '3h ago',
  },
]

function SectionHeader({ icon: Icon, tone = 'blue', title, sub, right }) {
  return (
    <div className="dash-card-header">
      <div className={`dash-header-icon dash-header-icon-${tone}`}>
        <Icon size={15} />
      </div>
      <div className="dash-card-header-text">
        <h3>{title}</h3>
        {sub && <span className="dash-card-sub">{sub}</span>}
      </div>
      {right && <div className="dash-card-header-right">{right}</div>}
    </div>
  )
}

function HeaderLink({ children, onClick }) {
  return (
    <button type="button" className="dash-header-link" onClick={onClick}>
      {children}
      <ArrowRight size={12} />
    </button>
  )
}

function linePath(values, width, height, max, padTop = 10, padBottom = 20) {
  const step = width / (values.length - 1)
  return values.map((v, i) => ({
    x: i * step,
    y: height - padBottom - (v / max) * (height - padTop - padBottom),
  }))
}

function TrendChart({ data }) {
  const width = 280
  const height = 190
  const padX = 26
  const niceMax = 30
  const ticks = [0, 10, 20, 30]

  const points = linePath(
    data.map((d) => d.value),
    width - padX,
    height,
    niceMax,
  ).map((p, i) => ({ ...p, x: p.x + padX, ...data[i] }))

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${path} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`

  return (
    <svg className="dash-trend-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="dashTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => {
        const y = height - 20 - (t / niceMax) * (height - 30)
        return (
          <g key={t}>
            <line x1={padX} x2={width} y1={y} y2={y} stroke="var(--border-soft)" strokeWidth="1" />
            <text x={0} y={y + 3} fontSize="9" fill="var(--text-3)">
              {t}
            </text>
          </g>
        )
      })}
      <path d={area} fill="url(#dashTrendFill)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.day} cx={p.x} cy={p.y} r="3.4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
      ))}
      {points.map((p) => (
        <text key={`${p.day}-label`} x={p.x} y={height - 4} fontSize="9" textAnchor="middle" fill="var(--text-3)">
          {p.day}
        </text>
      ))}
    </svg>
  )
}

function MetricCard({ icon: Icon, tone, value, label, delta, context, badge }) {
  return (
    <div className={`dash-metric dash-metric-${tone}`}>
      <div className="dash-metric-icon">
        <Icon size={19} />
      </div>
      <div className="dash-metric-value">{value}</div>
      <div className="dash-metric-label">{label}</div>
      {badge ? (
        <span className="dash-metric-badge">{badge}</span>
      ) : (
        <div className={`dash-metric-delta ${delta.good ? 'dash-delta-good' : 'dash-delta-bad'}`}>
          {delta.direction === 'up' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {delta.label}
          <span className="dash-metric-context">{context}</span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = (user?.userID || user?.username || '').split(/[\s._-]/)[0] || 'there'

  return (
    <div className="page">
      <div className="card dash-hero">
        <div className="dash-hero-text">
          <h2>
            {greeting}, {firstName} <span className="dash-hero-wave">👋</span>
          </h2>
          <p>Here's what's happening with partner support today.</p>
        </div>

        <div className="dash-hero-tip">
          <Lightbulb size={16} />
          <div>
            <strong>Keep up the great work!</strong>
            <span>Resolution rate is 12% higher than last week.</span>
          </div>
        </div>

      </div>

      <div className="stats-grid dash-metrics-grid">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="dash-bento">
        <div className="card dash-card dash-card-accent-red dash-cell-attn">
          <SectionHeader
            icon={Flame}
            tone="red"
            title="Attention Required"
            right={<HeaderLink onClick={() => navigate('/tickets')}>View all</HeaderLink>}
          />
          <div className="dash-attn-list">
            {ATTENTION_REQUIRED.map((t) => (
              <div className="dash-attn-row" key={t.id}>
                <div className="dash-attn-main">
                  <span className={`dash-attn-tag dash-attn-tag-${ATTENTION_TAG[t.tag].tone}`}>
                    {ATTENTION_TAG[t.tag].label}
                  </span>
                  <span className="dash-attn-partner">{t.partner}</span>
                  <p className="dash-attn-subject">{t.subject}</p>
                  <span className="dash-attn-meta">
                    {t.id} · {t.meta}
                  </span>
                </div>
                <button
                  type="button"
                  className={`dash-attn-action ${t.tag === 'SLA Risk' ? 'dash-attn-action-warn' : ''}`}
                  onClick={() => navigate(`/tickets?partner=${encodeURIComponent(t.partner)}`)}
                >
                  {t.action}
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card dash-card dash-card-accent-blue dash-cell-activity">
          <SectionHeader
            icon={TrendingUp}
            tone="blue"
            title="Ticket Activity"
            right={
              <span className="dash-header-static">
                Last 7 days
                <ChevronDown size={12} />
              </span>
            }
          />
          <TrendChart data={TREND} />
        </div>

        <div className="card dash-card dash-card-accent-purple dash-cell-distribution dash-card-center">
          <SectionHeader icon={PieChart} tone="purple" title="Ticket Distribution" />
          <div className="dash-card-fill">
            <div className="dash-mini-donut-wrap">
              <div className="dash-mini-donut" style={{ background: distributionGradient }}>
                <div className="dash-mini-donut-hole">
                  <span className="dash-mini-donut-total">{DISTRIBUTION_TOTAL}</span>
                  <span className="dash-mini-donut-total-label">Total</span>
                </div>
              </div>
              <div className="dash-mini-legend">
                {DISTRIBUTION.map((s) => (
                  <div className="dash-mini-legend-row" key={s.label}>
                    <span className={`dash-mini-dot dash-mini-dot-${s.tone}`} />
                    <span className="dash-mini-legend-label">{s.label}</span>
                    <div className="dash-mini-legend-stats">
                      <span className="dash-mini-legend-pct">{s.value}%</span>
                      <span className={`dash-mini-legend-trend ${s.trend.up ? 'dash-delta-good' : 'dash-delta-bad'}`}>
                        {s.trend.up ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                        {s.trend.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dash-cell-ai">
          <div className="card dash-card dash-card-accent-purple">
            <SectionHeader
              icon={Sparkles}
              tone="purple"
              title="AI Insights"
              right={<span className="dash-ai-badge">Powered by AI</span>}
            />
            <div className="dash-insight-list">
              {AI_INSIGHTS.map((insight, i) => (
                <div className="dash-insight-row" key={i}>
                  <div className={`dash-insight-icon dash-insight-icon-${insight.tone}`}>
                    <insight.icon size={14} />
                  </div>
                  <div className="dash-insight-body">
                    <p>{insight.text}</p>
                    <button type="button" className="dash-insight-link" onClick={() => navigate(insight.to)}>
                      {insight.action}
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card dash-card dash-card-accent-green">
            <SectionHeader
              icon={Activity}
              tone="green"
              title="Live Activity"
              right={
                <span className="dash-live-badge">
                  <span className="dash-live-dot" />
                  Live
                </span>
              }
            />
            <div className="dash-live-list">
              {LIVE_ACTIVITY.map((a, i) => (
                <div className="dash-live-row" key={i}>
                  <div className={`dash-live-icon dash-live-icon-${a.tone}`}>
                    <a.icon size={13} />
                  </div>
                  <div className="dash-live-body">
                    <span className="dash-live-title">{a.title}</span>
                    <span className="dash-live-detail">{a.detail}</span>
                  </div>
                  <span className="dash-live-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card dash-card dash-card-accent-amber dash-cell-partners">
          <SectionHeader
            icon={Users}
            tone="amber"
            title="Top Partners"
            right={<HeaderLink onClick={() => navigate('/partners')}>View all</HeaderLink>}
          />
          <div className="dash-partner-table-head">
            <span>Partner</span>
            <span>Tickets</span>
          </div>
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
                  <span className="dash-partner-name">{p.name}</span>
                  <div className="dash-partner-track">
                    <div className="dash-partner-fill" style={{ width: `${(p.tickets / maxPartnerTickets) * 100}%` }} />
                  </div>
                </div>
                <div className="dash-partner-stats">
                  <span className="dash-partner-count">{p.tickets}</span>
                  <span className={`dash-partner-trend ${p.trend.up ? 'dash-delta-good' : 'dash-delta-bad'}`}>
                    {p.trend.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    {p.trend.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card dash-card dash-card-accent-blue dash-cell-team dash-card-center">
          <SectionHeader
            icon={ShieldCheck}
            tone="blue"
            title="Team Performance"
            right={<HeaderLink onClick={() => navigate('/reports')}>View all</HeaderLink>}
          />
          <div className="dash-team-table-head">
            <span>Agent</span>
            <span>Resolved · CSAT</span>
          </div>
          <div className="dash-card-fill">
            <div className="dash-team-list">
              {TEAM_PERFORMANCE.map((p, i) => (
                <div className="dash-team-row" key={p.name}>
                  <div className="dash-team-rank">{i + 1}</div>
                  <div className={`dash-team-avatar tk-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>
                  <div className="dash-team-body">
                    <span className="dash-team-name">{p.name}</span>
                    <span className="dash-team-role">{p.role}</span>
                    <div className="dash-team-track">
                      <div className="dash-team-fill" style={{ width: `${(p.resolved / maxResolved) * 100}%` }} />
                    </div>
                  </div>
                  <div className="dash-team-stats">
                    <span className="dash-team-resolved">{p.resolved}</span>
                    <span className="dash-team-satisfaction">{p.satisfaction}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
