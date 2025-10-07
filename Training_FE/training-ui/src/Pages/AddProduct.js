import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [product, setProduct] = useState({ 
    name: "",
    price: "",
    description: "",
    category:"",
    brand:"",
    specification:"",
    warranty:"", 
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://localhost:7165/api/Product";
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    if (!product.name || !product.price) {
      setMessage("Name and price are required!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("Name", product.name);
      formData.append("Price", product.price);
      formData.append("Description", product.description || "");
      formData.append("Category", product.category || "");
      formData.append("Brand", product.brand || "");
      formData.append("Specifications", product.specifications || "");
      formData.append("Warranty", product.warranty || "");

      if (product.imageFile) {
        formData.append("ImageFile", product.imageFile);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // only auth header, not Content-Type
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      setMessage("Product added successfully!");
      setProduct({
         name: "", 
         price: "", 
         description: "",
         category:"",
         brand:"",
         specification:"",
         warranty:"",
        
        });

      // Optional: go back to Product list
      setTimeout(() => navigate("/admin-home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add product!");
    }
  };

  return (
     <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #ffecd2, #fcb69f)",
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
          top: "10%",
          left: "10%",
          filter: "blur(60px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(54, 162, 235, 0.3)",
          bottom: "15%",
          right: "15%",
          filter: "blur(70px)",
        }}
      ></div>

      {/* White form card */}
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "520px",
          maxWidth: "95%",
          background: "#fff",
          border: "none",
        }}
      >
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ff4b2b" }}>
          🛍️ Add Product
        </h2>

        {/* Product Name */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        {/* Product Price */}
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Product Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />

        {/* Description */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Description (optional)"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />

        {/* Category */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        {/* Brand */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Brand"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        />

        {/* Specifications */}
        <textarea
          className="form-control mb-3"
          placeholder="Specifications"
          value={product.specifications}
          onChange={(e) =>
            setProduct({ ...product, specifications: e.target.value })
          }
        ></textarea>

        {/* Warranty */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Warranty"
          value={product.warranty}
          onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setProduct({ ...product, imageFile: e.target.files[0] })}
        />

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <button onClick={handleAdd} className="btn btn-success px-4">
            Add Product
          </button>
          <button
            onClick={() => navigate("/admin-home")}
            className="btn btn-danger px-4"
          >
            Cancel
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="mt-3 text-center fw-bold" style={{ color: "#ff4b2b" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
