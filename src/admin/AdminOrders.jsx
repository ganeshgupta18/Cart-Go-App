import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
    }
  };

  return (
    <div className="admin-page-container">
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Manage Orders</h2>
      <div className="admin-responsive-table-wrapper">
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={rowStyle}>
                <td style={tdStyle}>{order._id.substring(0, 8)}...</td>
                <td style={tdStyle}>{order.userId?.name || 'Deleted User'}</td>
                <td style={tdStyle}>₹{order.totalAmount.toFixed(2)}</td>
                <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  {order.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => updateStatus(order._id, 'Confirmed')}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => updateStatus(order._id, 'Cancelled')}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : order.status === 'Confirmed' ? (
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ background: '#09090b', color: '#fff', padding: '6px 10px', border: '1px solid #27272a', borderRadius: '4px', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  ) : order.status === 'Shipped' ? (
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ background: '#09090b', color: '#fff', padding: '6px 10px', border: '1px solid #27272a', borderRadius: '4px', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
                    >
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  ) : (
                    <span style={{ 
                      background: order.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : order.status === 'Returned' ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.1)', 
                      color: order.status === 'Delivered' ? '#10b981' : '#ef4444',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {order.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default AdminOrders;
