import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

function Receipt() {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchLatestBill = async () => {
      const billsRef = collection(db, "bills");
      const latestQuery = query(billsRef, orderBy("createdAt", "desc"), limit(1));
      const snapshot = await getDocs(latestQuery);
      
      console.log("📦 Firestore snapshot:", snapshot.docs.length); // ✅
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        console.log("✅ Latest bill data:", data); // ✅
        setBill(data);
      } else {
        console.warn("⚠️ No bills found in Firestore");
      }
    };

    fetchLatestBill();
  }, []);

  if (!bill) return <p className="text-center mt-5">Fetching latest bill...</p>;

  return (
    <div className="card shadow-lg mt-4 mx-auto" style={{ maxWidth: "700px" }}>
      {/* <div className="card-body">
        <h3 className="card-title text-center mb-4">🧾 QuikBill Receipt</h3>

        <div className="mb-3">
          <strong>Order ID:</strong> {bill.orderId} <br />
          <strong>Token No:</strong> {bill.tokenNumber}
        </div>

        <ul className="list-group mb-3">
          {bill.items.map((item, index) => (
            <li className="list-group-item d-flex justify-content-between" key={index}>
              <div><strong>{item.name}</strong> × {item.quantity}</div>
              <div>₹{item.price * item.quantity}</div>
            </li>
          ))}
        </ul>

        <h5 className="text-end">Total: ₹{bill.total}</h5>

        {bill.createdAt && bill.createdAt.toDate && (
          <p className="text-end text-muted" style={{ fontSize: "0.9rem" }}>
            🕒 {bill.createdAt.toDate().toLocaleString()}
          </p>
        )}
      </div> */}
    </div>
  );
}

export default Receipt;
