import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { Heart, ShoppingCart } from "lucide-react";

function ProductDetailsModern() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7165/api/Product/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) return alert("You must be logged in to add to cart!");
    setLoadingAction(true);
    try {
      const res = await fetch(`https://localhost:7165/api/Product/cart/${id}?quantity=1`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(res.ok ? "✅ Added to cart successfully!" : data.message || "❌ Failed to add to cart");
    } catch (err) {
      console.error(err);
      setMessage("⚠ Please login to add product in Cart");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!token) return alert("You must be logged in to add to wishlist!");
    setLoadingAction(true);
    try {
      const res = await fetch(`https://localhost:7165/api/Product/wishlist/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(res.ok ? "💖 Added to wishlist successfully!" : data.message || "❌ Failed to add to wishlist");
    } catch (err) {
      console.error(err);
      setMessage("⚠ Please login to add product in WishList");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) return <p className="modern-loading">Loading...</p>;
  if (!product) return <p className="modern-loading">Product not found</p>;

  return (
    <div className="modern-bg">
      <div className="modern-card">
        <button className="modern-back-btn" onClick={() => navigate(-1)}>← Back</button>

        {product.imageBase64 && (
          <div className="modern-img-container">
            <img src={`data:image/jpeg;base64,${product.imageBase64}`} alt={product.name} className="modern-img" />
          </div>
        )}

        <h3 className="modern-name">{product.name}</h3>

        <div className="modern-info">
          <p>💲 <strong>Price:</strong> ₹{product.price}</p>
          <p>📂 <strong>Category:</strong> {product.category}</p>
          <p>🏷 <strong>Brand:</strong> {product.brand}</p>
          <p>📝 <strong>Description:</strong> {product.description}</p>
          <p>⚙ <strong>Specifications:</strong> {product.specifications}</p>
          <p>🛡 <strong>Warranty:</strong> {product.warranty}</p>
        </div>

        {token && (
          <div className="modern-btns">
            <button className="modern-btn modern-cart-btn" onClick={handleAddToCart} disabled={loadingAction}>
              Add to Cart <ShoppingCart size={18} />
            </button>
            <button className="modern-btn modern-wishlist-btn" onClick={handleAddToWishlist} disabled={loadingAction}>
              Add to Wishlist <Heart size={18} />
            </button>
          </div>
        )}

        {message && <p className="modern-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetailsModern;
