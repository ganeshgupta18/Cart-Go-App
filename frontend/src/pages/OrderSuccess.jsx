import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppReviewModal from '../components/AppReviewModal';

const OrderSuccess = () => {
  const [showAppReview, setShowAppReview] = useState(true);
  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '50px 30px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + 2);
  const formattedDate = expectedDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div style={containerStyle}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '15px' }}>🎉</span>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#10b981' }}>Order Successful!</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '30px' }}>
          Thank you for your order. We have securely received your order wait for order confirmation when order confirmed we inform you throuth Email and will process your shipment shortly.
        </p>

        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '20px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' }}>
          <h4 style={{ color: '#10b981', marginBottom: '6px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Delivery Date</h4>
          <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: '5px 0' }}>{formattedDate}</p>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>Your order will be delivered within 2 days.</p>
        </div>

        <Link to="/shop" className="btn">Continue Shopping</Link>
      </div>
      {showAppReview && (
        <AppReviewModal isOpen={showAppReview} onClose={() => setShowAppReview(false)} forceShow={true} />
      )}
    </>
  );
};

export default OrderSuccess;
