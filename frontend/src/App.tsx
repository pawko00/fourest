import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Focus from './pages/Focus';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
