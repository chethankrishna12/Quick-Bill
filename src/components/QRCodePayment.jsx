// src/components/QRCodePayment.jsx
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './QRCodePayment.css'; // Custom styles

function QRCodePayment() {
  const navigate = useNavigate();
  const latestBill = JSON.parse(localStorage.getItem("latestBill"));
  const amount = latestBill?.total || 0;

  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fakeTxnId, setFakeTxnId] = useState('');

  useEffect(() => {
    if (!latestBill) {
      alert("No bill found. Redirecting...");
      navigate("/");
    }

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Fake TXN generator
    const randomTxn = "TXN" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setFakeTxnId(randomTxn);

  }, []);

  const handlePaymentDone = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/success");
    }, 1000);
  };

  const upiLink = `upi://pay?pa=quikbill@upi&pn=QuikBill Demo&am=${amount}`;

  return (
    <div className="container text-center p-4">
      <h2 className="mb-3 fw-bold">Scan to Pay</h2>

      <div className="qr-box fade-in p-3 bg-white shadow rounded d-inline-block">
        <QRCode value={upiLink} size={160} />
      </div>

      <p className="mt-2 small">UPI: <strong>quikbill@upi</strong></p>
      <p className="fs-5 fw-semibold">Amount: ₹{amount}</p>

      {countdown > 0 && (
        <div className="mt-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-secondary me-2" />
          <span className="text-muted">Waiting for payment...</span>
        </div>
      )}


      <p className="mt-2 text-muted">Transaction ID: <strong>{fakeTxnId}</strong></p>

      <button
        onClick={handlePaymentDone}
        className="btn btn-success mt-4"
        disabled={countdown > 0 || loading}
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
            Processing...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Payment Done {countdown > 0 && `(${countdown}s)`}
          </>
        )}
      </button>
    </div>
  );
}

export default QRCodePayment;
