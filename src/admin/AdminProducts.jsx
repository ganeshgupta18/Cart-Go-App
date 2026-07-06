import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const AdminProducts = ({ onAddProductClick, onEditProductClick }) => {
  const { user } = useContext(AuthContext);
  const { showConfirm } = useModal();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    showConfirm(
      'Confirm Deletion',
      'Are you strictly sure you want to delete this product?',
      async () => {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          setProducts(products.filter(p => p._id !== id));
        }
      }
    );
  };

  return (
    <div className="admin-page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#f97316' }}>Manage Products</h2>
        {onAddProductClick ? (
          <button onClick={onAddProductClick} className="btn" style={{ border: 'none', cursor: 'pointer' }}>+ Add Product</button>
        ) : (
          <Link to="/admin/add-product" className="btn">+ Add Product</Link>
        )}
      </div>

      <div className="admin-responsive-table-wrapper">
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>PRICE</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>STOCK</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={rowStyle}>
                <td style={tdStyle}>{product._id.substring(0, 8)}...</td>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>
                  {product.discount && product.discount > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: '700', color: '#f97316' }}>
                        ₹{(product.price - (product.price * (product.discount / 100))).toFixed(2)}
                      </span>
                      <span style={{ textDecoration: 'line-through', color: '#a1a1aa', fontSize: '12px' }}>
                        ₹{product.price.toFixed(2)}
                      </span>
                      <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold' }}>
                        ({product.discount}% OFF)
                      </span>
                    </div>
                  ) : (
                    <span>₹{product.price.toFixed(2)}</span>
                  )}
                </td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>{product.stock}</td>
                <td style={tdStyle}>
                  {onEditProductClick ? (
                    <button onClick={() => onEditProductClick(product._id)} style={{ ...editBtn, border: 'none', cursor: 'pointer' }}>Edit</button>
                  ) : (
                    <Link to={`/admin/edit-product/${product._id}`} style={editBtn}>Edit</Link>
                  )}
                  <button onClick={() => handleDelete(product._id)} style={deleteBtn}>Delete</button>
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
const editBtn = { background: '#3b82f6', color: '#fff', padding: '6px 12px', borderRadius: '4px', marginRight: '10px' };
const deleteBtn = { background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' };

export default AdminProducts;
