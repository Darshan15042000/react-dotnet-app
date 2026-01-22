import React, { useEffect, useState } from "react";
import "./DeliveryPartnerDashboard.css";
import { useNavigate } from "react-router-dom";
import { User, Package, CheckCircle, Truck, Home, LogOut } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

function DeliveryPartnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPartnerOrders();
  }, []);

  const fetchPartnerOrders = async () => {
    const token = localStorage.getItem("partner_token");

    if (!token) {
      navigate("/deliverypartner-login");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/deliverypartner/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);

      setStats({
        totalOrders: data.length,
        activeOrders: data.filter(o => o.status !== "Delivered").length,
        deliveredOrders: data.filter(o => o.status === "Delivered").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("partner_token");
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/deliverypartner/orders/${orderId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPartnerOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    navigate("/deliverypartner-login");
  };

  const assignedOrders = orders.filter(o => o.status !== "Delivered");
  const deliveredOrders = orders.filter(o => o.status === "Delivered");

  // Earnings calculations
  const earningPerOrder = 20;
  const totalEarnings = deliveredOrders.length * earningPerOrder;

  // Fake chart data based on delivered orders
  const chartData = deliveredOrders.slice(0, 7).map((o, index) => ({
    day: `Day ${index + 1}`,
    amount: earningPerOrder,
  }));

  const renderOrdersTable = (list) => (
    <div className="card-bubble">
      <table className="dp-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Qty</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-orders">No orders found</td>
            </tr>
          ) : (
            list.map(order => (
              <tr key={order.orderId}>
                <td>{order.productName}</td>
                <td>{order.customerName}</td>
                <td>{order.customerMobile}</td>
                <td>{order.addressLine}, {order.city}, {order.state}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                <td>
                  <span className={`badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>

                <td>
                  {order.status === "Assigned" && (
                    <button
                      className="bubble-btn start"
                      onClick={() => updateStatus(order.orderId, "OutForDelivery")}
                    >
                      Start
                    </button>
                  )}

                  {order.status === "OutForDelivery" && (
                    <button
                      className="bubble-btn delivered"
                      onClick={() => updateStatus(order.orderId, "Delivered")}
                    >
                      Delivered
                    </button>
                  )}

                  {order.status === "Delivered" && (
                    <span className="done-text">✓</span>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dp-container">

      {/* SIDEBAR */}
      <aside className="bubble-sidebar">
        <h2 className="logo">Partner</h2>

        <ul>
          <li className={activeMenu === "dashboard" ? "active" : ""} 
              onClick={() => setActiveMenu("dashboard")}>
            <Home size={18}/> Dashboard
          </li>

          <li className={activeMenu === "assigned" ? "active" : ""} 
              onClick={() => setActiveMenu("assigned")}>
            <Truck size={18}/> Assigned
          </li>

          <li className={activeMenu === "delivered" ? "active" : ""} 
              onClick={() => setActiveMenu("delivered")}>
            <CheckCircle size={18}/> Delivered
          </li>

          <li className={activeMenu === "earnings" ? "active" : ""} 
              onClick={() => setActiveMenu("earnings")}>
            💰 Earnings
          </li>

          <li onClick={() => navigate("/deliverypartner-profile")}>
            <User size={18}/> Profile
          </li>

          <li className="logout" onClick={handleLogout}>
            <LogOut size={18}/> Logout
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="bubble-main">

        {/* DASHBOARD */}
        {activeMenu === "dashboard" && (
          <>
            <h1 className="title">Dashboard</h1>

            <div className="stats-row">
              <div className="stat-card card-bubble">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
              <div className="stat-card card-bubble">
                <h3>{stats.activeOrders}</h3>
                <p>Active</p>
              </div>
              <div className="stat-card card-bubble">
                <h3>{stats.deliveredOrders}</h3>
                <p>Delivered</p>
              </div>
            </div>
          </>
        )}

        {/* ASSIGNED */}
        {activeMenu === "assigned" && renderOrdersTable(assignedOrders)}

        {/* DELIVERED */}
        {activeMenu === "delivered" && renderOrdersTable(deliveredOrders)}

        {/* EARNINGS PAGE */}
        {activeMenu === "earnings" && (
          <section className="earnings-section">

            <div className="earnings-card card-bubble">
              <h2>Earnings Overview</h2>

              <div className="earnings-grid">
                <div className="earning-box">
                  <h3>{deliveredOrders.length}</h3>
                  <p>Delivered Orders</p>
                </div>

                <div className="earning-box">
                  <h3>₹{earningPerOrder}</h3>
                  <p>Per Order</p>
                </div>

                <div className="earning-box total-box">
                  <h3>₹{totalEarnings}</h3>
                  <p>Total Earnings</p>
                </div>
              </div>
            </div>

            <div className="chart-card card-bubble">
              <h2>Earnings Chart</h2>

              <LineChart width={600} height={300} data={chartData}>
                <Line type="monotone" dataKey="amount" stroke="#4c57d6" strokeWidth={3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default DeliveryPartnerDashboard;
