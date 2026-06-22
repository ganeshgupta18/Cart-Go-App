import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import { useModal } from '../context/ModalContext';
import '../styles/cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    const savedDiscount = localStorage.getItem('cartDiscount');
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedDiscount && savedCoupon) {
      setDiscount(parseFloat(savedDiscount));
      setAppliedCoupon(savedCoupon);
    }
  }, []);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME30') {
      setDiscount(0.3);
      setAppliedCoupon('WELCOME30');
      localStorage.setItem('cartDiscount', '0.3');
      localStorage.setItem('appliedCoupon', 'WELCOME30');
      showAlert('Coupon Success', 'Coupon applied successfully! 30% welcome discount applied.');
      return;
    }

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) {
        const discPercentage = data.discountPercentage;
        const discMultiplier = discPercentage / 100;
        setDiscount(discMultiplier);
        setAppliedCoupon(data.code);
        localStorage.setItem('cartDiscount', discMultiplier.toString());
        localStorage.setItem('appliedCoupon', data.code);
        showAlert('Coupon Success', `Coupon ${data.code} applied successfully! ${discPercentage}% discount applied.`);
      } else {
        showAlert('Coupon Error', data.message || 'Invalid promo coupon code!');
      }
    } catch (err) {
      console.error(err);
      showAlert('Coupon Error', 'Error validating coupon code!');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
    localStorage.removeItem('cartDiscount');
    localStorage.removeItem('appliedCoupon');
    showAlert('Coupon Removed', 'Coupon removed.');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = totalPrice * discount;
  const finalPrice = totalPrice - discountAmount;

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/shop">Go Shopping</Link></p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <div className="qty-controls">
                    <button onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="btn-remove">Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Items Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#22c55e' }}>
                <span>Coupon ({appliedCoupon}):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #27272a', paddingTop: '15px', marginTop: '15px', fontWeight: 'bold' }}>
              <span>Estimated Total:</span>
              <span style={{ fontSize: '1.2rem', color: '#f97316' }}>₹{finalPrice.toFixed(2)}</span>
            </div>

            {appliedCoupon ? (
              <button 
                onClick={handleRemoveCoupon} 
                className="btn-logout" 
                style={{ width: '100%', padding: '10px', marginTop: '20px', fontSize: '13px' }}
              >
                Remove Coupon
              </button>
            ) : (
              <div className="coupon-section">
                <label style={{ fontSize: '13px', color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>Promo Coupon</label>
                <div className="coupon-input-group">
                  <input 
                    type="text" 
                    placeholder="WELCOME30" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button onClick={handleApplyCoupon} className="btn coupon-btn">Apply</button>
                </div>
              </div>
            )}
            
            <button onClick={() => navigate('/checkout')} className="btn btn-checkout" style={{ width: '100%', marginTop: '20px', display: 'block' }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
