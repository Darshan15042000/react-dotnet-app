import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateProduct() {
  const [product, setProduct] = useState({
    id: "", 
    name: "", 
    price: "", 
    description: "",
    category: "",
    brand: "",
    specifications: "",
    warranty: "",
    imageFile:null,
    });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://localhost:7165/api/Product";
  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
    if (!product.id || !product.name || !product.price) {
      setMessage("ID, name, and price are required!");
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

      const res = await fetch(`${API_URL}/${product.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // do NOT set Content-Type manually
        },
        body: formData,
      });

       if (!res.ok) {
      if (res.status === 401) {
        setMessage("❌ You can only update your own products!");
      } else {
        setMessage("❌ Failed to update product!");
      }
      return;
    }

      setMessage("Product updated successfully!");
      setProduct({
         id: "",
        name: "", 
        price: "", 
        description: "", 
        category: "",
        brand: "",
        specifications: "",
        warranty: "",
        imageFile:null });

      // Optional: go back to Product list
      setTimeout(() => navigate("/admin-home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update product!");
    }
  };

  return (
     <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #cfd9df, #e2ebf0)",
        overflow: "hidden",
      }}
    >
      {/* Decorative blurred shapes */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 105, 180, 0.3)",
          top: "12%",
          left: "8%",
          filter: "blur(70px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(30, 144, 255, 0.3)",
          bottom: "12%",
          right: "10%",
          filter: "blur(80px)",
        }}
      ></div>

      {/* White Form Card */}
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "520px",
          maxWidth: "95%",
          background: "#fff",
          border: "none",
          zIndex: 1,
        }}
      >
        <h2 className="text-center fw-bold mb-4" style={{ color: "#0072ff" }}>
          🔄 Update Product
        </h2>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Product ID"
          value={product.id}
          onChange={(e) => setProduct({ ...product, id: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Product Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Brand"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Specifications"
          value={product.specifications}
          onChange={(e) =>
            setProduct({ ...product, specifications: e.target.value })
          }
        ></textarea>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Warranty"
          value={product.warranty}
          onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
        />

        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setProduct({ ...product, imageFile: e.target.files[0] })}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-success px-4" onClick={handleUpdate}>
            Update
          </button>
          <button
            className="btn btn-danger px-4"
            onClick={() => navigate("/admin-home")}
          >
            Cancel
          </button>
        </div>

        {message && (
          <p className="mt-3 text-center fw-bold" style={{ color: "#0072ff" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdateProduct;
