import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserOrdersPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ username: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "User" });
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/orders/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="orders-bg">
      {/* Header */}
      <header className="orders-header">
        <div className="orders-header-left">
          <img
            src={profilePic}
            alt="Profile"
            className="orders-profile-img"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
          <h2>Hi, {user.username} 👋</h2>
        </div>
        <button className="orders-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Orders Section */}
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((o, index) => (
            <div key={index} className="order-box">
              <div className="order-left">
                <img
                  src={
                    o.imageBase64
                      ? `data:image/jpeg;base64,${o.imageBase64}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={o.productName}
                  className="order-img"
                />
              </div>

              <div className="order-right">
                <h3 className="order-title">{o.productName}</h3>
                <p className="order-desc">{o.description}</p>
                {o.warranty && (
                  <p>
                    <strong>Warranty:</strong> {o.warranty}
                  </p>
                )}
                {o.specifications && (
                  <p>
                    <strong>Specifications:</strong> {o.specifications}
                  </p>
                )}
                <p>
                  <strong>Quantity:</strong> {o.quantity}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(o.orderDate).toLocaleString()}
                </p>

                {/* Address Section */}
                <div className="address-box">
                  <h4>Delivery Address</h4>
                  <p>
                    <strong>Mobile:</strong> {o.mobileNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {o.addressLine}, {o.landmark}
                  </p>
                  <p>
                    <strong>City:</strong> {o.city}, <strong>State:</strong>{" "}
                    {o.state}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {o.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate("/user-profile")}>
        ⬅ Back to Profile
      </button>
    </div>
  );
}

export default UserOrdersPage;
