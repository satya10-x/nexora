import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HealthProvider } from './hooks/useHealth.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import Tickets from './pages/Tickets.jsx'
import TicketDetails from './pages/TicketDetails.jsx'
import TestRuns from './pages/TestRuns.jsx'
import Repairs from './pages/Repairs.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import './sentinel.css'

export default function SentinelApp() {
  useEffect(() => {
    document.title = 'SentinelQA — Autonomous Quality by Nexora'
    document.documentElement.classList.add('bg-ink')
  }, [])

  return (
    <div className="sentinel-app font-display">
      <HealthProvider>
        <AuthProvider>
          <Routes>
            <Route path="/sentinel/*" element={<Navigate to="/" replace />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:ticketId" element={<TicketDetails />} />
                <Route path="/runs" element={<TestRuns />} />
                <Route path="/repairs" element={<Repairs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HealthProvider>
    </div>
  )
}
