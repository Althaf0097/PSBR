/**
 * Main App Component
 * 
 * This is the root component of the application. It sets up:
 * - React Router for navigation
 * - Authentication context provider
 * - Route definitions with protection
 * 
 * Component Structure:
 * - AuthProvider: Wraps entire app to provide authentication context
 * - Router: Enables client-side routing
 * - AppRoutes: Defines all application routes
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import './App.css';

/**
 * App Routes Component
 * 
 * Defines all routes in the application with appropriate protection:
 * - Public routes: /login, /register (redirect to /todos if already logged in)
 * - Protected route: /todos (requires authentication)
 * - Default route: / (redirects to /todos)
 */
const AppRoutes = () => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login route - redirect to todos if already authenticated */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Login />}
      />
      
      {/* Register route - redirect to todos if already authenticated */}
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Register />}
      />
      
      {/* Todos route - protected, requires authentication */}
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
      
      {/* Default route - redirect to todos */}
      <Route path="/" element={<Navigate to="/todos" replace />} />
    </Routes>
  );
};

/**
 * Main App Component
 * 
 * Wraps the entire application with:
 * - AuthProvider: Provides authentication context to all components
 * - Router: Enables client-side routing
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
