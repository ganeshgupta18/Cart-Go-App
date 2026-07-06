import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' or 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const showAlert = (title, message, onConfirm = null) => {
    setModalState({
      isOpen: true,
      type: 'alert',
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        closeModal();
      }
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modalState.isOpen && (
        <div style={overlayStyle} onClick={modalState.onCancel}>
          <div style={wrapperStyle} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtnStyle} onClick={modalState.onCancel}>×</button>
            <div style={{ padding: '25px', textAlign: 'center' }}>
              {modalState.type === 'confirm' ? (
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>❓</span>
              ) : (
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>ℹ️</span>
              )}
              <h3 style={{ margin: '0 0 10px', fontSize: '1.5rem', color: '#fff', fontWeight: '700' }}>{modalState.title}</h3>
              <p style={{ margin: '0 0 25px', color: '#a1a1aa', fontSize: '14.5px', lineHeight: '1.5' }}>{modalState.message}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                {modalState.type === 'confirm' && (
                  <button 
                    onClick={modalState.onCancel} 
                    style={cancelBtnStyle}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={modalState.onConfirm} 
                  style={confirmBtnStyle}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

// Styling
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(9, 9, 11, 0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 11000
};

const wrapperStyle = {
  background: '#121214',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
  position: 'relative',
  overflow: 'hidden'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: 'none',
  color: '#a1a1aa',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '16px',
  fontWeight: 'bold'
};

const confirmBtnStyle = {
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  color: '#fff',
  padding: '10px 24px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
};

const cancelBtnStyle = {
  background: 'transparent',
  color: '#a1a1aa',
  padding: '10px 24px',
  border: '1px solid #27272a',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};
