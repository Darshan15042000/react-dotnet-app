import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminCustomerOrdersPage.css";

function AdminCustomerOrdersPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://localhost:7165/api/Product/orders/admin/customer-orders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h2 style={{color:"white"}}>Orders by this customer</h2>
      <div className="row g-4">
        {orders.map((o, index) => (
          <div key={index} className="col-md-4">
            <div className="card text-center p-3 shadow-sm">
              <img
                src={o.imageBase64 ? `data:image/jpeg;base64,${o.imageBase64}` : "https://via.placeholder.com/150"}
                alt={o.productName}
                className="img-fluid mb-2"
                style={{ maxHeight: "150px", objectFit: "contain" }}
              />
              <h5>{o.productName}</h5>
              <p>Quantity: {o.quantity}</p>
              <p className="text-muted">Ordered on: {new Date(o.orderDate).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p>No orders found for this customer.</p>}
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin-customers")}>
        Back to Customers
      </button>
    </div>
  );
}

export default AdminCustomerOrdersPage;
