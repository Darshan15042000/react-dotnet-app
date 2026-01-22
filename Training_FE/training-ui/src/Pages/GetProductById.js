import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function GetProductById() {
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/Product`;
  const token = localStorage.getItem("token");

  const getProductById = async () => {
    if (!productId) {
      setMessage("Please enter a product ID!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      setProduct(data);
      setMessage(`Fetched product with ID ${productId}`);
    } catch (err) {
      console.error(err);
      setProduct(null);
      setMessage("Failed to fetch product!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4 text-primary">Get Product By ID</h2>

      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button className="btn btn-success" onClick={getProductById}>
          Search
        </button>
      </div>

      {message && <p className="text-center text-danger">{message}</p>}

      {product && (
        <div className="card shadow-sm border-0" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="card-body">
            <h5 className="card-title text-success">{product.name}</h5>
            <p className="card-text text-warning">Price: INR {product.price}</p>
            {product.description && <p className="card-text text-secondary">{product.description}</p>}
          </div>
          <div className="card-footer bg-white border-0">
            <small className="text-muted">ID: {product.id}</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetProductById;
