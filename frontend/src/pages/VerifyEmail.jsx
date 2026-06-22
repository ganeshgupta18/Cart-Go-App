import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Email verified successfully! Logging you in...');
        setTimeout(() => {
          login(data);
          navigate('/');
        }, 1500);
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Please try again.');
    }
  };

  const handleResend = async () => {
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('A new OTP has been sent to your email.');
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify Your Email</h2>
        <p style={{ fontSize: '14px', marginBottom: '10px', color: '#a1a1aa' }}>
          We have sent a 6-digit verification code to <br />
          <strong style={{ color: '#fff' }}>{email}</strong>
        </p>

        {message && <div style={{ color: '#10b981', textAlign: 'center', fontSize: '14px' }}>{message}</div>}
        {error && <div style={{ color: '#ef4444', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

        <input
          type="text"
          placeholder="Enter 6-Digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          style={{
            textAlign: 'center',
            letterSpacing: '6px',
            fontSize: '22px',
            fontWeight: 'bold'
          }}
          required
        />

        <button type="submit" className="btn">Verify Code</button>

        <p style={{ fontSize: '13px' }}>
          {canResend ? (
            <span onClick={handleResend} style={{ color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>
              Resend OTP
            </span>
          ) : (
            <span>Resend OTP in {resendTimer}s</span>
          )}
        </p>
        <p style={{ fontSize: '13px', marginTop: '5px' }}>
          Back to <Link to="/login" style={{ color: '#f97316' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyEmail;
