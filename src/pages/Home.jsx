import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useModal } from '../context/ModalContext';

const categories = [
  { name: 'For You', path: '/shop', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
  { name: 'Fashion', path: '/shop?category=Clothing', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l1.5 9a2 2 0 0 0 2 1.67H7v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4h1.22a2 2 0 0 0 2-1.67l1.5-9a2 2 0 0 0-1.34-2.23z"></path></svg> },
  { name: 'Mobiles', path: '/shop?category=Mobiles', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
  { name: 'Beauty', path: '/shop?category=Beauty', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path></svg> },
  { name: 'Electronics', path: '/shop?category=Electronics', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg> },
  { name: 'Home', path: '/shop?category=Home', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { name: 'Appliances', path: '/shop?category=Appliances', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
  { name: 'Toys', path: '/shop?category=Toys', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"></rect><path d="M12 8V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4h8V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"></path></svg> },
  { name: 'Food', path: '/shop?category=Food', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> },
  { name: 'Auto', path: '/shop?category=Auto', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  { name: 'Sports', path: '/shop?category=Sports', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a5 5 0 0 0-5 5v5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"></path></svg> },
  { name: 'Books', path: '/shop?category=Books', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"></path></svg> },
  { name: 'Furniture', path: '/shop?category=Furniture', icon: (color) => <svg viewBox="0 0 24 24" width="20" height="20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a3 3 0 0 0-3 3v4h18v-4a3 3 0 0 0-3-3zM4 17h16M7 17v3M17 17v3"></path></svg> }
];

const slides = [
  {
    tag: 'WELCOME OFFER',
    title: 'Flat 30% Off On Your First Order',
    subtitle: 'Verify your email and use coupon code WELCOME30 at checkout!',
    btnText: 'Shop Now',
    path: '/shop',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800&h=320',
    tabletImg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500&h=300',
    mobileImg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=200&h=200'
  },
  {
    tag: 'ELECTRONICS SUPER SALE',
    title: 'Up To 40% Off Premium Tech',
    subtitle: 'Elevate your audio shelf with top-tier active noise-cancelling headphones.',
    btnText: 'Explore Tech',
    path: '/shop?category=Electronics',
    bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800&h=320',
    tabletImg: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500&h=300',
    mobileImg: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=200&h=200'
  },
  {
    tag: 'MODERN COMFORT',
    title: 'Luxury Furniture Up To 25% Off',
    subtitle: 'Upgrade your living space with our minimalist chairs and design classics.',
    btnText: 'Browse Furniture',
    path: '/shop?category=Furniture',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #431407 100%)',
    img: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800&h=320',
    tabletImg: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500&h=300',
    mobileImg: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=200&h=200'
  },
  {
    tag: 'STYLE & APPAREL',
    title: 'Fresh Fashion Trends Unleashed',
    subtitle: 'Step into comfort with free shipping and zero-cost return window.',
    btnText: 'Shop Apparel',
    path: '/shop?category=Clothing',
    bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800&h=320',
    tabletImg: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500&h=300',
    mobileImg: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=200&h=200'
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [appReviews, setAppReviews] = useState([]);
  const { showAlert } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppReviews = async () => {
      try {
        const res = await fetch('/api/reviews/app');
        if (res.ok) {
          const data = await res.json();
          setAppReviews(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppReviews();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Featured products
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: '-40px -20px' }}>
      
      {/* Category Bar */}
      <div className="category-row-container">
        <div className="category-row">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-item" onClick={() => navigate(cat.path)}>
              <div className="category-icon-wrapper">
                {cat.icon('currentColor')}
              </div>
              <span className="category-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Slider */}
      <div className="deals-slider-section">
        <div className="deals-slider">
          <div className="deals-slides-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, idx) => (
              <div key={idx} className="deal-slide" style={{ background: slide.bg }}>
                <div className="deal-slide-content">
                  <span className="deal-tag">{slide.tag}</span>
                  <h2 className="deal-title">{slide.title}</h2>
                  <p className="deal-subtitle">{slide.subtitle}</p>
                  <button className="deal-btn" onClick={() => navigate(slide.path)}>{slide.btnText}</button>
                </div>
                <div className="deal-slide-image">
                  <picture>
                    <source media="(max-width: 576px)" srcSet={slide.mobileImg} />
                    <source media="(max-width: 992px)" srcSet={slide.tabletImg} />
                    <img src={slide.img} alt={slide.title} />
                  </picture>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-arrow left" onClick={prevSlide}>&larr;</button>
          <button className="slider-arrow right" onClick={nextSlide}>&rarr;</button>
          <div className="slider-dots">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section style={{ ...sectionStyle, background: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15), transparent 50%), #09090b' }}>
        <div style={heroContentStyle}>
          <div style={badgeStyle}>✨ Next-Generation E-Commerce</div>
          <h1 className="hero-title">
            Elevate Your Retail Experience with <span style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CartGo</span>
          </h1>
          <p className="hero-subtitle">
            Discover an elite collection of electronics, furniture, and clothing, designed for maximum elegance and functionality.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Browse Catalog</Link>
            <Link to="/about" style={{ display: 'inline-block', padding: '16px 36px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section style={{ ...sectionStyle, background: '#121214' }}>
        <div style={wideContentStyle}>
          <div style={sectionHeadingStyle}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Curated Selections</span>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginTop: '10px' }}>Featured Products</h2>
          </div>
          {loading ? (
            <div style={{ color: '#a1a1aa', textAlign: 'center', fontSize: '1.2rem', padding: '100px 0' }}>Loading products shelf...</div>
          ) : (
            <div className="product-grid" style={{ marginTop: '20px' }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/shop" className="btn" style={{ padding: '12px 30px' }}>View All Products</Link>
          </div>
        </div>
      </section>

      {/* 3. Product Categories Section */}
      <section style={{ ...sectionStyle, background: '#09090b' }}>
        <div style={wideContentStyle}>
          <div style={sectionHeadingStyle}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Handpicked Classes</span>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginTop: '10px' }}>Browse Categories</h2>
          </div>
          <div style={categoriesGridStyle}>
            <div style={{ ...catCardStyle, backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600)' }}>
              <div style={catInfoStyle}>
                <h3>Electronics</h3>
                <p>Pro audio, gadgets & gear.</p>
                <Link to="/shop" style={catLinkStyle}>Explore &rarr;</Link>
              </div>
            </div>
            
            <div style={{ ...catCardStyle, backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600)' }}>
              <div style={catInfoStyle}>
                <h3>Furniture</h3>
                <p>Modern luxury comfort.</p>
                <Link to="/shop" style={catLinkStyle}>Explore &rarr;</Link>
              </div>
            </div>

            <div style={{ ...catCardStyle, backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600)' }}>
              <div style={catInfoStyle}>
                <h3>Clothing</h3>
                <p>Casual footwear & apparel.</p>
                <Link to="/shop" style={catLinkStyle}>Explore &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Seasonal Promotions Section */}
      <section style={{ ...sectionStyle, background: 'radial-gradient(circle at bottom left, rgba(249, 115, 22, 0.12), transparent 50%), #121214' }}>
        <div className="promo-card">
          <div className="promo-card-col">
            <span style={{ background: '#f97316', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>LIMITED TIME OFFER</span>
            <h2 className="promo-title">Enjoy 30% Off on your first order</h2>
            <p style={{ color: '#d4d4d8', fontSize: '1.2rem', margin: '20px 0 30px 0', lineHeight: '1.6' }}>
              Apply code WELCOME30 at the shopping cart to unlock a welcome discount of flat 30%!
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#09090b', border: '1px dashed #f97316', padding: '10px 20px', borderRadius: '8px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginRight: '10px' }}>CODE:</span>
              <strong style={{ color: '#f97316', fontSize: '1.2rem', letterSpacing: '1px' }}>WELCOME30</strong>
            </div>
          </div>
          <div className="promo-card-col" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="Special Offer" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
          </div>
        </div>
      </section>

      {/* 5. Company Pitch / Core Philosophy Section */}
      <section style={{ ...sectionStyle, background: '#09090b' }}>
        <div className="promo-card">
          <div className="promo-card-col" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="About Company" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
          </div>
          <div className="promo-card-col">
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px' }}>OUR PHILOSOPHY</span>
            <h2 className="philosophy-title">Engineering a Higher Standard of Retail</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '25px' }}>
              At CartGo, we believe shopping is more than transactional. We view it as an investment in your lifestyle. Our items are hand-selected, scrutinized for material excellence, and verified to meet strict standards before arriving at your doorstep.
            </p>
            <Link to="/about" className="btn" style={{ padding: '12px 28px' }}>Read Our Story</Link>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section style={{ ...sectionStyle, background: '#121214' }}>
        <div style={wideContentStyle}>
          <div style={sectionHeadingStyle}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Uncompromising Service</span>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginTop: '10px' }}>Why Shop With Us</h2>
          </div>
          <div style={featuresGridStyle}>
            <div style={featureCardStyle}>
              <div style={featureIconStyle}>🚚</div>
              <h3>Free Shipping</h3>
              <p>On all domestic orders with no minimum checkout value required.</p>
            </div>
            
            <div style={featureCardStyle}>
              <div style={featureIconStyle}>💵</div>
              <h3>Cash on Delivery</h3>
              <p>Pay with cash or UPI on delivery. No advance online payment needed!</p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>📞</div>
              <h3>24/7 Support</h3>
              <p>Always online. Speak to human specialists for instant resolution.</p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>🔄</div>
              <h3>Easy Returns</h3>
              <p>Simple 30-day exchange window with zero return shipping costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Statistics Section */}
      <section style={{ ...sectionStyle, background: 'radial-gradient(circle at top right, rgba(249, 115, 22, 0.1), transparent 50%), #09090b' }}>
        <div style={wideContentStyle}>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <h2>50K+</h2>
              <p>Successful Deliveries</p>
            </div>
            
            <div style={statCardStyle}>
              <h2>120+</h2>
              <p>Premium Brands</p>
            </div>

            <div style={statCardStyle}>
              <h2>4.9</h2>
              <p>Star Customer Rating</p>
            </div>

            <div style={statCardStyle}>
              <h2>99.9%</h2>
              <p>Secure Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section style={{ ...sectionStyle, background: '#121214' }}>
        <div style={wideContentStyle}>
          <div style={sectionHeadingStyle}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Customer Feedback</span>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginTop: '10px' }}>What Our Clients Say</h2>
          </div>
          <div style={testimonialsGridStyle}>
            {appReviews.length > 0 ? (
              appReviews.slice(0, 6).map((rev) => (
                <div key={rev._id} style={testimonialCardStyle}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', color: '#f59e0b', fontSize: '15px' }}>
                    {'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                  </div>
                  <p style={quoteStyle}>"{rev.comment}"</p>
                  <div style={authorStyle}>
                    <strong style={{ color: '#fff' }}>{rev.name}</strong>
                    <span style={{ color: '#71717a', fontSize: '12px' }}>Verified Customer</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div style={testimonialCardStyle}>
                  <p style={quoteStyle}>"The headphones arrived in two days! Extreme noise cancellation, beautiful packing. Definitely shopping here again!"</p>
                  <div style={authorStyle}>
                    <strong>Amit Sharma</strong>
                    <span>Verified Buyer</span>
                  </div>
                </div>
                
                <div style={testimonialCardStyle}>
                  <p style={quoteStyle}>"Ordered a minimalist modern chair. Absolute masterpiece. Solid wood, and fits beautifully in my living room."</p>
                  <div style={authorStyle}>
                    <strong>Priyah Patel</strong>
                    <span>Interior Designer</span>
                  </div>
                </div>
    
                <div style={testimonialCardStyle}>
                  <p style={quoteStyle}>"Excellent email verification flow and checkout was instantaneous. Support answered my shipment question in 5 minutes."</p>
                  <div style={authorStyle}>
                    <strong>Rajesh Kumar</strong>
                    <span>Software Architect</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 9. Partner Brands Showcase Section */}
      <section style={{ ...sectionStyle, background: '#09090b', minHeight: '50vh' }}>
        <div style={wideContentStyle}>
          <div style={sectionHeadingStyle}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Elite Relations</span>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginTop: '10px', marginBottom: '40px' }}>Our Brand Partners</h2>
          </div>
          <div style={brandsGridStyle}>
            <div style={brandBadgeStyle}>APPLE</div>
            <div style={brandBadgeStyle}>SAMSUNG</div>
            <div style={brandBadgeStyle}>IKEA</div>
            <div style={brandBadgeStyle}>NIKE</div>
            <div style={brandBadgeStyle}>SONY</div>
          </div>
        </div>
      </section>

      {/* 10. Newsletter Call-To-Action Section */}
      <section style={{ ...sectionStyle, background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
          <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px' }}>NEWSLETTER</span>
          <h2 style={{ color: '#fff', fontSize: '3rem', margin: '20px 0', fontWeight: '800' }}>Stay in the Loop</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '35px' }}>
            Subscribe to our newsletter for exclusive coupons, early collection releases, and modern lifestyle tips.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); showAlert('Subscription Success', 'Subscribed successfully!'); }} style={newsletterFormStyle}>
            <input type="email" placeholder="Enter your email" required style={newsletterInputStyle} />
            <button type="submit" className="btn" style={{ padding: '12px 30px', whiteSpace: 'nowrap' }}>Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  );
};

/* Component Styles */
const sectionStyle = {
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '80px 20px',
  boxSizing: 'border-box',
  borderBottom: '1px solid rgba(255, 255, 255, 0.02)'
};

const heroContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 40px'
};

const badgeStyle = {
  background: 'rgba(249, 115, 22, 0.1)',
  color: '#f97316',
  padding: '6px 14px',
  borderRadius: '20px',
  fontWeight: 'bold',
  fontSize: '0.85rem',
  marginBottom: '25px',
  border: '1px solid rgba(249, 115, 22, 0.2)'
};

const wideContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  padding: '0 20px'
};

const sectionHeadingStyle = {
  textAlign: 'center',
  marginBottom: '50px'
};

const categoriesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const catCardStyle = {
  height: '350px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'flex-end',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease'
};

const catInfoStyle = {
  padding: '30px',
  width: '100%',
  color: '#fff',
  background: 'linear-gradient(to top, rgba(9,9,11,0.95) 40%, transparent)'
};

const catLinkStyle = {
  color: '#f97316',
  fontWeight: 'bold',
  marginTop: '15px',
  display: 'inline-block'
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '25px'
};

const featureCardStyle = {
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center',
  transition: 'all 0.3s ease'
};

const featureIconStyle = {
  fontSize: '2.5rem',
  marginBottom: '15px'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '30px',
  width: '100%',
  textAlign: 'center'
};

const statCardStyle = {
  background: 'rgba(24, 24, 27, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: '12px',
  padding: '40px 20px',
  backdropFilter: 'blur(8px)'
};

const testimonialsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px'
};

const testimonialCardStyle = {
  background: '#09090b',
  borderRadius: '12px',
  padding: '35px',
  border: '1px solid #27272a',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
};

const quoteStyle = {
  color: '#d4d4d8',
  fontSize: '1.05rem',
  lineHeight: '1.7',
  fontStyle: 'italic',
  marginBottom: '20px'
};

const authorStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const brandsGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px'
};

const brandBadgeStyle = {
  fontSize: '1.8rem',
  fontWeight: '800',
  color: '#27272a',
  letterSpacing: '2px',
  transition: 'color 0.2s',
  cursor: 'default'
};

const newsletterFormStyle = {
  display: 'flex',
  gap: '15px',
  background: '#121214',
  padding: '8px',
  borderRadius: '12px',
  border: '1px solid #27272a',
  maxWidth: '500px',
  margin: '0 auto'
};

const newsletterInputStyle = {
  flex: 1,
  padding: '12px 15px',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontSize: '1rem'
};

export default Home;
