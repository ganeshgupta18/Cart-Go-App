import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const AppReviewModal = ({ isOpen, onClose, forceShow = false }) => {
  const { user } = useContext(AuthContext);
  const { showAlert } = useModal();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShouldShow(false);
      return;
    }

    if (forceShow) {
      setShouldShow(true);
      return;
    }

    // If not forced, check if logged-in user already reviewed the app
    if (user) {
      const checkReview = async () => {
        try {
          const res = await fetch('/api/reviews/app/check', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && !data.hasReviewed) {
            setShouldShow(true);
          } else {
            setShouldShow(false);
            if (onClose) onClose();
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkReview();
    } else {
      setShouldShow(false);
    }
  }, [isOpen, user, forceShow, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        showAlert('Thank You!', 'Your review has been successfully submitted! It helps us improve CartGo.');
        setComment('');
        setRating(5);
        if (onClose) onClose();
      } else {
        const data = await res.json();
        showAlert('Error', data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Connection error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={wrapperStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} style={{ padding: '30px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>⭐</span>
          <h3 style={{ margin: '0 0 10px', fontSize: '1.6rem', color: '#fff', fontWeight: '800' }}>
            Rate Your Experience
          </h3>
          <p style={{ margin: '0 0 20px', color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5' }}>
            We would love to hear your feedback on the CartGo app and service!
          </p>

          {/* Interactive Star Rating */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  fontSize: '32px',
                  cursor: 'pointer',
                  color: (hoverRating || rating) >= star ? '#f59e0b' : '#3f3f46',
                  transition: 'color 0.15s ease'
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Tell us what you like or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows="4"
            style={textareaStyle}
          />

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Later
            </button>
            <button type="submit" disabled={loading} style={confirmBtnStyle}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styling
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(9, 9, 11, 0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 15000
};

const wrapperStyle = {
  background: '#121214',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '450px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
  position: 'relative',
  overflow: 'hidden'
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
  transition: 'all 0.2s ease',
  fontSize: '16px',
  fontWeight: 'bold'
};

const textareaStyle = {
  width: '100%',
  padding: '12px 15px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14.5px',
  outline: 'none',
  resize: 'none',
  marginBottom: '20px',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const confirmBtnStyle = {
  flex: 1,
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  color: '#fff',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14.5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
};

const cancelBtnStyle = {
  flex: 1,
  background: 'transparent',
  color: '#a1a1aa',
  padding: '12px 20px',
  border: '1px solid #27272a',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14.5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export default AppReviewModal;
