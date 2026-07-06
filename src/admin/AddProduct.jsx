import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const AddProduct = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const { showAlert } = useModal();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', discount: 0
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!image) {
      showAlert('Required Field', 'Please select an image');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category === 'Custom...' ? customCategory : formData.category);
    data.append('stock', formData.stock);
    data.append('discount', formData.discount || 0);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        showAlert('Success', 'Product created successfully!', () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/shop');
          }
        });
      } else {
        showAlert('Error', responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container" style={{ maxWidth: '600px' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Product Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={inputStyle} 
        />
        <textarea 
          placeholder="Description" required rows="4"
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Price" required 
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          style={inputStyle} 
        />
        <select 
          required 
          value={formData.category} 
          onChange={(e) => {
            setFormData({...formData, category: e.target.value});
            if (e.target.value === 'Custom...') {
              setCustomCategory('');
            }
          }} 
          style={inputStyle}
        >
          <option value="" disabled>Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Fashion">Fashion</option>
          <option value="Beauty">Beauty</option>
          <option value="Home">Home</option>
          <option value="Appliances">Appliances</option>
          <option value="Toys">Toys</option>
          <option value="Food">Food</option>
          <option value="Auto">Auto</option>
          <option value="Sports">Sports</option>
          <option value="Books">Books</option>
          <option value="Custom...">Other / Custom Category...</option>
        </select>

        {formData.category === 'Custom...' && (
          <input 
            type="text" 
            placeholder="Enter Custom Category Name" 
            required 
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)} 
            style={inputStyle} 
          />
        )}
        <input 
          type="number" placeholder="Stock Quantity" required 
          onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          style={inputStyle} 
        />
        <div style={{ padding: '15px', border: '1px dashed #f97316', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '600' }}>Discount & Promotion Percentage</label>
          <input 
            type="number" 
            placeholder="Discount Percentage (%) - e.g. 10 for 10% OFF" 
            min="0" 
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData({...formData, discount: e.target.value})} 
            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} 
          />
        </div>
        
        <div style={{ padding: '15px', border: '1px dashed #f97316', borderRadius: '8px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#a1a1aa' }}>Upload Product Image (Cloudinary)</label>
          <input 
            type="file" accept="image/*" required 
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ color: '#fff' }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none'
};

export default AddProduct;
