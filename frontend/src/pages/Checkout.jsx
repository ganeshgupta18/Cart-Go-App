import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { useModal } from '../context/ModalContext';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { showAlert, showConfirm } = useModal();

  // Buy Now support
  const buyNowItem = routerLocation.state?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const savedDiscount = localStorage.getItem('cartDiscount');
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedDiscount && savedCoupon) {
      setDiscount(parseFloat(savedDiscount));
      setAppliedCoupon(savedCoupon);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const checkFirstOrder = async () => {
        try {
          const res = await fetch('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setIsFirstOrder(Array.isArray(data) && data.length === 0);
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkFirstOrder();
    }
  }, [user]);

  const rawTotal = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = rawTotal * discount;
  const subtotal = rawTotal - discountAmount;

  // Delivery charge logic: ₹49 standard, FREE if first order OR subtotal >= ₹499
  const isDeliveryFree = isFirstOrder || subtotal >= 499;
  const deliveryCharge = isDeliveryFree ? 0 : 49;
  const totalPrice = subtotal + deliveryCharge;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Location Error", "Geolocation is not supported by your browser");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const streetVal = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || "";
            const cityVal = addr.city || addr.town || addr.village || addr.state_district || "";
            const postcodeVal = addr.postcode || "";
            const countryVal = addr.country || "";
            
            setAddress(prev => ({
              ...prev,
              fullName: prev.fullName || user?.name || '',
              street: streetVal,
              city: cityVal,
              postalCode: postcodeVal,
              country: countryVal
            }));
            showAlert("Location Success", "Shipping address auto-filled successfully!");
          } else {
            showAlert("Location Error", "Could not reverse geocode your coordinates.");
          }
        } catch (err) {
          console.error(err);
          showAlert("Location Error", "Error reverse geocoding location coordinates.");
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        setLocLoading(false);
        showAlert("Location Error", "Location permission denied or unavailable.");
      }
    );
  };

  const placeCodOrder = async () => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: checkoutItems.map(item => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price
        })),
        totalAmount: totalPrice,
        address,
        paymentId: 'COD_' + Date.now(),
        deliveryCharge,
        deliveryDate
      })
    });
    if (saveOrderRes.ok) {
      localStorage.removeItem('cartDiscount');
      localStorage.removeItem('appliedCoupon');
      if (!buyNowItem) {
        dispatch(clearCart());
      }
      showAlert('Order Confirmed', 'Your order has been placed successfully via Cash on Delivery (COD)!', () => {
        navigate('/ordersuccess');
      });
    } else {
      showAlert('Order Error', 'Order saving failed');
    }
  };

  const confirmCodOrder = () => {
    showConfirm(
      'Confirm Order (Cash on Delivery)',
      `Your total is ₹${totalPrice.toFixed(2)}. Do you want to place this order using Cash on Delivery (COD)?`,
      () => {
        placeCodOrder();
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showAlert("Login Required", "Please login first", () => {
        navigate('/login');
      });
      return;
    }
    confirmCodOrder();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Shipping Address</h3>
            <button 
              type="button" 
              onClick={handleAutofillLocation} 
              disabled={locLoading}
              className="btn" 
              style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)', boxShadow: 'none' }}
            >
              {locLoading ? '📍 Fetching...' : '📍 Use Current Location'}
            </button>
          </div>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          
          <div className="checkout-summary" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #27272a', paddingTop: '15px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '14px' }}>
              <span>Items Total:</span>
              <span>₹{rawTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', fontSize: '14px' }}>
                <span>Coupon ({appliedCoupon}):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '14px' }}>
              <span>Delivery Charge:</span>
              <span style={{ color: deliveryCharge === 0 ? '#22c55e' : '#fff', fontWeight: deliveryCharge === 0 ? '600' : 'normal' }}>
                {deliveryCharge === 0 
                  ? (isFirstOrder ? 'FREE (First Order)' : 'FREE (Over ₹499)') 
                  : `₹${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', color: '#fff', marginTop: '5px' }}>
              <span>Total to Pay:</span>
              <span style={{ color: '#f97316' }}>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%' }}>Place Order (Cash on Delivery)</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
