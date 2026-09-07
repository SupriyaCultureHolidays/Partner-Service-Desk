import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ isAuthed }) {
  if (!isAuthed) return <Navigate to="/login" replace />
  return <Outlet />
}
