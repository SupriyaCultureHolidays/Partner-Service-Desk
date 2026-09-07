import { BarChart3 } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'

export default function Reports() {
  return (
    <div className="page">
      <EmptyState
        icon={BarChart3}
        title="No reports yet"
        description="Insights and analytics will show up here once this section is built out."
      />
    </div>
  )
}
