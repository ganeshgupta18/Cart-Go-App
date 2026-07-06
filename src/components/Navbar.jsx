import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { useModal } from '../context/ModalContext';
import '../styles/navbar.css';
import AppReviewModal from './AppReviewModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [navSearch, setNavSearch] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (routerLocation.pathname === '/shop') {
      const params = new URLSearchParams(routerLocation.search);
      setNavSearch(params.get('search') || '');
    } else {
      setNavSearch('');
    }
    setShowMobileMenu(false); // Close mobile menu when page navigation occurs
  }, [routerLocation]);

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(navSearch)}`);
  };

  const [location, setLocation] = useState('Select delivery location');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activePromos, setActivePromos] = useState([]);
  const userMenuRef = useRef(null);

  // Change Password States
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [showAppReview, setShowAppReview] = useState(false);

  useEffect(() => {
    if (user) {
      if (localStorage.getItem('triggerAppReviewOnLogin') === 'true') {
        localStorage.removeItem('triggerAppReviewOnLogin');
        setShowAppReview(true);
      }
    }
  }, [user]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    const fetchActivePromos = async () => {
      try {
        const res = await fetch('/api/promos');
        const data = await res.json();
        if (res.ok) {
          setActivePromos(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivePromos();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangePasswordError('');

    if (newPassword.length < 6) {
      setChangePasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('New passwords do not match.');
      return;
    }

    setChangePasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Success', 'Password changed successfully!', () => {
          setShowChangePasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        });
      } else {
        setChangePasswordError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      setChangePasswordError('Server connection failed. Try again.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Location Error", "Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.suburb || data.address.state_district || "Location Set";
          const postcode = data.address.postcode || "";
          const finalLoc = postcode ? `${city}, ${postcode}` : city;
          setLocation(finalLoc);
          localStorage.setItem('userLocation', finalLoc);
          setShowLocationModal(false);
        } catch (err) {
          console.error(err);
          const fallback = `Delhi, 110001`;
          setLocation(fallback);
          localStorage.setItem('userLocation', fallback);
          setShowLocationModal(false);
        }
      },
      (error) => {
        showAlert("Location Error", "Permission denied or location unavailable. Please type your location manually.");
      }
    );
  };

  const saveManualLocation = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation);
      localStorage.setItem('userLocation', manualLocation);
      setShowLocationModal(false);
    } else {
      showAlert("Input Required", "Please enter a location name or pincode");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        🎉 Welcome Offer: Get a Flat 30% discount on your first order! Use code <span className="announcement-code">WELCOME30</span> at checkout.
      </div>

      {activePromos && activePromos.length > 0 && (
        <div className="announcement-bar-sub" style={{ background: '#121214', borderBottom: '1px solid rgba(249, 115, 22, 0.15)', color: '#a1a1aa', textAlign: 'center', padding: '6px 20px', fontSize: '12px', fontWeight: '500', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span>🔥 Special Offers:</span>
          {activePromos.map((p) => (
            <span key={p._id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Use <strong style={{ color: '#fff', background: 'rgba(249, 115, 22, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(249, 115, 22, 0.25)', fontSize: '11px', fontFamily: 'monospace' }}>{p.code}</strong> for {p.discountPercentage}% OFF! {p.description ? `(${p.description})` : ''}
            </span>
          ))}
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-header-row">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/CartGoLogoCircle.png" alt="CartGo" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))' }} />
              CartGo
            </Link>
          </div>

          {/* Location Picker (Desktop) */}
          <div className="location-btn-wrapper desktop-only" onClick={() => setShowLocationModal(true)}>
            <span className="location-icon">📍</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <span className="location-label" style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliver to</span>
              <span className="location-text" style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{location}</span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleNavSearchSubmit} className="navbar-search-form desktop-only">
            <input
              type="text"
              placeholder="Search for products, categories..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-btn">
              🔍
            </button>
          </form>

          {/* Navigation Links (Desktop) */}
          <ul className="navbar-links desktop-only">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Cart ({cartItems.length})
              </Link>
            </li>
            <li ref={userMenuRef} className="user-avatar-container">
              <div
                className="user-avatar-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                {user ? (
                  <div className="user-avatar-btn">
                    {user.name ? user.name.split(' ')[0].charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <div className="user-avatar-btn guest">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>

              {showUserMenu && (
                <div className="user-dropdown-menu">
                  {user ? (
                    <>
                      <div className="user-dropdown-header">
                        Hi, {user.name}
                      </div>
                      <Link to="/profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <span style={{ marginRight: '8px' }}>👤</span> Profile
                      </Link>
                      <Link to="/profile#orders" className="user-dropdown-item" onClick={() => {
                        setShowUserMenu(false);
                        const element = document.getElementById('order-history');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        <span style={{ marginRight: '8px' }}>📦</span> Orders
                      </Link>
                      <Link to="/profile#favorites" className="user-dropdown-item" onClick={() => {
                        setShowUserMenu(false);
                        const element = document.getElementById('favorite-items');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        <span style={{ marginRight: '8px' }}>❤️</span> Favorite Items
                      </Link>
                      <Link to="/support" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <span style={{ marginRight: '8px' }}>💬</span> Help & Live Chat
                      </Link>
                      <button
                        onClick={() => { setShowUserMenu(false); setShowChangePasswordModal(true); }}
                        className="user-dropdown-item"
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', outline: 'none' }}
                      >
                        <span style={{ marginRight: '8px' }}>🔑</span> Change Password
                      </button>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                          <span style={{ marginRight: '8px' }}>⚙️</span> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { setShowUserMenu(false); handleLogout(); }} className="user-dropdown-item logout">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <span style={{ marginRight: '8px' }}>🔑</span> Login
                      </Link>
                      <Link to="/register" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <span style={{ marginRight: '8px' }}>📝</span> Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>

          {/* Mobile Right Icons & Menu Toggle */}
          <div className="navbar-mobile-header-right">
            <Link to="/cart" className="navbar-mobile-icon-btn">
              <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.35em" width="1.35em" xmlns="http://www.w3.org/2000/svg" style={{ color: '#fff' }}>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartItems.length > 0 && (
                  <span className="navbar-mobile-badge">{cartItems.length}</span>
                )}
              </span>
            </Link>

            <div className="navbar-mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ color: showMobileMenu ? '#f97316' : '#fff' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="12" cy="19" r="2"></circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="navbar-mobile-search-row">
          <form onSubmit={handleNavSearchSubmit} className="navbar-search-form mobile-search-form">
            <input
              type="text"
              placeholder="Search for products..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-btn">
              🔍
            </button>
          </form>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {showMobileMenu && (
          <div className="navbar-mobile-menu-dropdown">
            {/* Location Picker */}
            <div className="location-btn-wrapper mobile-menu-location" onClick={() => { setShowMobileMenu(false); setShowLocationModal(true); }}>
              <span className="location-icon">📍</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span className="location-label" style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliver to</span>
                <span className="location-text" style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{location}</span>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="mobile-menu-links">
              <Link to="/shop" onClick={() => setShowMobileMenu(false)}>Shop Products</Link>
              <Link to="/about" onClick={() => setShowMobileMenu(false)}>About Us</Link>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)}>Contact Us</Link>
              <Link to="/support" onClick={() => setShowMobileMenu(false)}>💬 Help & Live Chat</Link>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '15px 0', padding: '15px 0 0 0' }}>
                {user ? (
                  <>
                    <div style={{ padding: '0 10px 10px 10px', color: '#f97316', fontWeight: 'bold', fontSize: '14px', textAlign: 'left' }}>
                      👤 Hi, {user.name}
                    </div>
                    <Link to="/profile" onClick={() => setShowMobileMenu(false)}>My Profile</Link>
                    <Link to="/profile#orders" onClick={() => setShowMobileMenu(false)}>My Orders</Link>
                    <Link to="/profile#favorites" onClick={() => setShowMobileMenu(false)}>Favorite Items</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowMobileMenu(false)} style={{ color: '#ea580c' }}>⚙️ Admin Panel</Link>
                    )}
                    <button 
                      onClick={() => { setShowMobileMenu(false); handleLogout(); }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px',
                        textAlign: 'center',
                        fontFamily: 'inherit'
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', padding: '0 10px' }}>
                    <Link to="/login" className="btn" style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '14px' }} onClick={() => setShowMobileMenu(false)}>Login</Link>
                    <Link to="/register" className="btn" style={{ flex: 1, padding: '10px', textAlign: 'center', fontSize: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setShowMobileMenu(false)}>Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Geolocation Pincode Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="modal-close-btn" onClick={() => setShowLocationModal(false)}>×</button>
            <div className="location-modal-body">
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>📍</span>
              <h3>Choose your delivery location</h3>
              <p>Delivery options and speeds may vary based on your location coordinates.</p>

              <button className="btn location-prompt-btn" onClick={detectLocation}>
                📡 Detect Current Location
              </button>

              <div className="location-divider">or enter pincode/city</div>

              <div className="location-input-group">
                <input
                  type="text"
                  placeholder="e.g. Mumbai, 400001"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="location-input"
                />
                <button className="btn" onClick={saveManualLocation}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="modal-overlay" style={{ zIndex: 12000 }} onClick={() => setShowChangePasswordModal(false)}>
          <div className="modal-wrapper" style={{ maxWidth: '400px', background: '#121214', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#a1a1aa', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }} onClick={() => setShowChangePasswordModal(false)}>×</button>
            <div style={{ padding: '30px' }}>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', marginBottom: '15px' }}>🔑</span>
              <h3 style={{ fontSize: '1.6rem', color: '#fff', textAlign: 'center', marginBottom: '20px', marginTop: 0 }}>Change Password</h3>

              {changePasswordError && (
                <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                  {changePasswordError}
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 15px', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' }}
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 15px', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 15px', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' }}
                />

                <button type="submit" disabled={changePasswordLoading} className="btn" style={{ width: '100%', marginTop: '10px' }}>
                  {changePasswordLoading ? 'Saving...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {showAppReview && (
        <AppReviewModal isOpen={showAppReview} onClose={() => setShowAppReview(false)} />
      )}
    </>
  );
};

export default Navbar;
