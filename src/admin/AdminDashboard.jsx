import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminPromos from './AdminPromos';
import EditProduct from './EditProduct';
import AdminSupportChat from './AdminSupportChat';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'add-product', 'products', 'edit-product', 'orders', 'users', 'promos'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0, totalUserVisits: 0, adminCommission: 0, totalReturnedOrders: 0, totalReturnedAmount: 0 });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (activeView === 'overview') {
      fetchStats();
    }
  }, [user, navigate, activeView]);

  if (!user || user.role !== 'admin') {
    return null;
  }


  const menuBtnStyle = (viewName) => {
    const isActive = activeView === viewName || (viewName === 'products' && activeView === 'edit-product');
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '12px 16px',
      margin: '6px 0',
      background: isActive ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
      color: isActive ? '#fff' : '#a1a1aa',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14.5px',
      fontWeight: '600',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxShadow: isActive ? '0 4px 12px rgba(234, 88, 12, 0.25)' : 'none'
    };
  };

  const profileBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    background: '#18181b',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    marginBottom: '30px'
  };

  const avatarStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  };

  const cardStyle = {
    padding: '25px',
    background: '#121214',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  };

  const numberStyle = {
    fontSize: '2.4rem',
    fontWeight: '800',
    color: '#f97316'
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <div className={`admin-sidebar ${showMobileMenu ? 'expanded' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/CartGoLogoCircle.png" alt="Logo" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>CartGo Admin</h2>
          </div>
          {/* Mobile Toggle Trigger */}
          <button 
            className="admin-menu-toggle-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {showMobileMenu ? '✕ Menu' : '☰ Menu'}
          </button>
        </div>

        {/* Profile Card */}
        <div style={profileBoxStyle} className="admin-sidebar-profile">
          <div style={avatarStyle}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</span>
            <span style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Administrator</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="admin-sidebar-menu">
          <button style={menuBtnStyle('overview')} onClick={() => { setActiveView('overview'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>📊</span> Dashboard Overview
          </button>
          <button style={menuBtnStyle('add-product')} onClick={() => { setActiveView('add-product'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>➕</span> Add Product
          </button>
          <button style={menuBtnStyle('products')} onClick={() => { setActiveView('products'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>📦</span> Manage Products
          </button>
          <button style={menuBtnStyle('orders')} onClick={() => { setActiveView('orders'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>🚚</span> Manage Orders
          </button>
          <button style={menuBtnStyle('users')} onClick={() => { setActiveView('users'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>👥</span> Users Directory
          </button>
          <button style={menuBtnStyle('promos')} onClick={() => { setActiveView('promos'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>🎫</span> Promo Codes
          </button>
          <button style={menuBtnStyle('chat')} onClick={() => { setActiveView('chat'); setShowMobileMenu(false); }}>
            <span style={{ fontSize: '16px' }}>💬</span> Support Live Chat
          </button>
          
          <button 
            style={{ 
              ...menuBtnStyle('exit'), 
              marginTop: '20px', 
              background: 'rgba(239, 68, 68, 0.08)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.15)',
              boxShadow: 'none' 
            }} 
            onClick={() => navigate('/')}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span> Exit Dashboard
          </button>
        </div>

        {/* Footer info */}
        <div className="admin-sidebar-footer" style={{ color: '#52525b', fontSize: '11px', textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '15px' }}>
          CartGo Panel © 2026
        </div>
      </div>

      {/* Main Content Render Area */}
      <div className="admin-main-content">
        
        {activeView === 'overview' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '5px', marginTop: 0 }}>Dashboard Overview</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '35px', fontSize: '14px' }}>Analyze shop traffic, revenue distribution, and sales commissions.</p>
            
            {loadingStats ? (
              <div style={{ textAlign: 'center', margin: '100px 0', color: '#f97316', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Loading metrics...
              </div>
            ) : stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                
                <div style={cardStyle}>
                  <span style={{ fontSize: '2.5rem' }}>📈</span>
                  <h4 style={{ color: '#a1a1aa', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total User Visits</h4>
                  <div style={numberStyle}>{stats.totalUserVisits}</div>
                </div>

                <div style={cardStyle}>
                  <span style={{ fontSize: '2.5rem' }}>📦</span>
                  <h4 style={{ color: '#a1a1aa', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</h4>
                  <div style={numberStyle}>{stats.totalOrders}</div>
                </div>

                <div style={cardStyle}>
                  <span style={{ fontSize: '2.5rem' }}>🏷️</span>
                  <h4 style={{ color: '#a1a1aa', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Products</h4>
                  <div style={numberStyle}>{stats.totalProducts}</div>
                </div>

                <div style={cardStyle}>
                  <span style={{ fontSize: '2.5rem' }}>👥</span>
                  <h4 style={{ color: '#a1a1aa', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</h4>
                  <div style={numberStyle}>{stats.totalUsers}</div>
                </div>

                <div style={cardStyle}>
                  <span style={{ fontSize: '2.5rem' }}>💰</span>
                  <h4 style={{ color: '#a1a1aa', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</h4>
                  <div style={numberStyle}>₹{Math.round(stats.totalRevenue)}</div>
                </div>

                <div style={{ ...cardStyle, background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                  <span style={{ fontSize: '2.5rem' }}>↩️</span>
                  <h4 style={{ color: '#ef4444', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Total Returned</h4>
                  <div style={{ ...numberStyle, color: '#ef4444' }}>
                    {stats.totalReturnedOrders || 0} <span style={{ fontSize: '1.2rem', fontWeight: '500', color: '#fca5a5' }}>(₹{Math.round(stats.totalReturnedAmount || 0)})</span>
                  </div>
                </div>

                <div style={{ ...cardStyle, background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.15)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🪙</span>
                  <h4 style={{ color: '#22c55e', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Admin Commission (5%)</h4>
                  <div style={{ ...numberStyle, color: '#22c55e' }}>₹{stats.adminCommission.toFixed(2)}</div>
                </div>

              </div>
            ) : (
              <div style={{ color: '#ef4444', textAlign: 'center', margin: '100px 0' }}>Failed to load metrics.</div>
            )}
          </div>
        )}

        {activeView === 'add-product' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <AddProduct onSuccess={() => setActiveView('products')} />
          </div>
        )}

        {activeView === 'products' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <AdminProducts 
              onAddProductClick={() => setActiveView('add-product')} 
              onEditProductClick={(id) => {
                setSelectedProductId(id);
                setActiveView('edit-product');
              }} 
            />
          </div>
        )}

        {activeView === 'edit-product' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <EditProduct 
              productId={selectedProductId} 
              onSuccess={() => setActiveView('products')} 
            />
          </div>
        )}

        {activeView === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <AdminOrders />
          </div>
        )}

        {activeView === 'users' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <AdminUsers />
          </div>
        )}

        {activeView === 'promos' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <AdminPromos />
          </div>
        )}

        {activeView === 'chat' && (
          <div style={{ animation: 'fadeIn 0.3s ease', height: '100%' }}>
            <AdminSupportChat user={user} />
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
