import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { useAppStore } from './store';
import Home from './pages/Home';
import Services from './pages/Services';
import Mall from './pages/Mall';
import Social from './pages/Social';
import Profile from './pages/Profile';
import PetDetail from './pages/PetDetail';
import AddPet from './pages/AddPet';
import ServiceBooking from './pages/ServiceBooking';
import FosterDetail from './pages/FosterDetail';
import ProductDetail from './pages/ProductDetail';
import Insurance from './pages/Insurance';
import Membership from './pages/Membership';
import AdminDashboard from './pages/AdminDashboard';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadUser, isLoading, isAuthenticated } = useAppStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const hideNav = ['/admin', '/login', '/register'].some(path => location.pathname.startsWith(path));

  if (isLoading && !['/login', '/register'].includes(location.pathname)) {
    return (
      <div className="app-container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/services" element={
            <ProtectedRoute><Services /></ProtectedRoute>
          } />
          <Route path="/services/book/:providerId" element={
            <ProtectedRoute><ServiceBooking /></ProtectedRoute>
          } />
          <Route path="/services/foster/:orderId" element={
            <ProtectedRoute><FosterDetail /></ProtectedRoute>
          } />
          <Route path="/mall" element={
            <ProtectedRoute><Mall /></ProtectedRoute>
          } />
          <Route path="/mall/product/:id" element={
            <ProtectedRoute><ProductDetail /></ProtectedRoute>
          } />
          <Route path="/social" element={
            <ProtectedRoute><Social /></ProtectedRoute>
          } />
          <Route path="/social/event/:id" element={
            <ProtectedRoute><EventDetail /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/profile/pet/:id" element={
            <ProtectedRoute><PetDetail /></ProtectedRoute>
          } />
          <Route path="/profile/pet/add" element={
            <ProtectedRoute><AddPet /></ProtectedRoute>
          } />
          <Route path="/insurance" element={
            <ProtectedRoute><Insurance /></ProtectedRoute>
          } />
          <Route path="/membership" element={
            <ProtectedRoute><Membership /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
      {!hideNav && isAuthenticated && <BottomNav />}
    </div>
  );
}

export default App;
