import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserProfile.css'; 
import profilePic from '../../assets/images/User_Profile.jpg';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
 
  const token = localStorage.getItem("token");

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || "User",
      email: localStorage.getItem("email") || "user@example.com",
    });
    fetchWishlist();
    fetchCart();
  }, []);

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://localhost:7165/api/Product/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://localhost:7165/api/Product/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="userprofile-bg">
      {/* Profile Header */}
      <div className="profile-header">
        <img src={profilePic} alt="Profile" className="profile-img" />
        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <button className="btn btn-logout mt-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs my-3">
        <button
          className="btn btn-wishlist me-2"
          onClick={() => navigate("/wishlist")}
        >
          Wishlist ({wishlist.length})
        </button>
        <button
          className="btn btn-cart me-2"
          onClick={() => navigate("/cart")}
        >
          Cart ({cart.length})
        </button>
        <button
          className="btn btn-orders"
          onClick={() => navigate("/orders")}
        >
          My Orders
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
