import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrdersPage.css";

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://localhost:7165/api/Product/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Orders for Your Products</h2>
      <div className="row g-4">
        {orders.length > 0 ? (
          orders.map((o, index) => (
            <div key={index} className="col-md-4">
              <div className="card order-card h-100 text-center p-3 shadow-sm">
                <img
                  src={
                    o.imageBase64
                      ? `data:image/jpeg;base64,${o.imageBase64}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={o.productName}
                  className="img-fluid mb-2"
                  style={{ maxHeight: "150px", objectFit: "contain" }}
                />
                <h5>{o.productName}</h5>
                <p className="text-muted">
                  Ordered on: {new Date(o.orderDate).toLocaleString()}
                </p>
                <p><strong>Customer Name:</strong> {o.userName}</p>
                <p><strong>Customer Email:</strong> {o.userEmail}</p>
                <p><strong>Quantity:</strong> {o.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No orders found for your products.</p>
        )}
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/admin-profile")}
      >
        Back to Profile
      </button>
    </div>
  );
}

export default AdminOrdersPage;
