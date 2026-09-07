import { BarChart3, LayoutDashboard, Ticket, Users } from 'lucide-react'

export const navItems = [
  {
    path: '/',
    end: true,
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    subtitle: 'Overview & quick actions',
  },
  {
    path: '/tickets',
    label: 'Tickets',
    icon: Ticket,
    title: 'Tickets',
    subtitle: 'Manage partner support requests',
  },
  {
    path: '/partners',
    label: 'Partners',
    icon: Users,
    title: 'Partners',
    subtitle: 'Partner accounts & details',
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: BarChart3,
    title: 'Reports',
    subtitle: 'Insights & analytics',
  },
]
