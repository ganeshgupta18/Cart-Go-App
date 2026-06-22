import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.token) {
        try {
          const res = await fetch('/api/auth/wishlist', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setWishlist(Array.isArray(data) ? data : []);
          } else {
            setWishlist([]);
          }
        } catch (err) {
          console.error(err);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('userInfo');
  };

  const toggleWishlist = async (productId) => {
    if (!user || !user.token) return;
    try {
      const res = await fetch('/api/auth/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (res.ok) {
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};
