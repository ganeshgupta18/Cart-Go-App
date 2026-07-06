import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerGridStyle}>

        {/* Brand Section */}
        <div style={colStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <img src="/CartGoLogoCircle.png" alt="CartGo" style={logoStyle} />
            <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: 0 }}>CartGo</h3>
          </div>
          <p style={descStyle}>Experience next-generation retail with hand-picked premium items and seamless secure checkouts.</p>
        </div>

        {/* Navigation Section */}
        <div style={colStyle}>
          <h4 style={headerStyle}>Navigation</h4>
          <ul style={listStyle}>
            <li><Link to="/shop" style={linkStyle}>Shop Products</Link></li>
            <li><Link to="/about" style={linkStyle}>About Our Company</Link></li>
            <li><Link to="/contact" style={linkStyle}>Contact Support</Link></li>
          </ul>
        </div>

        {/* Policies Section */}
        <div style={colStyle}>
          <h4 style={headerStyle}>Legal & Policy</h4>
          <ul style={listStyle}>
            <li><Link to="/return" style={linkStyle}>Return & Refund Policy</Link></li>
            <li><Link to="/disclaimer" style={linkStyle}>Disclaimer Notice</Link></li>
          </ul>
        </div>

        {/* Corporate Section */}
        <div style={colStyle}>
          <h4 style={headerStyle}>Corporate Info</h4>
          <p style={corpTextStyle}>🏢 Tedhi Puliya, Lucknow, UP, India</p>
          <p style={corpTextStyle}>📧 itsganesh1801@gmail.com</p>
          <p style={corpTextStyle}>📞 +91 7398250664</p>
        </div>

      </div>

      <div style={bottomRowStyle}>
        <div>&copy; {new Date().getFullYear()} CartGo E-Commerce Company. All rights reserved.</div>
        <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Developed and Designed By Ganesh Gupta</div>
      </div>
    </footer>
  );
};

const footerStyle = {
  background: '#09090b',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '60px 40px 30px 40px',
  marginTop: '60px'
};

const footerGridStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '40px',
  paddingBottom: '40px',
  borderBottom: '1px solid rgba(255,255,255,0.05)'
};

const colStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const logoStyle = {
  height: '32px',
  width: '32px',
  borderRadius: '50%',
  objectFit: 'cover'
};

const descStyle = {
  color: '#a1a1aa',
  fontSize: '0.9rem',
  lineHeight: '1.6',
  margin: 0
};

const headerStyle = {
  color: '#f97316',
  fontSize: '1.05rem',
  fontWeight: '600',
  marginBottom: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const linkStyle = {
  color: '#a1a1aa',
  fontSize: '0.9rem',
  textDecoration: 'none',
  transition: 'color 0.2s'
};

const corpTextStyle = {
  color: '#a1a1aa',
  fontSize: '0.9rem',
  margin: '0 0 10px 0',
  lineHeight: '1.4'
};

const bottomRowStyle = {
  maxWidth: '1200px',
  margin: '25px auto 0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#71717a',
  fontSize: '0.85rem',
  flexWrap: 'wrap',
  gap: '15px'
};

export default Footer;
