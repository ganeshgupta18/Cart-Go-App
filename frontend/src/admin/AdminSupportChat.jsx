import React, { useState, useEffect, useRef, useCallback } from 'react';

const AdminSupportChat = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async (showLoading = false) => {
    if (!user) return;
    if (showLoading) setLoadingConvs(true);
    try {
      const res = await fetch('/api/chat/admin/conversations', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      if (showLoading) setLoadingConvs(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (userId, showLoading = false) => {
    if (!user || !userId) return;
    if (showLoading) setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/chat/messages/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      if (showLoading) setLoadingMsgs(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations(true);

    const interval = setInterval(() => {
      fetchConversations(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Handle active messages polling for selected user
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    fetchMessages(selectedUserId, true);

    const msgInterval = setInterval(() => {
      fetchMessages(selectedUserId, false);
    }, 2500);

    return () => clearInterval(msgInterval);
  }, [selectedUserId, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedUserId || sending) return;
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          receiverId: selectedUserId,
          message: replyMessage
        })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        setReplyMessage('');
        
        // Refresh conversations list to update last message snippet
        fetchConversations(false);
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '5px', marginTop: 0 }}>Support Live Chat</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '25px', fontSize: '14px' }}>Chat live with customers and resolve queries in real-time.</p>

      <div style={containerStyle}>
        {/* Left Side: Conversations List */}
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>Active Queries ({conversations.length})</div>
          <div style={sidebarListStyle}>
            {loadingConvs && conversations.length === 0 ? (
              <div style={emptyTextStyle}>Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div style={emptyTextStyle}>No active client queries.</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.userId}
                  onClick={() => {
                    setSelectedUserId(conv.userId);
                    setSelectedUserName(conv.name);
                    // Reset unread count locally instantly
                    setConversations(prev => prev.map(c => c.userId === conv.userId ? { ...c, unreadCount: 0 } : c));
                  }}
                  style={{
                    ...convItemStyle,
                    background: selectedUserId === conv.userId ? '#27272a' : 'transparent',
                    borderLeft: selectedUserId === conv.userId ? '4px solid #f97316' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{conv.name}</span>
                    <span style={{ fontSize: '10px', color: '#71717a' }}>
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={messageSnippetStyle}>{conv.lastMessage}</span>
                    {conv.unreadCount > 0 && (
                      <span style={unreadBadgeStyle}>{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div style={chatWindowStyle}>
          {selectedUserId ? (
            <>
              {/* Selected User Header */}
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={userAvatarCircleStyle}>
                    {selectedUserName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{selectedUserName}</h4>
                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Customer Chat Support</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={messagesAreaStyle}>
                {loadingMsgs ? (
                  <div style={emptyTextStyle}>Loading chat history...</div>
                ) : (
                  messages.map((msg) => {
                    const isAdminMsg = msg.senderId.toString() === user._id.toString();
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: 'flex',
                          justifyContent: isAdminMsg ? 'flex-end' : 'flex-start',
                          marginBottom: '15px',
                          width: '100%'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '10px 14px',
                            borderRadius: isAdminMsg ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: isAdminMsg ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : '#27272a',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            textAlign: 'left'
                          }}
                        >
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' }}>{msg.message}</p>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '9px',
                              color: isAdminMsg ? 'rgba(255,255,255,0.7)' : '#a1a1aa',
                              textAlign: 'right',
                              marginTop: '4px'
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

              {/* Chat Input */}
              <form onSubmit={handleSendReply} style={formStyle}>
                <input
                  type="text"
                  placeholder={`Write reply to ${selectedUserName}...`}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={inputStyle}
                  disabled={sending}
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  style={sendBtnStyle}
                >
                  {sending ? 'Sending' : 'Reply'}
                </button>
              </form>
            </>
          ) : (
            <div style={placeholderStyle}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '15px' }}>💬</span>
              <h3>No Conversation Selected</h3>
              <p style={{ color: '#71717a', fontSize: '13px' }}>Select an active query from the left list to start live messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styling
const containerStyle = {
  display: 'flex',
  flexGrow: 1,
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '16px',
  height: '520px',
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
  boxSizing: 'border-box'
};

const sidebarStyle = {
  width: '30%',
  borderRight: '1px solid #27272a',
  display: 'flex',
  flexDirection: 'column',
  background: '#121214',
  boxSizing: 'border-box'
};

const sidebarHeaderStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #27272a',
  color: '#f97316',
  fontWeight: '700',
  fontSize: '14.5px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'left'
};

const sidebarListStyle = {
  flexGrow: 1,
  overflowY: 'auto',
  boxSizing: 'border-box'
};

const convItemStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
  cursor: 'pointer',
  transition: 'background 0.2s',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left'
};

const messageSnippetStyle = {
  fontSize: '12.5px',
  color: '#a1a1aa',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '80%'
};

const unreadBadgeStyle = {
  background: '#ef4444',
  color: '#fff',
  fontSize: '10px',
  fontWeight: 'bold',
  borderRadius: '10px',
  padding: '2px 7px',
  lineHeight: '1'
};

const emptyTextStyle = {
  color: '#71717a',
  textAlign: 'center',
  padding: '30px 10px',
  fontSize: '13px'
};

const chatWindowStyle = {
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  background: '#09090b',
  boxSizing: 'border-box'
};

const chatHeaderStyle = {
  padding: '14px 20px',
  background: '#121214',
  borderBottom: '1px solid #27272a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const userAvatarCircleStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(249, 115, 22, 0.1)',
  color: '#f97316',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '15px'
};

const messagesAreaStyle = {
  flexGrow: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
};

const formStyle = {
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
  fontSize: '14px',
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
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const placeholderStyle = {
  margin: 'auto',
  textAlign: 'center',
  padding: '40px'
};

export default AdminSupportChat;
