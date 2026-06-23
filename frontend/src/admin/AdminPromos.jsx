import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const AdminPromos = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();

  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: '', discountPercentage: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPromos = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/promos/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPromos(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchPromos();
  }, [fetchPromos, navigate, user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercentage) {
      showAlert('Required Fields', 'Code and discount percentage are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Success', 'Promo code created successfully!');
        setFormData({ code: '', discountPercentage: '', description: '' });
        fetchPromos();
      } else {
        showAlert('Error', data.message || 'Failed to create promo code');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`/api/promos/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchPromos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    showConfirm(
      'Confirm Deletion',
      'Are you sure you want to delete this promo code?',
      async () => {
        try {
          const res = await fetch(`/api/promos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            fetchPromos();
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '30px',
    background: '#18181b',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '40px',
    padding: '20px',
    background: '#09090b',
    borderRadius: '8px',
    border: '1px solid #27272a'
  };

  const inputStyle = {
    padding: '10px 14px',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  };

  const tableHeaderStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#a1a1aa',
    borderBottom: '1px solid #27272a',
    fontSize: '14px',
    fontWeight: '600'
  };

  const tableRowStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: '14px'
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Manage Promo Codes</h2>
          <p style={{ color: '#a1a1aa', margin: '5px 0 0' }}>Launch and control dynamic discount codes for the shop.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn" style={{ background: '#3f3f46', boxShadow: 'none' }}>
          Back to Dashboard
        </button>
      </div>

      <div className="admin-promos-layout">
        
        {/* Create Promo Code Form */}
        <div>
          <h3 style={{ color: '#f97316', marginBottom: '15px' }}>Create Promo Code</h3>
          <form onSubmit={handleCreate} style={formStyle}>
            <input 
              type="text" 
              placeholder="Promo Code (e.g. SAVE20)" 
              required 
              value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
              style={inputStyle} 
            />
            <input 
              type="number" 
              placeholder="Discount Percentage (%)" 
              min="1" 
              max="100" 
              required 
              value={formData.discountPercentage} 
              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} 
              style={inputStyle} 
            />
            <input 
              type="text" 
              placeholder="Description (e.g. 20% off all orders)" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              style={inputStyle} 
            />
            <button type="submit" disabled={submitting} className="btn" style={{ marginTop: '5px' }}>
              {submitting ? 'Creating...' : 'Launch Promo Code'}
            </button>
          </form>
        </div>

        {/* Promo Codes List */}
        <div>
          <h3 style={{ color: '#f97316', marginBottom: '15px' }}>Launched Promo Codes</h3>
          {loading ? (
            <p style={{ color: '#a1a1aa' }}>Loading promo codes...</p>
          ) : promos.length === 0 ? (
            <p style={{ color: '#a1a1aa', padding: '20px', background: '#09090b', borderRadius: '8px', border: '1px dashed #27272a', textAlign: 'center' }}>
              No promo codes launched yet. Use the form to launch one!
            </p>
          ) : (
            <div style={{ overflowX: 'auto', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <th style={tableHeaderStyle}>Code</th>
                    <th style={tableHeaderStyle}>Discount</th>
                    <th style={tableHeaderStyle}>Description</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map((promo) => (
                    <tr key={promo._id}>
                      <td style={tableRowStyle}>
                        <strong style={{ color: '#fff', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                          {promo.code}
                        </strong>
                      </td>
                      <td style={tableRowStyle}>{promo.discountPercentage}%</td>
                      <td style={{ ...tableRowStyle, color: '#a1a1aa' }}>{promo.description || '-'}</td>
                      <td style={tableRowStyle}>
                        <span style={{ color: promo.isActive ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...tableRowStyle, display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleToggle(promo._id)}
                          style={{
                            background: promo.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: promo.isActive ? '#ef4444' : '#10b981',
                            border: '1px solid transparent',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {promo.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDelete(promo._id)}
                          style={{
                            background: 'transparent',
                            color: '#71717a',
                            border: '1px solid #27272a',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromos;
