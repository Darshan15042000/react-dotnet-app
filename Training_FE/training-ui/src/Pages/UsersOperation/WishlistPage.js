import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './WishlistPage.css';

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWishlist();
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

  // ✅ Add to Cart function
  const addToCart = async (productId) => {
    if (!token) return setMessage("Please login to add to cart!");
    try {
      const res = await fetch(
        `https://localhost:7165/api/Product/cart/${productId}?quantity=1`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to add to cart");
      setMessage("Product added to cart!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="wishlist-bg">
      <h2 className="wishlist-title">💖 Your Wishlist</h2>

      {message && <div className="alert-msg">{message}</div>}

      <div className="row g-4">
        {wishlist.length > 0 ? (
          wishlist.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card product-card h-100 text-center p-3 shadow">
                <img
                  src={
                    p.imageBase64
                      ? `data:image/jpeg;base64,${p.imageBase64}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={p.name}
                  className="product-img"
                />
                <h5>{p.name}</h5>
                <p className="product-price">₹{p.price}</p>

                {/* ✅ Cart Button */}
                <button
                  className="btn btn-cart mt-2"
                  onClick={() => addToCart(p.id)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100 text-light">No items in your wishlist.</p>
        )}
      </div>

      <button
        className="btn btn-secondary btn-back"
        onClick={() => navigate("/user-profile")}
      >
        ⬅ Back to Profile
      </button>
    </div>
  );
}

export default WishlistPage;
