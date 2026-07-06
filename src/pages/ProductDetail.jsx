import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useModal } from '../context/ModalContext';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/product/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const hasDiscount = product && product.discount > 0;
  const discountedPrice = product 
    ? (hasDiscount ? product.price * (1 - product.discount / 100) : product.price)
    : 0;

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: discountedPrice,
        imageUrl: product.imageUrl,
        qty: 1
      }));
      showAlert('Added to Cart', 'Successfully added to your cart!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/checkout', {
        state: {
          buyNowItem: {
            productId: product._id,
            name: product.name,
            price: discountedPrice,
            imageUrl: product.imageUrl,
            qty: 1
          }
        }
      });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Left Side: Image */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Right Side: Information Block */}
        <div className="detail-info">
          
          <h2 style={{ fontSize: '2.8rem', marginBottom: '5px' }}>{product.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>
              {product.ratings > 0 
                ? '★'.repeat(Math.round(product.ratings)) + '☆'.repeat(5 - Math.round(product.ratings))
                : '☆☆☆☆☆'}
            </span>
            <strong style={{ color: '#fff', fontSize: '1.1rem' }}>
              {product.ratings ? product.ratings.toFixed(1) : '0.0'}
            </strong>
            <span style={{ color: '#a1a1aa' }}>({product.numReviews || 0} customer reviews)</span>
          </div>

          {hasDiscount ? (
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'baseline', gap: '15px', flexWrap: 'wrap' }}>
              <span className="detail-price" style={{ fontSize: '2.8rem', fontWeight: '800', color: '#f97316' }}>
                ₹{discountedPrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '1.4rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                ₹{product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '1.1rem', color: '#22c55e', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                {product.discount}% OFF
              </span>
            </div>
          ) : (
            <p className="detail-price" style={{ fontSize: '2.5rem', margin: '15px 0' }}>₹{product.price.toFixed(2)}</p>
          )}

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: '#a1a1aa', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          {/* Cart & Stock Actions */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px', width: '100%' }}>
            <button onClick={handleAddToCart} className="btn" style={{ flex: '1', padding: '15px', fontSize: '1.1rem', background: '#3f3f46', boxShadow: 'none' }}>
              🛒 Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn" style={{ flex: '1', padding: '15px', fontSize: '1.1rem' }}>
              ⚡ Buy Now
            </button>
          </div>
          
          <p style={{ marginTop: '20px', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>

      {/* Product Reviews Section (Flipkart style) */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '50px', paddingTop: '30px' }}>
        <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '20px' }}>Customer Ratings & Reviews</h3>
        
        {reviews.length === 0 ? (
          <p style={{ color: '#a1a1aa', fontStyle: 'italic' }}>No reviews yet for this product. Be the first to buy and review it!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map((rev) => (
              <div key={rev._id} style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{rev.name}</strong>
                      <span style={{ color: '#71717a', fontSize: '0.8rem', marginLeft: '10px' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                    {'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                  </span>
                </div>
                
                <p style={{ color: '#d4d4d8', margin: '0 0 15px 0', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {rev.comment}
                </p>

                {rev.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={rev.image} 
                      alt="Customer upload" 
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', objectFit: 'contain', cursor: 'pointer' }}
                      onClick={() => {
                        const w = window.open();
                        w.document.write(`<img src="${rev.image}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
