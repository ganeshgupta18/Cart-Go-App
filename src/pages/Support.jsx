import React from 'react';
import LiveChatSupport from '../components/LiveChatSupport';
import '../styles/auth.css'; // Consistency in container styles

const Support = () => {
  return (
    <div className="auth-container" style={{ minHeight: '80vh', flexDirection: 'column', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ color: '#fff', fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: '800' }}>
            Help &amp; Live Chat Support
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', margin: 0, lineHeight: '1.5' }}>
            Get real-time answers to your questions about orders, payments, refunds, and more from our support team.
          </p>
        </div>

        <LiveChatSupport />

        <div style={{ textAlign: 'center', color: '#71717a', fontSize: '0.85rem', marginTop: '15px' }}>
          <p>⏳ Our administrators typically reply within a few minutes during business hours.</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
