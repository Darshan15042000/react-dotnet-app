import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || "Admin",
      email: localStorage.getItem("email") || "admin@example.com",
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMyOrders = () => {
    navigate("/admin-customers");
  };

  return (
    <div className="admin-profile-bg d-flex flex-column align-items-center">
      {/* Header */}
      <header className="profile-header d-flex justify-content-between align-items-center w-100 px-5 py-3 shadow-sm">
        <h2 className="text-white">Admin Profile</h2>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Profile Card */}
      <div className="profile-card text-center mt-5 p-5">
        <img src={profilePic} alt="Admin" className="profile-pic mb-4" />
        <h3 className="mb-2 text-glow">{user.username}</h3>
        <p className="text-muted">{user.email}</p>

        <div className="mt-4 d-flex justify-content-center gap-4 flex-wrap">
          <button className="btn admin-btn btn-add" onClick={handleMyOrders}>
            My Orders
          </button>
          <button className="btn admin-btn btn-delete" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
