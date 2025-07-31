import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import {
  collection, addDoc, Timestamp, doc, getDoc, setDoc
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faPlus,
  faFileInvoiceDollar,
  faShoppingCart,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Updated Menu: 10 Items (7 food, 3 beverages)
const MENU = [
  { id: 1, name: 'Idli', price: 30 },
  { id: 2, name: 'Dosa', price: 40 },
  { id: 3, name: 'Vada', price: 25 },
  { id: 4, name: 'Poori', price: 35 },
  { id: 5, name: 'Masala Dosa', price: 50 },
  { id: 6, name: 'Curd Rice', price: 45 },
  { id: 7, name: 'Pongal', price: 40 },
  { id: 8, name: 'Filter Coffee', price: 20 },
  { id: 9, name: 'Tea', price: 30 },
  { id: 10, name: 'Lime Soda', price: 25 },
];

function BillingForm() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const addToCart = (item) => {
    const exists = cart.find(ci => ci.name === item.name);
    if (exists) {
      setCart(cart.map(ci => ci.name === item.name ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleCloseOrder = () => {
    if (window.confirm('Are you sure you want to clear the current order?')) {
      setCart([]);
      localStorage.removeItem('selectedItems');
      localStorage.removeItem('totalAmount');
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="container py-5 mb-5">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faUtensils} className="me-2 text-success" />
        QuikBill
      </h1>

      <h4 className="mb-3">Menu</h4>
      <div className="row">
        {MENU.map(item => {
          const inCart = cart.find(ci => ci.name === item.name);
          return (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{
                    height: '150px',
                    backgroundImage: 'url(https://via.placeholder.com/120)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px'
                  }}
                ></div>
                <div className="card-body text-center">
                  <h5 className="card-title mb-1">{item.name}</h5>
                  <p className="text-muted small mb-1">Tasty & Hot</p>
                  <p className="fw-bold text-dark mb-2">₹{item.price}</p>

                  <div className="d-flex flex-column align-items-center">
                    <button
                      className="btn btn-success btn-sm w-75 mb-2"
                      onClick={() => addToCart(item)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-1" /> Add
                    </button>

                    {inCart && (
                      <span className="badge bg-primary">
                        In Cart: {inCart.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div
        className="position-fixed bottom-0 start-0 end-0 bg-white border-top d-flex justify-content-between align-items-center px-4 py-3 shadow"
        style={{ zIndex: 1050 }}
      >
        <button
          className="btn btn-outline-danger"
          onClick={handleCloseOrder}
          disabled={cart.length === 0}
        >
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          Close Order
        </button>

        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2 text-secondary" />
            <span className="fw-semibold">{totalItems}</span>
          </div>

          <div className="fw-bold fs-5 text-success mb-0">
            ₹{totalAmount.toFixed(2)}
          </div>

          <button
            className="btn btn-success"
            onClick={() => {
              localStorage.setItem('selectedItems', JSON.stringify(cart));
              localStorage.setItem('totalAmount', totalAmount);
              navigate('/view-order');
            }}
            disabled={cart.length === 0}
          >
            View Order →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingForm;
