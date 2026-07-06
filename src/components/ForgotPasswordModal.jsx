import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { showAlert } = useModal();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setErrorMsg(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        setErrorMsg(data.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Success', 'Password reset successfully! You can now log in with your new password.', () => {
          onClose();
          // Reset states
          setStep(1);
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        });
      } else {
        setErrorMsg(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className="modal-wrapper" style={wrapperStyle} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" style={closeBtnStyle} onClick={onClose}>×</button>
        
        <div style={{ padding: '30px' }}>
          {errorMsg && (
            <div style={errorBannerStyle}>
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} style={formStyle}>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', marginBottom: '15px' }}>🔒</span>
              <h2 style={titleStyle}>Forgot Password</h2>
              <p style={descStyle}>Enter your registered email address to receive a 6-digit verification code.</p>
              
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={inputStyle}
              />
              <button type="submit" disabled={loading} className="btn" style={submitBtnStyle}>
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={formStyle}>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', marginBottom: '15px' }}>📩</span>
              <h2 style={titleStyle}>Verify Code</h2>
              <p style={descStyle}>We have sent a 6-digit OTP code to <strong style={{ color: '#fff' }}>{email}</strong>.</p>
              
              <input 
                type="text" 
                maxLength="6" 
                placeholder="Enter 6-Digit OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required 
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
              />
              
              <button type="submit" disabled={loading} className="btn" style={submitBtnStyle}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={backLinkStyle}
              >
                ← Back to Email Input
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} style={formStyle}>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', marginBottom: '15px' }}>🔑</span>
              <h2 style={titleStyle}>Create New Password</h2>
              <p style={descStyle}>Enter your new password below.</p>
              
              <input 
                type="password" 
                placeholder="New Password (min 6 chars)" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                style={inputStyle}
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                style={inputStyle}
              />
              
              <button type="submit" disabled={loading} className="btn" style={submitBtnStyle}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styling definitions
const overlayStyle = {
  zIndex: 12000
};

const wrapperStyle = {
  maxWidth: '420px',
  background: '#121214',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: 'none',
  color: '#a1a1aa',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  outline: 'none'
};

const errorBannerStyle = {
  color: '#ef4444',
  background: 'rgba(239, 68, 68, 0.1)',
  padding: '10px',
  borderRadius: '6px',
  fontSize: '14px',
  marginBottom: '20px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  textAlign: 'center'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const titleStyle = {
  fontSize: '1.6rem',
  color: '#fff',
  textAlign: 'center',
  marginBottom: '5px',
  marginTop: 0
};

const descStyle = {
  color: '#a1a1aa',
  fontSize: '13.5px',
  textAlign: 'center',
  marginBottom: '20px',
  lineHeight: '1.5'
};

const inputStyle = {
  width: '100%',
  padding: '13px 15px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  marginBottom: '15px',
  boxSizing: 'border-box'
};

const submitBtnStyle = {
  marginTop: '10px',
  width: '100%'
};

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#a1a1aa',
  cursor: 'pointer',
  fontSize: '13px',
  marginTop: '15px',
  textAlign: 'center',
  textDecoration: 'underline'
};

export default ForgotPasswordModal;
