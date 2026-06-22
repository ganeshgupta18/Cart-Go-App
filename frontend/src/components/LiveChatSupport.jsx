import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LiveChatSupport = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (showLoading = false) => {
    if (!user) return;
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/chat/messages/admin', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMessages(true);

    // Setup live chat polling every 3 seconds
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [user]);

  // Auto-scroll to bottom whenever messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !user || sending) return;
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ message: typedMessage })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        setTypedMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div style={chatContainerStyle}>
      <div style={chatHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={avatarStyle}>💬</span>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 'bold' }}>Live Support Chat</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#10b981' }}>● Support Online (Connected with Admin)</p>
          </div>
        </div>
      </div>

      <div style={messagesAreaStyle}>
        {loading ? (
          <div style={statusMessageStyle}>Loading support session...</div>
        ) : messages.length === 0 ? (
          <div style={statusMessageStyle}>
            👋 Hello {user.name}! Welcome to CartGo Support.<br/>
            Have a question or query? Send us a message below and an administrator will reply to you shortly.
          </div>
        ) : (
          messages.map((msg) => {
            const isAdminMsg = msg.senderId.toString() !== user._id.toString();
            return (
              <div
                key={msg._id}
                style={{
                  display: 'flex',
                  justifyContent: isAdminMsg ? 'flex-start' : 'flex-end',
                  marginBottom: '15px',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: isAdminMsg ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: isAdminMsg ? '#27272a' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    textAlign: 'left'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.5', wordBreak: 'break-word' }}>{msg.message}</p>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '9.5px',
                      color: isAdminMsg ? '#a1a1aa' : 'rgba(255,255,255,0.7)',
                      textAlign: 'right',
                      marginTop: '5px'
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={chatFormStyle}>
        <input
          type="text"
          placeholder="Ask anything about orders, refunds, coupons..."
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          required
          style={inputStyle}
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !typedMessage.trim()}
          style={sendBtnStyle}
        >
          {sending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

// Styling
const chatContainerStyle = {
  background: '#09090b',
  borderRadius: '16px',
  border: '1px solid #27272a',
  display: 'flex',
  flexDirection: 'column',
  height: '500px',
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
  width: '100%',
  boxSizing: 'border-box'
};

const chatHeaderStyle = {
  padding: '16px 20px',
  background: '#121214',
  borderBottom: '1px solid #27272a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const avatarStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'rgba(249, 115, 22, 0.1)',
  color: '#f97316',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px'
};

const messagesAreaStyle = {
  flexGrow: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  background: '#09090b',
  boxSizing: 'border-box'
};

const statusMessageStyle = {
  textAlign: 'center',
  color: '#71717a',
  fontSize: '13.5px',
  lineHeight: '1.6',
  margin: 'auto 20px',
  padding: '20px'
};

const chatFormStyle = {
  display: 'flex',
  gap: '12px',
  padding: '16px',
  background: '#121214',
  borderTop: '1px solid #27272a',
  boxSizing: 'border-box'
};

const inputStyle = {
  flexGrow: 1,
  padding: '12px 18px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '25px',
  color: '#fff',
  fontSize: '14.5px',
  outline: 'none',
  boxSizing: 'border-box'
};

const sendBtnStyle = {
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  color: '#fff',
  border: 'none',
  padding: '0 24px',
  borderRadius: '25px',
  fontWeight: 'bold',
  fontSize: '14.5px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default LiveChatSupport;
