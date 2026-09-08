import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Smile,
  Ticket,
  UserRound,
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import ChatDrawer from '../../components/ui/ChatDrawer'
import { avatarTone, initials } from '../../utils/avatar'
import './Tickets.css'

const AGENTS = ['Priya Sharma', 'Rahul Verma', 'Ayesha Khan']

const TICKETS = [
  {
    id: 'TCK-1042',
    assignee: 'Priya Sharma',
    subject: 'Bali itinerary changes for Roberts group',
    partner: 'Sunrise Tours & Travel',
    priority: 'Urgent',
    status: 'Open',
    updated: '2h ago',
    messages: [
      {
        sender: 'Sunrise Tours & Travel',
        date: 'Sep 6',
        time: '10:12 AM',
        side: 'in',
        text: 'Hi team, the Roberts group wants to drop the ATV add-on and add a spa afternoon instead. Can we adjust the itinerary?',
      },
      {
        sender: 'You',
        date: 'Sep 6',
        time: '11:40 AM',
        side: 'out',
        text: 'Sure — I will remove the ATV slot and check spa availability for that afternoon. Will confirm pricing shortly.',
      },
      {
        sender: 'Sunrise Tours & Travel',
        date: 'Sep 6',
        time: '2:05 PM',
        side: 'in',
        text: 'Thank you! Please also confirm if the transport cost changes.',
      },
    ],
  },
  {
    id: 'TCK-1041',
    assignee: 'Rahul Verma',
    subject: 'Refund request for cancelled ATV activity',
    partner: 'Nusantara Escapes',
    priority: 'Medium',
    status: 'In Progress',
    updated: '5h ago',
    messages: [
      {
        sender: 'Nusantara Escapes',
        date: 'Sep 5',
        time: '4:30 PM',
        side: 'in',
        text: 'Diana is not doing the ATV ride, can we refund that portion and just charge for transport?',
      },
      {
        sender: 'You',
        date: 'Sep 5',
        time: '5:02 PM',
        side: 'out',
        text: 'Noted — I will apply a reduced rate of $40 covering transport only and update the invoice.',
      },
    ],
  },
  {
    id: 'TCK-1039',
    assignee: 'Priya Sharma',
    subject: 'Flight details missing for Thailand leg',
    partner: 'Sunrise Tours & Travel',
    priority: 'High',
    status: 'Open',
    updated: '7h ago',
    messages: [
      {
        sender: 'Sunrise Tours & Travel',
        date: 'Sep 5',
        time: '9:15 AM',
        side: 'in',
        text: 'We are missing the return flight details for the Thailand leg — could you resend?',
      },
      {
        sender: 'You',
        date: 'Sep 5',
        time: '9:50 AM',
        side: 'out',
        text: 'Apologies, sending the updated flight itinerary now.',
      },
    ],
  },
  {
    id: 'TCK-1038',
    assignee: 'Ayesha Khan',
    subject: 'Invoice discrepancy on September booking',
    partner: 'Golden Gate Holidays',
    priority: 'Low',
    status: 'Resolved',
    updated: '1d ago',
    messages: [
      {
        sender: 'Golden Gate Holidays',
        date: 'Sep 4',
        time: '1:00 PM',
        side: 'in',
        text: 'The September invoice shows an extra night that was not booked.',
      },
      {
        sender: 'You',
        date: 'Sep 4',
        time: '3:20 PM',
        side: 'out',
        text: 'You are right, that was a duplicate line — invoice has been corrected and resent.',
      },
      {
        sender: 'Golden Gate Holidays',
        date: 'Sep 4',
        time: '3:45 PM',
        side: 'in',
        text: 'Confirmed, all good now. Thank you!',
      },
    ],
  },
  {
    id: 'TCK-1035',
    assignee: 'Unassigned',
    subject: 'Hotel upgrade confirmation for anniversary trip',
    partner: 'Pacific Rim Adventures',
    priority: 'Medium',
    status: 'In Progress',
    updated: '1d ago',
    messages: [
      {
        sender: 'Pacific Rim Adventures',
        date: 'Sep 3',
        time: '11:05 AM',
        side: 'in',
        text: 'Can we confirm the suite upgrade for the anniversary couple arriving next week?',
      },
      {
        sender: 'You',
        date: 'Sep 3',
        time: '1:30 PM',
        side: 'out',
        text: 'Upgrade is confirmed with the hotel, sending the updated voucher shortly.',
      },
    ],
  },
  {
    id: 'TCK-1031',
    assignee: 'Rahul Verma',
    subject: 'Payment gateway error during checkout',
    partner: 'Emerald Isle Journeys',
    priority: 'Urgent',
    status: 'Open',
    updated: '2d ago',
    messages: [
      {
        sender: 'Emerald Isle Journeys',
        date: 'Sep 2',
        time: '8:40 AM',
        side: 'in',
        text: 'Our client got a payment error twice during checkout for the Ireland tour.',
      },
      {
        sender: 'You',
        date: 'Sep 2',
        time: '9:10 AM',
        side: 'out',
        text: 'We are looking into the gateway issue now and will share a fix or an alternate payment link.',
      },
    ],
  },
  {
    id: 'TCK-1028',
    assignee: 'Ayesha Khan',
    subject: 'Custom itinerary request for 12-day Peru tour',
    partner: 'Andes Trail Co.',
    priority: 'Low',
    status: 'Closed',
    updated: '3d ago',
    messages: [
      {
        sender: 'Andes Trail Co.',
        date: 'Aug 31',
        time: '10:00 AM',
        side: 'in',
        text: 'Requesting a custom 12-day Peru itinerary including Rainbow Mountain.',
      },
      {
        sender: 'You',
        date: 'Aug 31',
        time: '4:15 PM',
        side: 'out',
        text: 'Draft itinerary sent, let us know if the pacing works for the group.',
      },
      {
        sender: 'Andes Trail Co.',
        date: 'Sep 1',
        time: '9:30 AM',
        side: 'in',
        text: 'Looks great, we are good to proceed. Closing this out.',
      },
    ],
  },
  {
    id: 'TCK-1024',
    assignee: 'Priya Sharma',
    subject: 'Duplicate booking created for same client',
    partner: 'Golden Gate Holidays',
    priority: 'High',
    status: 'Resolved',
    updated: '4d ago',
    messages: [
      {
        sender: 'Golden Gate Holidays',
        date: 'Aug 30',
        time: '2:20 PM',
        side: 'in',
        text: 'It looks like the same client got two confirmation numbers for one booking.',
      },
      {
        sender: 'You',
        date: 'Aug 30',
        time: '3:00 PM',
        side: 'out',
        text: 'Found it — cancelled the duplicate and kept the original confirmation active.',
      },
    ],
  },
]

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed']

const STATUS_TONE = {
  Open: 'blue',
  'In Progress': 'amber',
  Resolved: 'green',
  Closed: 'purple',
}

const PRIORITY_TONE = {
  Urgent: 'red',
  High: 'amber',
  Medium: 'blue',
  Low: 'gray',
}

function StatusBadge({ status }) {
  return <span className={`tk-badge tk-badge-${STATUS_TONE[status]}`}>{status}</span>
}

function PriorityBadge({ priority }) {
  return <span className={`tk-badge tk-badge-${PRIORITY_TONE[priority]}`}>{priority}</span>
}

export default function Tickets() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [openTicketId, setOpenTicketId] = useState(null)
  const [extraMessages, setExtraMessages] = useState({})
  const [assignees, setAssignees] = useState({})
  const [draft, setDraft] = useState('')

  const getAssignee = (t) => assignees[t.id] ?? t.assignee

  const handleAssign = (ticketId, agent) => {
    setAssignees((prev) => ({ ...prev, [ticketId]: agent }))
  }

  const filtered = TICKETS.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      t.subject.toLowerCase().includes(q) ||
      t.partner.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    return matchesStatus && matchesQuery
  })

  const openTicket = useMemo(() => TICKETS.find((t) => t.id === openTicketId) ?? null, [openTicketId])

  const thread = useMemo(
    () => (openTicket ? [...openTicket.messages, ...(extraMessages[openTicket.id] ?? [])] : []),
    [openTicket, extraMessages],
  )

  const openCount = TICKETS.filter((t) => t.status === 'Open').length
  const inProgressCount = TICKETS.filter((t) => t.status === 'In Progress').length
  const resolvedCount = TICKETS.filter((t) => t.status === 'Resolved').length
  const urgentCount = TICKETS.filter((t) => t.priority === 'Urgent').length

  const handleOpenTicket = (id) => {
    setOpenTicketId(id)
    setDraft('')
  }

  const handleCloseTicket = () => {
    setOpenTicketId(null)
    setDraft('')
  }

  const handleSendReply = () => {
    const text = draft.trim()
    if (!text || !openTicket) return
    setExtraMessages((prev) => ({
      ...prev,
      [openTicket.id]: [
        ...(prev[openTicket.id] ?? []),
        { sender: 'You', date: 'Today', time: 'Just now', side: 'out', text },
      ],
    }))
    setDraft('')
  }

  return (
    <div className="page">
      <div className="stats-grid">
        <StatCard icon={Ticket} value={openCount} label="Open Tickets" hint="Awaiting response" tone="blue" />
        <StatCard icon={Clock} value={inProgressCount} label="In Progress" hint="Being worked on" tone="amber" />
        <StatCard icon={CheckCircle2} value={resolvedCount} label="Resolved" hint="This month" tone="green" />
        <StatCard icon={AlertTriangle} value={urgentCount} label="Urgent" hint="Needs attention" tone="red" />
      </div>

      <div className="card tk-toolbar">
        <div className="tk-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tickets, partners…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="tk-filters">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              className={`tk-filter-pill ${statusFilter === s ? 'tk-filter-active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="tk-grid">
        {filtered.map((t) => {
          const lastMessage = t.messages[t.messages.length - 1]
          const needsAttention = t.status === 'Open' || t.priority === 'Urgent'
          const assignee = getAssignee(t)
          return (
            <button
              type="button"
              className={`card tk-card tk-card-${PRIORITY_TONE[t.priority]}`}
              key={t.id}
              onClick={() => handleOpenTicket(t.id)}
            >
              <div className="tk-card-top">
                <div className={`tk-avatar tk-avatar-${avatarTone(t.partner)}`}>
                  {initials(t.partner)}
                  {needsAttention && <span className="tk-avatar-dot" />}
                </div>
                <div className="tk-card-heading">
                  <span className="tk-partner-name">{t.partner}</span>
                  <span className="tk-id">{t.id}</span>
                </div>
                <div className="tk-card-right">
                  <span className="tk-card-time">{t.updated}</span>
                  {assignee === 'Unassigned' ? (
                    <div className="tk-assignee-mini tk-assignee-mini-empty" title="Unassigned">
                      <UserRound size={11} />
                    </div>
                  ) : (
                    <div
                      className={`tk-assignee-mini tk-avatar-${avatarTone(assignee)}`}
                      title={`Assigned to ${assignee}`}
                    >
                      {initials(assignee)}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="tk-card-subject">{t.subject}</h3>
              <p className="tk-card-preview">
                {lastMessage.side === 'out' && <span className="tk-preview-you">You: </span>}
                {lastMessage.text}
              </p>
              <div className="tk-card-footer">
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} />
                <div className="tk-card-footer-right">
                  <span className="tk-card-meta">
                    <MessageSquare size={13} />
                    {t.messages.length}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && <div className="card tk-empty">No tickets match your search.</div>}
      </div>

      {openTicket && (
        <ChatDrawer
          onClose={handleCloseTicket}
          avatarText={initials(openTicket.partner)}
          avatarTone={avatarTone(openTicket.partner)}
          title={openTicket.partner}
          subtitle={`${openTicket.id} · ${openTicket.subject}`}
          badges={
            <>
              <StatusBadge status={openTicket.status} />
              <PriorityBadge priority={openTicket.priority} />
              <div className="tk-assign">
                <span className="tk-assign-label">Assigned to</span>
                <select
                  className="tk-assign-select"
                  value={getAssignee(openTicket)}
                  onChange={(e) => handleAssign(openTicket.id, e.target.value)}
                >
                  <option value="Unassigned">Unassigned</option>
                  {AGENTS.map((agent) => (
                    <option key={agent} value={agent}>
                      {agent}
                    </option>
                  ))}
                </select>
              </div>
            </>
          }
          footer={
            <>
              <button type="button" className="chat-icon-btn" title="Attach file">
                <Paperclip size={17} />
              </button>
              <button type="button" className="chat-icon-btn" title="Emoji">
                <Smile size={17} />
              </button>
              <input
                type="text"
                className="chat-input"
                placeholder="Message the agent…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              />
              <button
                type="button"
                className="chat-send-btn"
                onClick={handleSendReply}
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </>
          }
        >
          {thread.map((m, i) => {
            const showDateSep = i === 0 || thread[i - 1].date !== m.date
            return (
              <div key={i}>
                {showDateSep && <div className="chat-date-sep">{m.date}</div>}
                <div className={`chat-msg chat-msg-${m.side}`}>
                  {m.side === 'in' && (
                    <div className={`chat-msg-avatar tk-avatar-${avatarTone(m.sender)}`}>{initials(m.sender)}</div>
                  )}
                  <div className="chat-msg-col">
                    {m.side === 'in' && <span className="chat-msg-sender">{m.sender}</span>}
                    <div className="chat-bubble">{m.text}</div>
                    <span className="chat-msg-time">{m.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </ChatDrawer>
      )}
    </div>
  )
}
