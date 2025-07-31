import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faReceipt } from '@fortawesome/free-solid-svg-icons';

function SuccessPage() {
  const navigate = useNavigate();
  const bill = JSON.parse(localStorage.getItem("latestBill"));

  const generatePDF = (order) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150],
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('QuikBill Receipt', 40, 10, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderId}`, 10, 20);
    doc.text(`Token No: ${order.tokenNumber}`, 10, 25);
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);

    autoTable(doc, {
      startY: 35,
      body: order.items.map(item => [
        item.name,
        `${item.quantity}`,
        `₹${(item.price * item.quantity).toFixed(2)}`
      ]),
      head: [['Item', 'Qty', 'Total']],
      theme: 'grid',
      styles: { fontSize: 9, font: "helvetica" },
      headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    });

    const totalY = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${order.total.toFixed(2)}`, 10, totalY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for dining with us!", 10, totalY + 10);
    doc.text("Visit again. ", 10, totalY + 15);

    // doc.save('receipt.pdf');
  };

  useEffect(() => {
    if (!bill) {
      alert("No bill found.");
      navigate('/');
      return;
    }

    generatePDF(bill);
  }, [bill, navigate]);

  return (
    <div className="container mt-5 text-center">
      <div className="alert alert-success d-flex align-items-center justify-content-center gap-2 mb-4">
        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
        <h4 className="mb-0">Payment Successful!</h4>
      </div>
      <p className="text-muted mb-4">Your official receipt has been downloaded automatically.</p>

      {bill && (
        <div className="card shadow mx-auto border-0" style={{ maxWidth: '500px', background: '#fdfdfd' }}>
          <div className="card-header bg-dark text-white d-flex align-items-center">
            <FontAwesomeIcon icon={faReceipt} className="me-2" />
            Digital Receipt
          </div>
          <div className="card-body text-start px-4">
            <p><strong>Order ID:</strong> {bill.orderId}</p>
            <p><strong>Token No:</strong> {bill.tokenNumber}</p>
            <p><strong>Date:</strong> {new Date().toLocaleString()}</p>

            <hr />

            <p className="fw-semibold">Items:</p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">₹{item.price}</td>
                      <td className="text-end">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light fw-bold">
                    <td colSpan="3" className="text-end">Total</td>
                    <td className="text-end">₹{bill.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3 text-muted text-center small">
              Thank you for dining with us!<br />Visit again 
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuccessPage;
