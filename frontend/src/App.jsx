import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentRecommendations from './pages/student/StudentRecommendations';
import StudentUpload from './pages/student/StudentUpload';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyRequests from './pages/faculty/FacultyRequests';
import FacultyProfile from './pages/faculty/FacultyProfile';

// Mock dashboard components for now
const MockDashboard = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title} Dashboard</h1>
    <p>Welcome to the {title.toLowerCase()} dashboard.</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on actual role
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/recommendations" element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentRecommendations />
              </ProtectedRoute>
            } />
            <Route path="/student/upload" element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentUpload />
              </ProtectedRoute>
            } />
            
            {/* Faculty Routes */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRole="FACULTY">
                <FacultyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/faculty/requests" element={
              <ProtectedRoute allowedRole="FACULTY">
                <FacultyRequests />
              </ProtectedRoute>
            } />
            <Route path="/faculty/profile" element={
              <ProtectedRoute allowedRole="FACULTY">
                <FacultyProfile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminUsers />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
