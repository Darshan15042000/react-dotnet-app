import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ username: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "User" });
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 🟢 Add to Cart logic with stock check
  const addToCart = async (product) => {
    if (!token) return setMessage("Please login to add to cart!");
    if (product.quantity === 0) {
      setMessage(`❌ ${product.name} is out of stock!`);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Product/cart/${product.id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

     if (!res.ok) {
      // 🔹 Check if backend sent "Product already in cart"
      if (data.message === "Product already in cart") {
        setMessage(`⚠️ ${product.name} is already in your cart!`);
      } else {
        setMessage("❌ " + data.message || "Failed to add to cart");
      }
      return;
    }

    setMessage(`✅ ${product.name} added to cart!`);
  } catch (err) {
    setMessage("❌ " + err.message);
  }
};

  // 🟢 Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return setMessage("Please login to remove items!");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Product/wishlist/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to remove item from wishlist");

      // Remove item locally without refetching
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
      setMessage("✅ Item removed from wishlist!");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="wh-container">
      {/* Header */}
      <header className="wh-header">
        <div className="wh-header-left">
          <img
            src={profilePic}
            alt="Profile"
            className="wh-profile-img"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
          <h2>Hi, {user.username} 👋</h2>
        </div>
        <button className="wh-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Wishlist Title */}
      <h3 className="wh-title">💖 Your Wishlist</h3>

      {message && <div className="wh-msg">{message}</div>}

      <div className="wh-grid">
        {wishlist.length > 0 ? (
          wishlist.map((p) => (
            <div key={p.id} className="wh-card">
              <div className="wh-card-top">
                <img
                  src={
                    p.imageBase64
                      ? `data:image/jpeg;base64,${p.imageBase64}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={p.name}
                  className="wh-card-img"
                />
                <h5 className="wh-card-title">{p.description}</h5>
                <p className="wh-card-price">₹{p.price}</p>

                {/* Stock status */}
                {p.quantity === 0 ? (
                  <div className="stock-badge animated out-of-stock">
                    <span className="icon">❌</span> Out of Stock
                  </div>
                ) : p.quantity <= 5 ? (
                  <div className="stock-badge animated low-stock">
                    <span className="icon">⚡</span> Only {p.quantity} item
                    {p.quantity > 1 ? "s" : ""} left! Hurry up!
                  </div>
                ) : null}
              </div>

              <div className="wh-card-bottom">
                <button
                  className={`wh-btn-cart ${
                    p.quantity === 0 ? "wishlist-disabled-btn" : ""
                  }`}
                  onClick={() => addToCart(p)}
                  disabled={p.quantity === 0}
                >
                  {p.quantity === 0 ? "Unavailable" : "🛒 Add to Cart"}
                </button>
                <button
                  className="wh-btn-remove"
                  onClick={() => removeFromWishlist(p.id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="wh-empty">No items in your wishlist.</p>
        )}
      </div>

      <button className="wh-btn-back" onClick={() => navigate("/user-profile")}>
        ⬅ Back to Profile
      </button>
    </div>
  );
}

export default WishlistPage;
