import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import ProductCard from '../components/ProductCard';
import ProductReviewModal from '../components/ProductReviewModal';

const Profile = () => {
  const { user, logout, wishlist } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [isProductReviewOpen, setIsProductReviewOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          // Token obsolete or 401: clear and bounce
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate, logout]);

  useEffect(() => {
    if (!loading) {
      if (window.location.hash === '#orders') {
        const element = document.getElementById('order-history');
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      } else if (window.location.hash === '#favorites') {
        const element = document.getElementById('favorite-items');
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      } else if (window.location.hash === '#chat') {
        const element = document.getElementById('live-chat');
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [loading]);

  const [trackingStates] = useState({});

  const isReturnEligible = (order) => {
    if (order.status !== 'Delivered') return false;
    const deliveredDate = order.deliveredAt || order.updatedAt || order.createdAt;
    const timeElapsed = Date.now() - new Date(deliveredDate).getTime();
    const returnLimit = 3 * 24 * 60 * 60 * 1000; // 3 days
    return timeElapsed < returnLimit;
  };

  const getDeliveryDateText = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const handleReturnOrder = (orderId) => {
    showConfirm(
      'Confirm Return',
      'Are you sure you want to return this product? This action cannot be undone.',
      async () => {
        try {
          const res = await fetch(`/api/orders/${orderId}/return`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          });
          const data = await res.json();
          if (res.ok) {
            showAlert('Return Success', 'Return request processed successfully. Check your email for details.');
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Returned' } : o));
          } else {
            showAlert('Return Error', data.message || 'Failed to process return.');
          }
        } catch (err) {
          console.error(err);
          showAlert('Return Error', 'An error occurred while processing the return.');
        }
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
  const badgeStyle = { background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block' };

  const trackerContainerStyle = {
    width: '100%',
    marginTop: '15px',
    padding: '25px 20px',
    background: '#121214',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    boxSizing: 'border-box'
  };

  const stepperWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    padding: '0 10px'
  };

  const stepStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
    flex: '0 0 70px'
  };

  const activeStepCircle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f97316',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 0 10px rgba(249, 115, 22, 0.4)',
    border: 'none'
  };

  const activeStepCircleDelivered = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#10b981',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
    border: 'none'
  };

  const inactiveStepCircle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#27272a',
    color: '#a1a1aa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '13px',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  const stepLabelStyle = {
    fontSize: '12px',
    color: '#fff',
    marginTop: '8px',
    fontWeight: '600',
    textAlign: 'center'
  };

  const activeLineStyle = {
    flex: 1,
    height: '3px',
    background: '#f97316',
    margin: '0 -15px',
    transform: 'translateY(-13px)',
    zIndex: 1
  };

  const inactiveLineStyle = {
    flex: 1,
    height: '3px',
    background: '#27272a',
    margin: '0 -15px',
    transform: 'translateY(-13px)',
    zIndex: 1
  };

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '10px' }}>My Profile</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '5px' }}><strong>Name:</strong> {user.name}</p>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '15px' }}><strong>Email:</strong> {user.email}</p>
          <span style={badgeStyle}>Account Type: {user.role.toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', boxShadow: 'none' }}>Logout</button>
      </div>

      <h3 id="order-history" style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.5rem' }}>Order History</h3>
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', width: '100%' }}>
                <div>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#10b981' }}>₹{order.totalAmount.toFixed(2)}</strong></p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ 
                    background: order.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : order.status === 'Shipped' ? 'rgba(59,130,246,0.1)' : order.status === 'Confirmed' ? 'rgba(249,115,22,0.1)' : order.status === 'Cancelled' || order.status === 'Returned' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', 
                    color: order.status === 'Delivered' ? '#10b981' : order.status === 'Shipped' ? '#3b82f6' : order.status === 'Confirmed' ? '#f97316' : order.status === 'Cancelled' || order.status === 'Returned' ? '#ef4444' : '#f59e0b',
                    padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' 
                  }}>
                    {order.status}
                  </span>

                  <button 
                    onClick={() => window.open(`/receipt/${order._id}`, '_blank')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'; e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
                  >
                    Download Receipt
                  </button>

                  {order.status !== 'Returned' && isReturnEligible(order) && (
                    <button 
                      onClick={() => handleReturnOrder(order._id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      Return Order
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '5px' }}>
                {order.items && order.items.map((item, idx) => {
                  const prod = item.productId;
                  if (!prod) return null;
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} 
                        />
                        <div>
                          <Link to={`/product/${prod._id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
                            {prod.name}
                          </Link>
                          <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: '3px 0 0 0' }}>
                            Qty: {item.qty} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => {
                            setSelectedProductForReview(prod);
                            setIsProductReviewOpen(true);
                          }}
                          style={{
                            background: 'rgba(249, 115, 22, 0.1)',
                            color: '#f97316',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'; e.currentTarget.style.color = '#f97316'; }}
                        >
                          ★ Review Product
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {trackingStates[order._id] && (
                <div style={trackerContainerStyle}>
                  {order.status === 'Cancelled' ? (
                    <div style={{ color: '#ef4444', fontWeight: '600', textAlign: 'center', padding: '10px' }}>
                      ❌ This order was cancelled.
                    </div>
                  ) : order.status === 'Returned' ? (
                    <div style={{ color: '#f87171', fontWeight: '600', textAlign: 'center', padding: '10px' }}>
                      ↩️ This order has been returned.
                    </div>
                  ) : (
                    <div>
                      <div style={stepperWrapperStyle}>
                        {/* Step 1: Placed */}
                        <div style={stepStyle}>
                          <div style={getStatusStep(order.status) >= 1 ? activeStepCircle : inactiveStepCircle}>✓</div>
                          <span style={stepLabelStyle}>Placed</span>
                        </div>
                        
                        <div style={getStatusStep(order.status) >= 2 ? activeLineStyle : inactiveLineStyle} />

                        {/* Step 2: Confirmed */}
                        <div style={stepStyle}>
                          <div style={getStatusStep(order.status) >= 2 ? activeStepCircle : inactiveStepCircle}>
                            {getStatusStep(order.status) >= 2 ? '✓' : '2'}
                          </div>
                          <span style={stepLabelStyle}>Confirmed</span>
                        </div>

                        <div style={getStatusStep(order.status) >= 3 ? activeLineStyle : inactiveLineStyle} />

                        {/* Step 3: Shipped */}
                        <div style={stepStyle}>
                          <div style={getStatusStep(order.status) >= 3 ? activeStepCircle : inactiveStepCircle}>
                            {getStatusStep(order.status) >= 3 ? '✓' : '3'}
                          </div>
                          <span style={stepLabelStyle}>Shipped</span>
                        </div>

                        <div style={getStatusStep(order.status) >= 4 ? activeLineStyle : inactiveLineStyle} />

                        {/* Step 4: Delivered */}
                        <div style={stepStyle}>
                          <div style={getStatusStep(order.status) >= 4 ? activeStepCircleDelivered : inactiveStepCircle}>
                            {getStatusStep(order.status) >= 4 ? '✓' : '4'}
                          </div>
                          <span style={stepLabelStyle}>Delivered</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.95rem' }}>
                        {order.status === 'Delivered' ? (
                          <span style={{ color: '#a1a1aa' }}>
                            Delivered on: <strong style={{ color: '#10b981' }}>{getDeliveryDateText(order.deliveredAt || order.updatedAt)}</strong>
                          </span>
                        ) : (
                          <span style={{ color: '#a1a1aa' }}>
                            Expected Delivery: <strong style={{ color: getDeliveryDateText(order.deliveryDate) === 'Today' ? '#10b981' : '#f97316' }}>{getDeliveryDateText(order.deliveryDate)}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h3 id="favorite-items" style={{ color: '#f97316', marginTop: '40px', marginBottom: '20px', fontSize: '1.5rem' }}>Favorite Items</h3>
      {!wishlist || wishlist.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>You haven't added any products to your favorites yet.</p>
          <Link to="/shop" className="btn">Browse Shop</Link>
        </div>
      ) : (
        <div className="product-grid" style={{ marginTop: '20px' }}>
          {wishlist.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      
      <h3 id="live-chat" style={{ color: '#f97316', marginTop: '40px', marginBottom: '20px', fontSize: '1.5rem' }}>Help & Live Chat Support</h3>
      <div style={{ background: '#09090b', padding: '35px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.05rem', maxWidth: '500px', lineHeight: '1.6' }}>
          Have questions about your order, return status, or need live assistance? Chat directly with a support administrator.
        </p>
        <Link to="/support" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}>
          💬 Open Dedicated Live Support Chat
        </Link>
      </div>

      {selectedProductForReview && (
        <ProductReviewModal 
          isOpen={isProductReviewOpen} 
          onClose={() => setIsProductReviewOpen(false)} 
          product={selectedProductForReview} 
        />
      )}
    </div>
  );
};

export default Profile;
