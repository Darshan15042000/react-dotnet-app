import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

function AdminDashboard() {


 

  const navigate = useNavigate();

  const [user, setUser] = useState({ username: "" });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentBuyers, setRecentBuyers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showUsersTable, setShowUsersTable] = useState(false);

  const [adminProducts, setAdminProducts] = useState([]); // 👈 new
  const [showProductsTable, setShowProductsTable] = useState(false); // 👈 new


  const [adminOrders, setAdminOrders] = useState([]);
  const [showAdminTable, setShowAdminTable] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "Admin" });
    fetchStats();
    fetchRecentBuyers();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7165/api/Product/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch admin stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentBuyers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7165/api/Product/admin/recent-buyers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch recent buyers");
      const data = await response.json();
      setRecentBuyers(data);
    } catch (error) {
      console.error("Error fetching recent buyers:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7165/api/Product/orders/admin/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setAllUsers(Array.isArray(data) ? data : []);
      setShowUsersTable(true);
      setShowProductsTable(false); // hide products table if 
      setShowAdminTable(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
    }
  };

  // 👇 New function to fetch admin's products
  const fetchAdminProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7165/api/Product/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch admin products");
      const data = await response.json();
      setAdminProducts(Array.isArray(data) ? data : []);
      setShowProductsTable(true);
      setShowUsersTable(false); // hide users table if open
      setShowAdminTable(false);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      setAdminProducts([]);
    }
  };

  // functionn for getting the orders of product belongs to admin
  const fetchAdminOrders = async () =>{
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7165/api/Product/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch admin products");
      const data = await response.json();
      setAdminOrders(Array.isArray(data) ? data : []);
      setShowAdminTable(true);
      setShowUsersTable(false); // hide users table if open
      setShowProductsTable(false); // hide products table
    } catch (error) {
      console.error("Error fetching admin products:", error);
      setAdminOrders([]);
    }
  };

  const handleDashboardClick = () => {
  // hide other tables
  setShowUsersTable(false);
  setShowProductsTable(false);
  setShowAdminTable(false);

  // re-fetch data
  fetchStats();
  fetchRecentBuyers();
};


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Store</h2>
        <ul>
          <li onClick={handleDashboardClick}>Dashboard</li>

          <li onClick={fetchAllUsers}>Users</li>
          <li onClick={() => navigate("/admin-manage-product")}>Manage Products</li>
          <li onClick={() => navigate("/add-product")}>Add Product</li>
          {/* <li onClick={() => navigate("/admin-customer-orders")}>Orders</li> */}
          <li>Reports</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.username} 👋</p>
        </header>

        {/* Stats Cards */}
        <section className="stats d-flex gap-3 mb-4 flex-wrap">
          <div className="card" style={{ cursor: "pointer" }} onClick={fetchAllUsers}>
            <h3>Customers</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="card" style={{ cursor: "pointer" }} onClick={fetchAdminProducts}>
            <h3>Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
          <div className="card" style = {{cursor:"pointer"}} onClick={fetchAdminOrders} >
            <h3>Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </section>

        {/* Recent Buyers */}
        <section className="recent-buyers mb-4">
          <h2>Recent Buyers</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Buyer Name</th>
                  <th>Product</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody> {recentBuyers.length === 0 ? ( 
                <tr>
                   <td colSpan="5" className="text-center">
                    No recent buyers found.</td>
               </tr> ) 
               : ( recentBuyers.map((order) => ( <tr key={order.orderId}>
                 <td>#{order.orderId}</td> 
                 <td>{order.buyerName}</td>
                 <td>{order.productName}</td> 
                 <td>{new Date(order.orderDate).toLocaleString()}</td> 
                 <td>{order.status}</td> </tr> )) )} 
                </tbody>

            </table>
          </div>
        </section>

        {/* All Users Table */}
        {showUsersTable && (
          <section className="all-users">
            <h2>All Users</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Product Id</th>
                    <th>Product Name</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No users found.</td>
                    </tr>
                  ) : (
                    allUsers.map((u) => (
                      <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.userName}</td>
                        <td>{u.userEmail}</td>
                        <td>{u.productId}</td>
                        <td>{u.productName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Admin Products Table 👇 */}
        {showProductsTable && (
          <section className="admin-products">
            <h2>Your Products</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
  <tr>
    <th>Product ID</th>
    <th>Name</th>
    <th>Brand</th>
    <th>Price</th>
    <th>Remaining Quantity</th> {/* ✅ new column */}
    <th>Created Date</th>
  </tr>
</thead>
<tbody>
  {adminProducts.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center">No products found.</td>
    </tr>
  ) : (
    adminProducts.map((p) => (
      <tr
        key={p.id}
        className="clickable-row"
        onClick={() => navigate(`/product/${p.id}`)}
        style={{ cursor: "pointer" }}
      >
        <td>{p.id}</td>
        <td className="text-primary text-decoration-underline">{p.name}</td>
        <td>{p.brand}</td>
        <td>₹{p.price}</td>
        <td>{p.quantity}</td> {/* ✅ show remaining stock */}
        <td>{new Date(p.createdAt).toLocaleString()}</td>
      </tr>
    ))
  )}
</tbody>



              </table>
            </div>
          </section>
  )}


         {/* Admin Products Table 👇 */}
        {showAdminTable && (
          <section className="admin-products">
            <h2>Purchased Products </h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Ordered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Product is not purchased yet</td>
                    </tr>
                  ) : (
                    adminOrders.map((p) => (
                      <tr key={p.productId}>
                        <td>{p.productId}</td>
                        <td>{p.productName}</td>
                        <td>{p.productBrand}</td>
                        <td>₹{p.productPrice}</td>
                        <td>{p.userName}</td>
                        <td>{p.userEmail}</td>
                        <td>{new Date(p.orderDate).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
  )}

  
      </main>
    </div>
  );
}

export default AdminDashboard;
