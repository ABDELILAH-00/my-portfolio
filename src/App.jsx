import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Portfolio Pages
import PortfolioLayout from './pages/PortfolioLayout'
import PortfolioHome from './pages/PortfolioHome'

import MinimalLoader from './components/ui/MinimalLoader'

// Admin Panel Pages (Lazy Loaded)
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'))
const AdminProjectForm = React.lazy(() => import('./pages/admin/AdminProjectForm'))
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'))
const AdminSkills = React.lazy(() => import('./pages/admin/AdminSkills'))
const AdminProfile = React.lazy(() => import('./pages/admin/AdminProfile'))

function App() {
  useEffect(() => {
    // Preload high-traffic admin pages during browser idle time.
    const preload = () => {
      import('./pages/admin/AdminDashboard');
      import('./pages/admin/AdminProjects');
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = window.setTimeout(preload, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<PortfolioLayout />}>
            <Route index element={<PortfolioHome />} />
          </Route>

          {/* Admin Auth */}
          <Route path="/be3dol/login" element={<Navigate to="/be3dol/admin" replace />} />
          <Route path="/be3dol/admin" element={
            <Suspense fallback={<MinimalLoader />}>
              <AdminLogin />
            </Suspense>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={<MinimalLoader />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectForm />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

