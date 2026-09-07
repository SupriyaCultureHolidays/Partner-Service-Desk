import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Partners from './pages/Partners/Partners'
import Reports from './pages/Reports/Reports'
import Tickets from './pages/Tickets/Tickets'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App
