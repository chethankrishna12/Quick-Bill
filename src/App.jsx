// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BillingForm from './components/BillingForm';
import Receipt from './components/Receipt';
import QRCodePayment from './components/QRCodePayment';
import SuccessPage from './components/SuccessPage';
import ViewOrder from './components/ViewOrder';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// Wrapper layout component (for all except BillingPage)
function AppLayout({ children }) {
  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-4 text-center">
          <FontAwesomeIcon icon="utensils" className="me-2" /> QuikBill
        </h1>


      </div>

      {/* Test Section Removed */}

      <div className="bg-light p-4 border rounded shadow-sm">
        {children}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <BillingForm />
              <Receipt />
            </AppLayout>
          }
        />
        <Route
          path="/receipt"
          element={
            <AppLayout>
              <Receipt />
            </AppLayout>
          }
        />
        <Route
          path="/qr-payment"
          element={
            <AppLayout>
              <QRCodePayment amount={123} />
            </AppLayout>
          }
        />
        <Route
          path="/success"
          element={
            <AppLayout>
              <SuccessPage />
            </AppLayout>
          }
        />
        <Route path="/view-order" element={<ViewOrder />} />

      </Routes>
    </Router>
  );
}

export default App;
