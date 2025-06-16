import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/Landing/LandingPage';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectsPage from './components/Projects/ProjectsPage';
import ProjectDetailPage from './components/Projects/ProjectDetailPage';
import CreateProjectPage from './components/Projects/CreateProjectPage';
import OutreachPage from './components/Outreach/OutreachPage';
import TemplatesPage from './components/Templates/TemplatesPage';
import CollaboratorsPage from './components/Collaborators/CollaboratorsPage';
import FestivalTrackerPage from './components/Festivals/FestivalTrackerPage';
import SettingsPage from './components/Settings/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/outreach" element={
                <ProtectedRoute>
                  <OutreachPage />
                </ProtectedRoute>
              } />
              <Route path="/templates" element={
                <ProtectedRoute>
                  <TemplatesPage />
                </ProtectedRoute>
              } />
              <Route path="/collaborators" element={
                <ProtectedRoute>
                  <CollaboratorsPage />
                </ProtectedRoute>
              } />
              <Route path="/festivals" element={
                <ProtectedRoute>
                  <FestivalTrackerPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;