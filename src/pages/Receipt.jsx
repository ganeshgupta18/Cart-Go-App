import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/receipt.css';

const Receipt = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setError('Please log in to view this receipt.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const found = data.find(o => o._id === orderId);
          if (found) {
            setOrder(found);
          } else {
            setError('Receipt not found, or you do not have permission to view it.');
          }
        } else {
          setError('Failed to fetch order history.');
        }
      } catch (err) {
        console.error(err);
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="receipt-page-container">
        <div style={{ color: '#a1a1aa', fontSize: '1.2rem', marginTop: '100px' }}>
          Generating receipt preview...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="receipt-page-container">
        <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '100px' }}>
          <h3>⚠️ Error</h3>
          <p>{error || 'An unexpected error occurred.'}</p>
          <Link to="/profile" className="receipt-back-link" style={{ marginTop: '20px' }}>
            &larr; Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  // Financial calculations
  const rawTotal = order.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = Math.max(0, rawTotal - (order.totalAmount - order.deliveryCharge));
  const discountPercent = rawTotal > 0 ? Math.round((discountAmount / rawTotal) * 100) : 0;

  return (
    <div className="receipt-page-container">
      {/* Action Bar (Hidden during printing) */}
      <div className="receipt-action-bar">
        <Link to="/profile" className="receipt-back-link">
          <span>&larr;</span> Back to Profile
        </Link>
        <button onClick={handlePrint} className="receipt-download-btn">
          <span>📥</span> Download / Print Receipt
        </button>
      </div>

      {/* Invoice Card */}
      <div className="receipt-card">
        {/* Header: Company and Receipt Metadata */}
        <div className="receipt-header">
          <div className="company-branding">
            <img src="/CartGoLogoCircle.png" alt="CartGo" className="company-logo" />
            <div className="company-info">
              <h1 className="company-name">CartGo</h1>
              <p className="company-address">
                CartGo Corporate Office<br />
                Sector 62, Noida, UP, 201301<br />
                India
              </p>
            </div>
          </div>
          <div className="receipt-meta">
            <h2 className="receipt-title">Invoice</h2>
            <p className="receipt-meta-item">Order ID: <span>{order._id}</span></p>
            <p className="receipt-meta-item">Date: <span>{new Date(order.createdAt).toLocaleDateString()}</span></p>
            <p className="receipt-meta-item">Status: <span>{order.status}</span></p>
            <p className="receipt-meta-item">Method: <span>COD (Cash on Delivery)</span></p>
          </div>
        </div>

        {/* Billing & User Details Section */}
        <div className="receipt-details-section">
          <div className="details-block">
            <h4>Billed To</h4>
            <p><strong>{order.address.fullName}</strong></p>
            {user && <p>Email: {user.email}</p>}
          </div>
          <div className="details-block">
            <h4>Shipping Address</h4>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.postalCode}</p>
            <p>{order.address.country}</p>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="receipt-table-wrapper">
          <table className="receipt-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Item Description</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Unit Price</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const prodName = item.productId ? item.productId.name : 'Unknown Product';
                return (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontWeight: '600' }}>{prodName}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>₹{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Details: Subtotal, Discount, Delivery, Grand Total */}
        <div className="receipt-summary-section">
          <table className="receipt-summary-table">
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td className="amount">₹{rawTotal.toFixed(2)}</td>
              </tr>
              {discountAmount > 0 && (
                <tr className="discount-row">
                  <td>Discount ({discountPercent}%):</td>
                  <td className="amount">-₹{discountAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td>Delivery Charge:</td>
                <td className="amount">
                  {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}
                </td>
              </tr>
              <tr className="total-row">
                <td>Grand Total:</td>
                <td className="amount">₹{order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
