import { Ticket } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'

export default function Tickets() {
  return (
    <div className="page">
      <EmptyState
        icon={Ticket}
        title="No tickets yet"
        description="Partner support tickets will show up here once this section is built out."
      />
    </div>
  )
}
