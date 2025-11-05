import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAddressesPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";
import { MapPin, Edit2, Plus } from "lucide-react";

function UserAddressesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });
  const [addresses, setAddresses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || "User",
      email: localStorage.getItem("email") || "user@example.com",
    });
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://localhost:7165/api/Address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="addresses-container">
      {/* Header */}
      <div className="addresses-header">
        <div className="addresses-header-left">
          <img src={profilePic} 
                alt="Profile" 
                className="addresses-profile-img"
                onClick={() => navigate("/user-profile")}
            title="Go to Profile"
           />
          <div className="addresses-user-info">
            <h2>👋 Hi, {user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <button className="addresses-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="addresses-main">
        <div className="addresses-top">
          <h2>Your Saved Addresses</h2>
          <button
            className="addresses-add-btn"
            onClick={() => navigate("/add-address")}
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        <div className="addresses-list">
          {addresses.length === 0 ? (
            <p className="addresses-no-data">No addresses found</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="addresses-card">
                <MapPin className="addresses-icon" />
                <div className="addresses-info">
                  <h3>{addr.name}</h3>
                  <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p>Mobile: {addr.mobileNumber}</p>
                  {addr.isDefault && <p className="addresses-default">Default Address</p>}
                </div>
                <button
                  className="addresses-edit-btn"
                  onClick={() => navigate(`/edit-address/${addr.id}`)}
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAddressesPage;
