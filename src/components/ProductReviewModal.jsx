import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const ProductReviewModal = ({ isOpen, onClose, product }) => {
  const { user } = useContext(AuthContext);
  const { showAlert } = useModal();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setComment('');
      setImage(null);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert('File Too Large', 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !product) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          productId: product._id,
          rating,
          comment,
          image
        })
      });
      if (res.ok) {
        showAlert('Review Submitted', `Thank you! Your review for "${product.name}" has been successfully saved.`);
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

  if (!isOpen || !product) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={wrapperStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <h3 style={{ margin: '0 0 5px', fontSize: '1.4rem', color: '#fff', fontWeight: '800', textAlign: 'center' }}>
            Review Product
          </h3>
          <p style={{ margin: '0 0 20px', color: '#a1a1aa', fontSize: '13px', textAlign: 'center' }}>
            Share your experience with <strong>{product.name}</strong>
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

          {/* Review Text comment */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Your Review</label>
            <textarea
              placeholder="How is the quality, packaging, and delivery? Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="4"
              style={textareaStyle}
            />
          </div>

          {/* Flipkart-style Product Image Upload */}
          <div style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label style={labelStyle}>Upload Real Product Image (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
              {!image ? (
                <label style={uploadAreaStyle}>
                  <span style={{ fontSize: '1.5rem', display: 'block' }}>📷</span>
                  <span style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : (
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={removeImgBtnStyle}
                  >
                    ×
                  </button>
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                Images help other buyers make better decisions.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={confirmBtnStyle}>
              {loading ? 'Submitting...' : 'Submit Review'}
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
  maxWidth: '460px',
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

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#e4e4e7',
  marginBottom: '6px'
};

const textareaStyle = {
  width: '100%',
  padding: '12px 15px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  resize: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const uploadAreaStyle = {
  width: '80px',
  height: '80px',
  border: '1px dashed #27272a',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  background: '#09090b',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

const removeImgBtnStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  background: '#ef4444',
  border: 'none',
  color: '#fff',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
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

export default ProductReviewModal;
