import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfilePage.css";
import profilePic from "../../assets/images/User_Profile.jpg";
import { Heart, ShoppingCart, Package, MapPin } from "lucide-react"; // MapPin for address

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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/wishlist`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/cart`, {
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
    <div className="userprofile-container">
      {/* Header */}
      <div className="userprofile-header">
        <div className="userprofile-header-left">
          <img src={profilePic} alt="Profile" className="userprofile-img" />
          <div className="userprofile-info">
            <h2>👋 Hi, {user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <button className="userprofile-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="userprofile-stats">
        <div
          className="userprofile-card userprofile-wishlist"
          onClick={() => navigate("/wishlist")}
        >
          <Heart className="userprofile-icon heart-icon" />
          <h3>Wishlist</h3>
          <p>{wishlist.length} items saved</p>
        </div>

        <div
          className="userprofile-card userprofile-cart"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="userprofile-icon cart-icon" />
          <h3>Cart</h3>
          <p>{cart.length} products</p>
        </div>

        <div
          className="userprofile-card userprofile-orders"
          onClick={() => navigate("/orders")}
        >
          <Package className="userprofile-icon order-icon" />
          <h3>Orders</h3>
          <p>Track your purchases</p>
        </div>

        {/* New Address Card */}
        <div
          className="userprofile-card userprofile-addresses"
          onClick={() => navigate("/addresses")}
        >
          <MapPin className="userprofile-icon address-icon" />
          <h3>Addresses</h3>
          <p>Manage your saved addresses</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
