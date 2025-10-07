import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

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

  // ✅ Place single product order
  const placeOrder = async (product) => {
    if (!token) return setMessage("Please login to place an order");

    try {
      const res = await fetch(
        `https://localhost:7165/api/Product/order/${product.id}?quantity=${product.quantity || 1}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to place order");

      setMessage(`Order placed for ${product.name}!`);
      navigate("/orders"); // redirect to Orders page
    } catch (err) {
      console.error(err);
      setMessage("Error placing order");
    }
  };

  return (
    <div className="cart-bg">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {message && <div className="alert-msg">{message}</div>}

      <div className="row g-4">
        {cart.length > 0 ? (
          cart.map((p) => (
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
                <p>Quantity: {p.quantity || 1}</p>

                <button
                  className="btn btn-cart mt-2"
                  onClick={() => placeOrder(p)}
                >
                  ✅ Place Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100 text-light">No items in your cart.</p>
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

export default CartPage;
