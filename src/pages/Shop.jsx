import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const categories = [
  { name: 'For You', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
  { name: 'Fashion', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l1.5 9a2 2 0 0 0 2 1.67H7v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4h1.22a2 2 0 0 0 2-1.67l1.5-9a2 2 0 0 0-1.34-2.23z"></path></svg> },
  { name: 'Mobiles', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
  { name: 'Beauty', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path></svg> },
  { name: 'Electronics', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg> },
  { name: 'Home', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { name: 'Appliances', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
  { name: 'Toys', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"></rect><path d="M12 8V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4h8V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"></path></svg> },
  { name: 'Food', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> },
  { name: 'Auto', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  { name: 'Sports', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a5 5 0 0 0-5 5v5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"></path></svg> },
  { name: 'Books', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"></path></svg> },
  { name: 'Furniture', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a3 3 0 0 0-3 3v4h18v-4a3 3 0 0 0-3-3zM4 17h16M7 17v3M17 17v3"></path></svg> }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategorySelect = (catName) => {
    if (catName === 'For You') {
      searchParams.delete('category');
    } else if (catName === 'Fashion') {
      searchParams.set('category', 'Clothing');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const isCatActive = (catName) => {
    const cat = selectedCategory.toLowerCase();
    if (catName === 'For You') return cat === 'all' || !searchParams.get('category');
    if (catName === 'Fashion') return cat === 'clothing';
    return cat === catName.toLowerCase();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(selectedSearch.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const pCat = p.category.toLowerCase();
      const sCat = selectedCategory.toLowerCase();
      
      if (sCat === 'clothing') {
        matchesCategory = pCat === 'clothing' || pCat === 'fashion';
      } else {
        matchesCategory = pCat === sCat;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Category Row with Icons (Matches Home page) */}
      <div className="category-row-container" style={{ margin: '-20px -20px 30px -20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="category-row">
          {categories.map((cat, idx) => {
            const active = isCatActive(cat.name);
            return (
              <div 
                key={idx} 
                className="category-item" 
                onClick={() => handleCategorySelect(cat.name)}
                style={{
                  background: active ? 'rgba(249, 115, 22, 0.04)' : 'transparent',
                }}
              >
                <div 
                  className="category-icon-wrapper"
                  style={{
                    color: active ? '#f97316' : '#a1a1aa',
                    borderColor: active ? 'rgba(249, 115, 22, 0.4)' : 'rgba(255,255,255,0.08)',
                    background: active ? 'rgba(249, 115, 22, 0.08)' : 'rgba(255,255,255,0.03)',
                    boxShadow: active ? '0 0 15px rgba(249, 115, 22, 0.25)' : 'none'
                  }}
                >
                  {cat.icon(active ? '#f97316' : 'currentColor')}
                </div>
                <span 
                  className="category-label"
                  style={{
                    color: active ? '#fff' : '#a1a1aa',
                    fontWeight: active ? 'bold' : '500'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        {selectedCategory !== 'All' ? `${selectedCategory} Products` : 'Explore Products'}
        {selectedSearch && <span style={{ fontSize: '1.2rem', color: '#a1a1aa', fontWeight: 'normal', marginLeft: '10px' }}>showing results for "{selectedSearch}"</span>}
      </h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#a1a1aa' }}>Loading product catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#a1a1aa' }}>No products found matching your search filters.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
