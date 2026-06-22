import React, { useState } from 'react';
import '../styles/auth.css'; // Reuse container/form styles for design consistency

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || 'Thank you! Your message was sent successfully.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '80vh', flexDirection: 'column', gap: '20px' }}>
      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', textAlign: 'center', marginBottom: '5px' }}>Contact Us</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', textAlign: 'center', marginBottom: '20px' }}>
          Have questions or feedback? Drop us a line.
        </p>

        {successMsg && <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>{successMsg}</div>}
        {errorMsg && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>{errorMsg}</div>}

        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          style={{
            padding: '15px',
            background: '#09090b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />

        <button type="submit" className="btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Sending Message...' : 'Send Message'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', color: '#a1a1aa', fontSize: '0.9rem', marginTop: '10px' }}>
        <p>🏬 CartGo Corporate Office: Sector 62, Noida, UP, India</p>
        <p>📞 Phone support: +91 99999-99999 (Mon-Sat, 9AM-6PM)</p>
      </div>
    </div>
  );
};

export default Contact;
