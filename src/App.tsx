import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import DarhonPage from './pages/DarhonPage';
import ReunioesPage from './pages/ReunioesPage';
import MeetingDetail from './components/reunioes/MeetingDetail';

const PrivateRoute: React.FC<{ children: React.ReactNode; permission?: string }> = ({ children, permission }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (permission && !user?.permissions.includes(permission)) return <Navigate to="/" />;

  return <>{children}</>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/darhon" element={<PrivateRoute permission="darhon"><DarhonPage /></PrivateRoute>} />
      <Route path="/reunioes" element={<PrivateRoute permission="reunioes"><ReunioesPage /></PrivateRoute>} />
      <Route path="/reunioes/:id" element={<PrivateRoute permission="reunioes"><MeetingDetail /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
