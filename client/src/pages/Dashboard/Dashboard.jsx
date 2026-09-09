import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart'
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
import PageLoader from '../../components/ui/PageLoader'
import './Dashboard.css'

const TREND_7D = [
  { day: 'Mon', value: 14 },
  { day: 'Tue', value: 19 },
  { day: 'Wed', value: 12 },
  { day: 'Thu', value: 21 },
  { day: 'Fri', value: 25 },
  { day: 'Sat', value: 17 },
  { day: 'Sun', value: 23 },
]

const TREND_1M = [
  { day: 'Week 1', value: 78 },
  { day: 'Week 2', value: 92 },
  { day: 'Week 3', value: 65 },
  { day: 'Week 4', value: 101 },
]

const TREND_12M = [
  { day: 'Jan', value: 145 },
  { day: 'Feb', value: 132 },
  { day: 'Mar', value: 158 },
  { day: 'Apr', value: 170 },
  { day: 'May', value: 162 },
  { day: 'Jun', value: 178 },
  { day: 'Jul', value: 190 },
  { day: 'Aug', value: 185 },
  { day: 'Sep', value: 205 },
  { day: 'Oct', value: 198 },
  { day: 'Nov', value: 219 },
  { day: 'Dec', value: 231 },
]

const TREND_RANGES = {
  '7d': TREND_7D,
  '1m': TREND_1M,
  '12m': TREND_12M,
}

const TREND_RANGE_OPTIONS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '1m', label: 'Last 1 month' },
  { key: '12m', label: 'Last 12 months' },
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
  {
    id: 'TCK-1044',
    tag: 'Info',
    partner: 'Andes Trail Co.',
    subject: 'Group discount request for 15-person trekking tour',
    meta: '4h ago · Open',
    action: 'View Ticket',
  },
]

const DISTRIBUTION = [
  { label: 'Open', value: 32, tone: 'blue' },
  { label: 'In Progress', value: 21, tone: 'amber' },
  { label: 'Resolved', value: 40, tone: 'green' },
  { label: 'Closed', value: 7, tone: 'purple' },
]
const DISTRIBUTION_TOTAL = 128
const DISTRIBUTION_COLOR = {
  blue: 'var(--accent)',
  amber: 'var(--amber)',
  green: 'var(--green)',
  purple: 'var(--purple)',
}

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
  { name: 'Priya Sharma', role: 'Support Agent', resolved: 29, satisfaction: 94 },
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
  {
    icon: CheckCircle2,
    tone: 'green',
    title: 'Invoice corrected',
    detail: 'Golden Gate Holidays (TCK-1038)',
    time: '5h ago',
  },
  {
    icon: Clock,
    tone: 'blue',
    title: 'Refund approved',
    detail: 'Nusantara Escapes (TCK-1041)',
    time: '6h ago',
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

function TrendChart({ data }) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 8, left: -8, bottom: 0 }}
        barCategoryGap="32%"
        accessibilityLayer={false}
      >
        <CartesianGrid vertical={false} stroke="var(--border-soft)" />
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--text-3)', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 'dataMax']}
          tick={{ fill: 'var(--text-3)', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: 'var(--text-2)' }}
          cursor={{ fill: 'var(--border-soft)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.day} fill={d.value === maxValue ? 'var(--purple)' : 'var(--accent)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function TrendRangeMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const current = TREND_RANGE_OPTIONS.find((o) => o.key === value) ?? TREND_RANGE_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="dash-trend-menu" ref={menuRef}>
      <button
        type="button"
        className="dash-header-static dash-trend-menu-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        {current.label}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="dash-trend-menu-list">
          {TREND_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`dash-trend-menu-item${opt.key === value ? ' dash-trend-menu-item-active' : ''}`}
              onClick={() => {
                onChange(opt.key)
                setOpen(false)
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
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
  const [isLoading, setIsLoading] = useState(true)
  const [trendRange, setTrendRange] = useState('7d')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 120)
    return () => clearTimeout(timer)
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = (user?.userID || user?.username || '').split(/[\s._-]/)[0] || 'there'

  if (isLoading) return <PageLoader />

  return (
    <div className="page">
      <div className="card dash-hero">
        <div className="dash-hero-text">
          <h2>
            {greeting}, {firstName} <span className="dash-hero-wave">👋</span>
          </h2>
          <p>Here's what's happening with partner support today.</p>
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

        <div className="card dash-card dash-card-accent-blue dash-cell-activity dash-card-center">
          <SectionHeader
            icon={TrendingUp}
            tone="blue"
            title="Ticket Activity"
            right={<TrendRangeMenu value={trendRange} onChange={setTrendRange} />}
          />
          <div className="dash-card-fill">
            <TrendChart data={TREND_RANGES[trendRange]} />
          </div>
        </div>

        <div className="card dash-card dash-card-accent-purple dash-cell-distribution dash-card-center">
          <SectionHeader icon={PieChart} tone="purple" title="Ticket Distribution" />
          <div className="dash-card-fill">
            <div className="dash-mini-donut-wrap">
              <div className="dash-mini-donut">
                <div className="dash-mini-donut-chart">
                  <MuiPieChart
                    series={[
                      {
                        data: DISTRIBUTION.map((s) => ({
                          id: s.label,
                          value: s.value,
                          label: s.label,
                          color: DISTRIBUTION_COLOR[s.tone],
                        })),
                        innerRadius: 34,
                        outerRadius: 80,
                        paddingAngle: 3,
                        cornerRadius: 4,
                        valueFormatter: (item) => `${item.value}%`,
                      },
                    ]}
                    width={168}
                    height={168}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    hideLegend
                  />
                </div>
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
                    <span className="dash-mini-legend-pct">{s.value}%</span>
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
                  <div className="dash-team-avatar-wrap">
                    <div className={`dash-team-avatar tk-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>
                    <span className="dash-team-rank">{i + 1}</span>
                  </div>
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
