import { Users } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'

export default function Partners() {
  return (
    <div className="page">
      <EmptyState
        icon={Users}
        title="No partners yet"
        description="Partner accounts and details will show up here once this section is built out."
      />
    </div>
  )
}
