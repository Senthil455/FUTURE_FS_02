import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      {user && <Navbar />}
      <main className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><LeadList /></PrivateRoute>} />
          <Route path="/leads/:id" element={<PrivateRoute><LeadDetail /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
