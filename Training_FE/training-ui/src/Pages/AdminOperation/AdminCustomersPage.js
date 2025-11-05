import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminCustomersPage.css";

function AdminCustomersPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "" });
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "Admin" });
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">ShopEase</h2>
        <ul>
          <li onClick={() => navigate("/admin-dashboard")}>Dashboard</li>
          <li className="active">Customers</li>
          <li onClick={() => navigate("/add-product")}>Add Product</li>
          <li onClick={() => navigate("/admin-customer-orders")}>Orders</li>
          <li>Reports</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="admin-header">
          <h1>Customers</h1>
          <p>Welcome, {user.username} 👋</p>
        </header>

        <section className="customers-table-section">
          <h2>Customers Who Bought Your Products</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.userId}>
                      <td>{c.userName}</td>
                      <td>{c.userEmail}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCustomerClick(c.userId)}
                        >
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminCustomersPage;
