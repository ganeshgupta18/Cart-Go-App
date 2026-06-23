import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const predefinedCategories = ['Electronics', 'Furniture', 'Clothing', 'Mobiles', 'Fashion', 'Beauty', 'Home', 'Appliances', 'Toys', 'Food', 'Auto', 'Sports', 'Books'];

const EditProduct = ({ productId, onSuccess }) => {
  const { id: routeId } = useParams();
  const id = productId || routeId;
  const { user } = useContext(AuthContext);
  const { showAlert } = useModal();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', discount: 0 });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      const isPredefined = predefinedCategories.some(cat => cat.toLowerCase() === data.category.toLowerCase());
      if (isPredefined) {
        setFormData({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock, discount: data.discount || 0 });
      } else {
        setFormData({ name: data.name, description: data.description, price: data.price, category: 'Custom...', stock: data.stock, discount: data.discount || 0 });
        setCustomCategory(data.category);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category === 'Custom...' ? customCategory : formData.category);
    data.append('stock', formData.stock);
    data.append('discount', formData.discount || 0);
    if (image) data.append('image', image);

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data
    });
    setLoading(false);
    if (res.ok) {
      showAlert('Success', 'Product updated successfully!', () => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/products');
        }
      });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: '#18181b', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Edit Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Product Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <textarea placeholder="Description" required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Price" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} />
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
        <input type="number" placeholder="Stock" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
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
          <label style={{ display: 'block', marginBottom: '10px', color: '#a1a1aa' }}>Replace Image (Optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ color: '#fff' }} />
        </div>
        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = { padding: '12px', background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' };
export default EditProduct;
