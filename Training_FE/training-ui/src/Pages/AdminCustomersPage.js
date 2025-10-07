import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCustomersPage.css"; // 👈 new CSS file

function AdminCustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://localhost:7165/api/Product/orders/admin/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomerClick = (userId) => {
    navigate(`/admin-customer-orders/${userId}`);
  };

  return (
    <div className="admin-customers-bg">
      <div className="customers-container">
        <h2 className="customers-heading">Customers Who Bought Your Products</h2>
        <ul className="customers-list">
          {customers.length > 0 ? (
            customers.map((c) => (
              <li
                key={c.userId}
                className="customer-item"
                onClick={() => handleCustomerClick(c.userId)}
              >
                <div className="customer-info">
                  <h5>{c.userName}</h5>
                  <p>{c.userEmail}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="no-customers">No customers found.</p>
          )}
        </ul>

        <button
          className="btn-back"
          onClick={() => navigate("/admin-profile")}
        >
          ← Back to Profile
        </button>
      </div>
    </div>
  );
}

export default AdminCustomersPage;
