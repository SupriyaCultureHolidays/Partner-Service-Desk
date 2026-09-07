import { BarChart3, CheckCircle2, Ticket, Users, XCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { useHealth } from '../../hooks/useHealth'
import './Dashboard.css'

export default function Dashboard() {
  const { data, isLoading, isError } = useHealth()

  return (
    <div className="page">
      <div className="stats-grid">
        <StatCard icon={Ticket} value="0" label="Open Tickets" hint="Awaiting response" tone="blue" />
        <StatCard icon={Users} value="0" label="Partners" hint="Active accounts" tone="green" />
        <StatCard icon={BarChart3} value="0" label="Resolved" hint="This month" tone="amber" />
      </div>

      <div className="card dashboard-status">
        <div className="dashboard-status-icon">
          {isLoading && <span className="dashboard-status-dot" />}
          {!isLoading && !isError && <CheckCircle2 size={18} color="var(--green)" />}
          {!isLoading && isError && <XCircle size={18} color="var(--red)" />}
        </div>
        <div>
          <p className="dashboard-status-title">API connection</p>
          <p className="dashboard-status-text">
            {isLoading && 'Checking connection to the server…'}
            {!isLoading && !isError && `Connected — status: ${data?.status}`}
            {!isLoading && isError && 'Could not reach the server. Is it running?'}
          </p>
        </div>
      </div>
    </div>
  )
}
