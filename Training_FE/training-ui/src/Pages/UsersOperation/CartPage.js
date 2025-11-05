import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ username: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "User" });
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const fetchCart = async () => {
  if (!token) return;
  try {
    const res = await fetch("https://localhost:7165/api/Product/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();

    const cartWithQty = data.map((p) => ({
      ...p,
      orderQuantity: 1,               // selected quantity by user (default 1)
      outOfStock: p.quantity <= 0,    // stock comes from products table
    }));
    setCart(cartWithQty);
  } catch (err) {
    console.error(err);
  }
};


  const updateQuantity = (productId, delta) => {
  setCart((prev) =>
    prev.map((p) => {
      if (p.id === productId) {
        if (p.outOfStock) return p;
        let newQty = Number(p.orderQuantity) + delta;
        if (newQty < 1) newQty = 1;
        if (newQty > p.quantity) newQty = p.quantity; // ✅ max is stock from Products
        return { ...p, orderQuantity: newQty };
      }
      return p;
    })
  );
};


  const handleRemove = async (productId) => {
    if (!token) return setMessage("Please login to remove items");
    try {
      const res = await fetch(
        `https://localhost:7165/api/Product/cart/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to remove item from cart");

      setCart((prev) => prev.filter((p) => p.id !== productId));
      setMessage("✅ Item removed from cart");
    } catch (err) {
      setMessage("⚠ " + err.message);
    }
  };

  const handleNavigateToPayment = (product) => {
    if (product.outOfStock) {
      setMessage(`❌ ${product.name} is out of stock!`);
      return;
    }
    navigate("/payment", { state: { product } });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="cartpage-bg">
      {/* Header */}
      <header className="cart-header">
        <div className="cart-header-left">
          <img
            src={profilePic}
            alt="Profile"
            className="cart-profile-img"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
          <h2>Hi, {user.username} 👋</h2>
        </div>
        <button className="cart-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Cart Section */}
      <section className="cart-section">
        <h3 className="cart-title">🛒 Your Cart</h3>

        {message && <div className="cart-msg">{message}</div>}

        <div className="cart-grid">
          {cart.length > 0 ? (
            cart.map((p) => (
              <div key={p.id} className="cart-card">
                <div className="cart-card-top">
                  <img
                    src={
                      p.imageBase64
                        ? `data:image/jpeg;base64,${p.imageBase64}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={p.name}
                    className="cart-card-img"
                  />
                  <p className="cart-card-desc">{p.description}</p>
                  <p className="cart-card-price">₹{p.price}</p>

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

                  <div className="cart-card-qty">
                    <button
                      onClick={() => updateQuantity(p.id, -1)}
                      disabled={p.outOfStock || p.orderQuantity <= 1}
                    >
                      -
                    </button>
                    <span>{p.orderQuantity}</span>
                    <button
                      onClick={() => updateQuantity(p.id, 1)}
                      disabled={p.outOfStock || p.orderQuantity >= p.quantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Stock status
                  {p.quantity === 0 ? (
                    <div className="stock-badge animated out-of-stock">
                      <span className="icon">❌</span> Out of Stock
                    </div>
                  ) : p.quantity <= 5 ? (
                    <div className="stock-badge animated low-stock">
                      <span className="icon">⚡</span> Only {p.quantity} item
                      {p.quantity > 1 ? "s" : ""} left! Hurry up!
                    </div>
                  ) : null} */}
                </div>

                <div className="cart-card-bottom">
                  <button
                    className={`cart-btn-placeorder ${
                      p.outOfStock ? "disabled-btn" : ""
                    }`}
                    onClick={() => handleNavigateToPayment(p)}
                  >
                    {p.outOfStock ? "Unavailable" : "✅ Place Order"}
                  </button>

                  {/* Remove button */}
                  <button
                    className="cart-btn-placeorder"
                    style={{
                      background: "gray",
                      marginTop: "10px",
                    }}
                    onClick={() => handleRemove(p.id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="cart-empty">No items in your cart.</p>
          )}
        </div>

        <button
          className="cart-back-btn"
          onClick={() => navigate("/user-profile")}
        >
          ⬅ Back to Profile
        </button>
      </section>
    </div>
  );
}

export default CartPage;
