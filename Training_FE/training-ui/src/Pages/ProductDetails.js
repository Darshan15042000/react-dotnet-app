import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css"; // 👈 new css file for background & styles

function ProductDetails() {
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

  if (loading) return <p className="text-center mt-5 text-light">Loading...</p>;
  if (!product) return <p className="text-center mt-5 text-light">Product not found</p>;

  return (
    <div className="productdetails-bg vh-100 d-flex justify-content-center align-items-center">
      <div className="product-card shadow-lg">
        {/* Back button */}
        <button
          className="btn btn-outline-light position-absolute back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {product.imageBase64 && (
          <div className="text-center mb-3">
            <img
              src={`data:image/jpeg;base64,${product.imageBase64}`}
              alt={product.name}
              className="product-img"
            />
          </div>
        )}

        <h3 className="fw-bold text-center text-white">{product.name}</h3>
        <p className="text-light"><strong>💲 Price:</strong> ₹{product.price}</p>
        <p className="text-light"><strong>📂 Category:</strong> {product.category}</p>
        <p className="text-light"><strong>🏷 Brand:</strong> {product.brand}</p>
        <p className="text-light"><strong>📝 Description:</strong> {product.description}</p>
        <p className="text-light"><strong>⚙ Specifications:</strong> {product.specifications}</p>
        <p className="text-light"><strong>🛡 Warranty:</strong> {product.warranty}</p>

        {token && (
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success flex-grow-1" onClick={handleAddToCart} disabled={loadingAction}>
              Add to Cart
            </button>
            <button className="btn btn-primary flex-grow-1" onClick={handleAddToWishlist} disabled={loadingAction}>
              Add to Wishlist
            </button>
          </div>
        )}

        {message && <p className="mt-3 text-success text-center">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetails;
