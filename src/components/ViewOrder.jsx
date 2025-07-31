import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import {
  collection, addDoc, Timestamp, doc, getDoc, setDoc
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faMinus, faArrowLeft, faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';

function ViewOrder() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('selectedItems')) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem('selectedItems', JSON.stringify(updated));
  };

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const metaRef = doc(db, 'meta', 'token');
      const metaSnap = await getDoc(metaRef);

      let tokenNumber = 1;
      if (metaSnap.exists()) {
        const metaData = metaSnap.data();
        if (metaData.today === today) {
          tokenNumber = metaData.lastToken + 1;
        }
        await setDoc(metaRef, { today, lastToken: tokenNumber });
      } else {
        await setDoc(metaRef, { today, lastToken: tokenNumber });
      }

      const orderId = `ORD-${today.replace(/-/g, '')}-${String(tokenNumber).padStart(3, '0')}`;
      const total = calculateTotal();

      const billData = {
        items: cart,
        total,
        createdAt: Timestamp.now(),
        tokenNumber,
        orderId
      };

      await addDoc(collection(db, 'bills'), billData);
      localStorage.setItem('latestBill', JSON.stringify({ ...billData, createdAt: Date.now() }));
      navigate('/qr-payment');
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="container py-4 position-relative" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <h3 className="mb-4">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="me-2"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        />
        Review Your Order
      </h3>

      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="card mb-3 shadow-sm animate__animated animate__fadeIn">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src="https://via.placeholder.com/60"
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <h5 className="card-title mb-1">{item.name}</h5>
                    <p className="text-muted mb-1 small">₹{item.price} × {item.quantity}</p>
                    <p className="fw-semibold mb-0">Subtotal: ₹{item.price * item.quantity}</p>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-outline-success btn-sm ms-2"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Fixed Bottom Bar */}
      {cart.length > 0 && (
        <div
          className="bg-light border-top shadow-sm p-3 position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center"
          style={{ zIndex: 1000 }}
        >
          <div>
            <strong>Total: ₹{calculateTotal()}</strong> ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
          </div>
          <button className="btn btn-success px-4 py-2" onClick={handleCheckout}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
            Checkout & Pay
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewOrder;
