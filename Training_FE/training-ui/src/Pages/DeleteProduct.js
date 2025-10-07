import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteProduct() {
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://localhost:7165/api/Product";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleDelete = async () => {
    if (role !== "Admin") {
      setMessage("⚠️ Only Admin can delete products!");
      return;
    }

    if (!productId) {
      setMessage("⚠️ Please enter a product ID!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setMessage("❌ You can only delete your own products!");
        } else if (res.status === 404) {
          setMessage("❌ Product not found!");
        } else {
          setMessage("❌ Failed to delete product!");
        }
        return;
      }

      setMessage(`✅ Product with ID ${productId} deleted successfully!`);
      setProductId("");

      // Redirect after a short delay
      setTimeout(() => navigate("/admin-home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete product!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #ffecd2, #fcb69f)", // warm gradient
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 99, 132, 0.3)",
          top: "15%",
          left: "12%",
          filter: "blur(70px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(54, 162, 235, 0.3)",
          bottom: "10%",
          right: "10%",
          filter: "blur(80px)",
        }}
      ></div>

      {/* White Card */}
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "480px",
          maxWidth: "95%",
          background: "#fff",
          border: "none",
          zIndex: 1,
        }}
      >
        <h2 className="text-center fw-bold mb-4 text-danger">
          🗑️ Delete Product
        </h2>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <div className="d-flex justify-content-between">
          <button className="btn btn-danger px-4" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="btn btn-secondary px-4"
            onClick={() => navigate("/admin-home")}
          >
            Cancel
          </button>
        </div>

        {message && (
          <p className="mt-3 text-center fw-bold" style={{ color: "#d9534f" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default DeleteProduct;

