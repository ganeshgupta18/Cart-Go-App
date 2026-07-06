import React from 'react';

const About = () => {
  return (
    <div style={containerStyle}>
      {/* Hero Banner Section */}
      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>Our Journey</h1>
        <p style={heroSubStyle}>Evolving E-commerce with integrity, innovation, and elegance.</p>
      </div>

      {/* Main Content Grid */}
      <div className="about-grid">
        
        {/* Story Section */}
        <div style={cardStyle}>
          <h2 style={sectionHeaderStyle}>Who We Are</h2>
          <p style={paragraphStyle}>
            Founded in 2026, <strong>CartGo</strong> has quickly grown into a premier destination for high-quality electronics, modern designer furniture, and contemporary apparel. We connect discerning shoppers with carefully curated products, providing a fluid shopping experience backstopped by premium customer support.
          </p>
          <p style={paragraphStyle}>
            Our core mission is to democratize premium quality. By optimizing our supply chains and leveraging robust modern logistics, we offer designer-grade aesthetics and specs without the premium markups.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div style={cardStyle}>
          <h2 style={sectionHeaderStyle}>Mission & Vision</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h4 style={subHeaderStyle}>🚀 Our Mission</h4>
              <p style={{ ...paragraphStyle, margin: 0 }}>
                To curate and deliver elite consumer goods globally while creating a transparent, secure, and delightful experience for our community.
              </p>
            </div>
            <div>
              <h4 style={subHeaderStyle}>👁️ Our Vision</h4>
              <p style={{ ...paragraphStyle, margin: 0 }}>
                To set the benchmark for modern e-commerce through strict data security, eco-conscious distribution networks, and innovative visual store integration.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Core Values Section */}
      <h2 style={{ textSelf: 'center', color: '#fff', fontSize: '2rem', marginTop: '50px', marginBottom: '30px', textAlign: 'center' }}>
        Our Core Values
      </h2>
      
      <div style={valuesGridStyle}>
        <div style={valueCardStyle}>
          <div style={valueIconStyle}>🛡️</div>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Security First</h4>
          <p style={valueTextStyle}>End-to-end encrypted checkouts and robust multi-factor email verification ensure your transactions and details are safe.</p>
        </div>
        
        <div style={valueCardStyle}>
          <div style={valueIconStyle}>💡</div>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Constant Innovation</h4>
          <p style={valueTextStyle}>Constantly modernizing our stack to provide instant-load shopping portals, responsive administration dashboards, and easy checkout models.</p>
        </div>

        <div style={valueCardStyle}>
          <div style={valueIconStyle}>🤝</div>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Customer Centered</h4>
          <p style={valueTextStyle}>Our team is available round-the-clock. If you aren't completely satisfied, our return and refund policy is simple and fair.</p>
        </div>
      </div>

      {/* Corporate Social links */}
      <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '30px' }}>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '15px' }}>Stay connected with our corporate channels:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
          <a href="https://youtube.com/@shivanshvasu" target="_blank" rel="noreferrer" style={socialBtnStyle}>📺 Corporate Media</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={socialBtnStyle}>💼 Corporate LinkedIn</a>
          <a href="mailto:itsganesh1801@gmail.com" style={socialBtnStyle}>📧 Support Email</a>
        </div>
      </div>

    </div>
  );
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '0 20px',
  color: '#fafafa'
};

const heroStyle = {
  background: 'radial-gradient(circle at top right, rgba(249, 115, 22, 0.15), transparent 70%), linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  padding: '60px 40px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  textAlign: 'center',
  marginBottom: '40px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
};

const heroTitleStyle = {
  fontSize: '3rem',
  color: '#fff',
  marginBottom: '15px'
};

const heroSubStyle = {
  fontSize: '1.2rem',
  color: '#a1a1aa'
};



const cardStyle = {
  background: '#18181b',
  padding: '35px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.03)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
};

const sectionHeaderStyle = {
  color: '#f97316',
  fontSize: '1.8rem',
  marginBottom: '20px',
  borderBottom: '2px solid rgba(249, 115, 22, 0.15)',
  paddingBottom: '10px'
};

const subHeaderStyle = {
  color: '#fff',
  fontSize: '1.15rem',
  marginBottom: '8px',
  fontWeight: '600'
};

const paragraphStyle = {
  color: '#a1a1aa',
  fontSize: '1.05rem',
  lineHeight: '1.8',
  marginBottom: '20px'
};

const valuesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '25px'
};

const valueCardStyle = {
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center',
  transition: 'transform 0.3s ease, border-color 0.3s ease',
  cursor: 'default'
};

const valueIconStyle = {
  fontSize: '2.5rem',
  marginBottom: '15px'
};

const valueTextStyle = {
  color: '#a1a1aa',
  fontSize: '0.95rem',
  lineHeight: '1.6'
};

const socialBtnStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  background: '#18181b',
  color: '#d4d4d8',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '600',
  border: '1px solid rgba(255,255,255,0.05)',
  transition: 'all 0.3s ease'
};

export default About;
