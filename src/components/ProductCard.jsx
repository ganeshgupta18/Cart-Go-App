import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  const { user, wishlist, toggleWishlist } = useContext(AuthContext);
  const { showAlert } = useModal();

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  const isFavorite = wishlist && wishlist.some(item => (item._id === product._id || item === product._id));

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showAlert('Authentication Required', 'Please log in to add items to your favorites.');
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div className="product-card">
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label="Add to favorites"
      >
        <svg viewBox="0 0 24 24" className="heart-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-info" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: '#71717a', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            {product.category || 'CartGo'}
          </span>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#fff' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', fontSize: '12px' }}>
            <span style={{ color: '#f59e0b' }}>
              {product.ratings > 0 
                ? '★'.repeat(Math.round(product.ratings)) + '☆'.repeat(5 - Math.round(product.ratings))
                : '☆☆☆☆☆'}
            </span>
            <span style={{ color: '#71717a' }}>({product.numReviews || 0})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {hasDiscount ? (
              <>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                  ₹{Math.round(discountedPrice)}
                </span>
                <span style={{ textDecoration: 'line-through', color: '#71717a', fontSize: '13px' }}>
                  ₹{Math.round(product.price)}
                </span>
                <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '700' }}>
                  {product.discount}% off
                </span>
              </>
            ) : (
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                ₹{Math.round(product.price)}
              </span>
            )}
          </div>

          {hasDiscount && product.discount >= 20 && (
            <div style={{ marginBottom: '12px' }}>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.15)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' }}>
                Hot Deal
              </span>
            </div>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="btn" style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>View Details</Link>
      </div>
    </div>
  );
};

export default ProductCard;
