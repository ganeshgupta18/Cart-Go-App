import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const { showAlert, showConfirm } = useModal();
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Successfully created ${role} account for ${name}!`);
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
        fetchUsers();
      } else {
        setError(data.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while creating the user.');
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userId === user._id) {
      showAlert('Operation Blocked', 'You cannot delete your own logged-in account!');
      return;
    }

    showConfirm(
      'Confirm Deletion',
      `Are you sure you want to delete user: ${userEmail}?`,
      async () => {
        setMessage('');
        setError('');
        try {
          const res = await fetch(`/api/auth/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setMessage('User deleted successfully.');
            fetchUsers();
          } else {
            setError(data.message || 'Failed to delete user.');
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred while deleting the user.');
        }
      }
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
        User Administration
      </h2>

      {message && <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}
      {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Create User Form */}
        <div style={cardStyle}>
          <h3 style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.4rem' }}>Create User / Admin</h3>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn" style={{ marginTop: '10px' }}>
              Create Account
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div style={cardStyle}>
          <h3 style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.4rem' }}>Registered Directory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thStyle}>NAME</th>
                  <th style={thStyle}>EMAIL</th>
                  <th style={thStyle}>ROLE</th>
                  <th style={thStyle}>DATE JOINED</th>
                  <th style={thStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={tdRowStyle}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{u.name}</span>
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(234,88,12,0.15)' : 'rgba(16,185,129,0.15)',
                        color: u.role === 'admin' ? '#f97316' : '#10b981',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {u._id === user._id ? (
                        <span style={{ color: '#a1a1aa', fontSize: '0.9rem', fontStyle: 'italic' }}>Active Self</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          style={deleteBtnStyle}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '1300px',
  margin: '40px auto',
  padding: '40px',
  background: 'rgba(24, 24, 27, 0.7)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.05)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  color: '#fafafa',
  backdropFilter: 'blur(10px)'
};

const cardStyle = {
  background: '#09090b',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '0.85rem',
  color: '#a1a1aa',
  fontWeight: '500'
};

const inputStyle = {
  padding: '12px',
  background: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const selectStyle = {
  padding: '12px',
  background: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const thRowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const tdRowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.03)'
};

const thStyle = {
  padding: '15px 10px',
  color: '#a1a1aa',
  fontSize: '0.85rem',
  fontWeight: '600',
  letterSpacing: '0.5px'
};

const tdStyle = {
  padding: '15px 10px',
  color: '#d4d4d8',
  fontSize: '0.95rem'
};

const deleteBtnStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s'
};

export default AdminUsers;
