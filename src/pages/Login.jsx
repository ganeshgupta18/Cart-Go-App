import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useContext(AuthContext);
  const { showAlert } = useModal();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        localStorage.setItem('triggerAppReviewOnLogin', 'true');
        navigate('/');
      } else {
        showAlert('Login Error', data.message || 'Failed to login', () => {
          if (data.isVerified === false) {
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '5px' }}>
          <button 
            type="button" 
            onClick={() => setShowForgot(true)} 
            style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: 0 }}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="btn">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>

      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
};

export default Login;
