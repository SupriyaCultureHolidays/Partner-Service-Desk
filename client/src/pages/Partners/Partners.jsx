import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Calendar, Mail, MapPin, Phone, Search, Star, Ticket, Users } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { avatarTone, initials } from '../../utils/avatar'
import './Partners.css'

const PARTNERS = [
  {
    name: 'Sunrise Tours & Travel',
    region: 'Bangkok, Thailand',
    tier: 'Gold',
    email: 'contact@sunrisetours.com',
    phone: '+66 2 105 4821',
    since: 2018,
    rating: 4.9,
    tags: ['Beach', 'Adventure'],
    bookings: 24,
    openTickets: 3,
  },
  {
    name: 'Golden Gate Holidays',
    region: 'San Francisco, USA',
    tier: 'Silver',
    email: 'partners@goldengateholidays.com',
    phone: '+1 415 552 0143',
    since: 2021,
    rating: 4.5,
    tags: ['City Breaks', 'Luxury'],
    bookings: 12,
    openTickets: 1,
  },
  {
    name: 'Nusantara Escapes',
    region: 'Jakarta, Indonesia',
    tier: 'Gold',
    email: 'hello@nusantaraescapes.com',
    phone: '+62 21 2988 4470',
    since: 2016,
    rating: 4.8,
    tags: ['Culture', 'Island Hopping'],
    bookings: 31,
    openTickets: 0,
  },
  {
    name: 'Emerald Isle Journeys',
    region: 'Dublin, Ireland',
    tier: 'Bronze',
    email: 'info@emeraldislejourneys.com',
    phone: '+353 1 664 2290',
    since: 2023,
    rating: 4.2,
    tags: ['Countryside', 'Heritage'],
    bookings: 6,
    openTickets: 2,
  },
  {
    name: 'Pacific Rim Adventures',
    region: 'Sydney, Australia',
    tier: 'Silver',
    email: 'team@pacificrimadventures.com',
    phone: '+61 2 8039 6612',
    since: 2020,
    rating: 4.6,
    tags: ['Adventure', 'Wildlife'],
    bookings: 18,
    openTickets: 1,
  },
  {
    name: 'Andes Trail Co.',
    region: 'Lima, Peru',
    tier: 'Bronze',
    email: 'contact@andestrail.co',
    phone: '+51 1 445 7723',
    since: 2022,
    rating: 4.4,
    tags: ['Trekking', 'Culture'],
    bookings: 9,
    openTickets: 0,
  },
]

const TIER_FILTERS = ['All', 'Gold', 'Silver', 'Bronze']

const TIER_TONE = {
  Gold: 'amber',
  Silver: 'gray',
  Bronze: 'purple',
}

function TierBadge({ tier }) {
  return <span className={`pt-badge pt-badge-${TIER_TONE[tier]}`}>{tier}</span>
}

function RatingStars({ value }) {
  return (
    <div className="pt-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < Math.round(value) ? 'pt-star-filled' : 'pt-star-empty'} />
      ))}
      <span className="pt-rating-value">{value.toFixed(1)}</span>
    </div>
  )
}

export default function Partners() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('All')

  const filtered = PARTNERS.filter((p) => {
    const matchesTier = tierFilter === 'All' || p.tier === tierFilter
    const matchesQuery = p.name.toLowerCase().includes(query.trim().toLowerCase())
    return matchesTier && matchesQuery
  })

  const goldCount = PARTNERS.filter((p) => p.tier === 'Gold').length
  const totalOpenTickets = PARTNERS.reduce((sum, p) => sum + p.openTickets, 0)
  const avgRating = (PARTNERS.reduce((sum, p) => sum + p.rating, 0) / PARTNERS.length).toFixed(1)

  return (
    <div className="page">
      <div className="stats-grid">
        <StatCard icon={Users} value={PARTNERS.length} label="Total Partners" hint="Across all regions" tone="blue" />
        <StatCard icon={Award} value={goldCount} label="Gold Tier" hint="Top performing" tone="amber" />
        <StatCard icon={Ticket} value={totalOpenTickets} label="Open Tickets" hint="Across all partners" tone="red" />
        <StatCard icon={Star} value={avgRating} label="Avg. Rating" hint="Partner satisfaction" tone="green" />
      </div>

      <div className="card pt-toolbar">
        <div className="pt-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search partners…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="pt-filters">
          {TIER_FILTERS.map((t) => (
            <button
              key={t}
              type="button"
              className={`pt-filter-pill ${tierFilter === t ? 'pt-filter-active' : ''}`}
              onClick={() => setTierFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-grid">
        {filtered.map((p) => (
          <button
            type="button"
            className="card pt-card"
            key={p.name}
            onClick={() => navigate(`/tickets?partner=${encodeURIComponent(p.name)}`)}
          >
            <div className="pt-card-top">
              <div className={`pt-avatar pt-avatar-${avatarTone(p.name)}`}>{initials(p.name)}</div>
              <div className="pt-card-heading">
                <h3 className="pt-name">{p.name}</h3>
                <RatingStars value={p.rating} />
              </div>
              <TierBadge tier={p.tier} />
            </div>

            <div className="pt-tags">
              {p.tags.map((tag) => (
                <span className="pt-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-meta-grid">
              <div className="pt-meta">
                <MapPin size={13} />
                <span>{p.region}</span>
              </div>
              <div className="pt-meta">
                <Phone size={13} />
                <span>{p.phone}</span>
              </div>
              <div className="pt-meta">
                <Mail size={13} />
                <span>{p.email}</span>
              </div>
              <div className="pt-meta">
                <Calendar size={13} />
                <span>Partner since {p.since}</span>
              </div>
            </div>

            <div className="pt-stats-row">
              <div className="pt-stat">
                <span className="pt-stat-num">{p.bookings}</span>
                <span className="pt-stat-label">Bookings</span>
              </div>
              <div className="pt-stat">
                <span className="pt-stat-num">{p.openTickets}</span>
                <span className="pt-stat-label">Open tickets</span>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="card pt-empty">No partners match your search.</div>}
      </div>
    </div>
  )
}
