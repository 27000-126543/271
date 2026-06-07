import { Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
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

function App() {
  const location = useLocation();
  const hideNav = ['/admin'].some(path => location.pathname.startsWith(path));

  return (
    <div className="app-container">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/book/:providerId" element={<ServiceBooking />} />
          <Route path="/services/foster/:orderId" element={<FosterDetail />} />
          <Route path="/mall" element={<Mall />} />
          <Route path="/mall/product/:id" element={<ProductDetail />} />
          <Route path="/social" element={<Social />} />
          <Route path="/social/event/:id" element={<EventDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/pet/:id" element={<PetDetail />} />
          <Route path="/profile/pet/add" element={<AddPet />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default App;
