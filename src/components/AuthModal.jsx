import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import ForgotPasswordModal from './ForgotPasswordModal';

const AuthModal = () => {
  const { user, login } = useContext(AuthContext);
  const { showAlert } = useModal();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    // Show modal if user is not logged in and hasn't closed it in this session
    const isClosed = sessionStorage.getItem('authPopupClosed') === 'true';
    if (!user && !isClosed) {
      // Delay slightly for smooth transition on initial load
      const delay = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(delay);
    }
  }, [user]);

  const handleClose = () => {
    sessionStorage.setItem('authPopupClosed', 'true');
    setIsOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        setIsOpen(false);
      } else {
        setErrorMsg(data.message || 'Login failed');
        if (data.isVerified === false) {
          setIsOpen(false);
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Registration Successful', data.message || 'Please check your email for the verification OTP.', () => {
          setIsOpen(false);
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        });
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper" style={{ maxWidth: '420px' }}>
        <button className="modal-close-btn" onClick={handleClose}>×</button>
        
        <div className="auth-modal-tabs">
          <button 
            className={`auth-modal-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            Login
          </button>
          <button 
            className={`auth-modal-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            Register
          </button>
        </div>

        <div className="auth-modal-body">
          {errorMsg && (
            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', textAlign: 'center', marginBottom: '5px' }}>Welcome Back!</h2>
              <p style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>Sign in to access your orders, cart, and profile.</p>
              
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              
              <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '5px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)} 
                  style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', textAlign: 'center', marginBottom: '5px' }}>Create Account</h2>
              <p style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>Join CartGo today and get 30% off your first order!</p>
              
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="Password (min 6 characters)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
};

export default AuthModal;
