import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import ReturnPolicy from './pages/ReturnPolicy';
import AdminDashboard from './admin/AdminDashboard';
import AuthModal from './components/AuthModal';
import { ModalProvider } from './context/ModalContext';
import Support from './pages/Support';
import Receipt from './pages/Receipt';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isReceipt = location.pathname.startsWith('/receipt');

  return (
    <ModalProvider>
      {!isReceipt && <Navbar />}
      <AuthModal />
      <div className={isAdmin || isReceipt ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/support" element={<Support />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
      {!isReceipt && <Footer />}
    </ModalProvider>
  );
}

function App() {
  useEffect(() => {
    fetch('/api/analytics/visit', { method: 'POST' }).catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
