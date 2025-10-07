import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserOrdersPage.css";

function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://localhost:7165/api/Product/orders/user", {
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
    <div className="orders-bg">
      <h2 className="orders-title">📦 Your Orders</h2>

      <div className="row g-4">
        {orders.length > 0 ? (
          orders.map((o, index) => (
            <div key={index} className="col-md-4">
              <div className="card order-card h-100 text-center p-3 shadow">
                <img
                  src={
                    o.imageBase64
                      ? `data:image/jpeg;base64,${o.imageBase64}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={o.productName}
                  className="order-img"
                />
                <h5>{o.productName}</h5>
                <p>Quantity: {o.quantity}</p>
                <p className="text-muted">
                  Ordered on: {new Date(o.orderDate).toLocaleString()}
                </p>
                <p><strong>Description:</strong> {o.description}</p>
                <p><strong>Warranty:</strong> {o.warranty}</p>
                <p><strong>Specifications:</strong> {o.specifications}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100 text-light">No orders found.</p>
        )}
      </div>

      <button
        className="btn btn-back mt-4"
        onClick={() => navigate("/user-profile")}
      >
        ⬅ Back to Profile
      </button>
    </div>
  );
}

export default UserOrdersPage;
