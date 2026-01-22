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
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/${id}`);
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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/cart/${id}?quantity=1`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/wishlist/${id}`, {
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
  <div className="product-page">
    <div className="product-box">

      <button className="modern-back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="product-img-area">
        <img className="product-img"
          src={`data:image/jpeg;base64,${product.imageBase64}`}
          alt={product.name}
        />
      </div>

      <h2 className="product-title">{product.name}</h2>

      <div className="product-details">
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Specifications:</strong> {product.specifications}</p>
        <p><strong>Warranty:</strong> {product.warranty}</p>
      </div>

      {token && (
      <div className="action-row">
        <button className="btn-buy" onClick={handleAddToCart}>
          Add to Cart 🛒
        </button>

        <button className="btn-wish" onClick={handleAddToWishlist}>
          Wishlist ❤️
        </button>
      </div>
      )}

      {message && <p className="response-msg">{message}</p>}
    </div>
  </div>
);


}

export default ProductDetailsModern;
