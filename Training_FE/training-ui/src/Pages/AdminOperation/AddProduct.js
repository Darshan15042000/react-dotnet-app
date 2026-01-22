import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProductPage.css";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    specifications: "",
    warranty: "",
    quantity: "",
    imageFile: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/Product`;
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
      formData.append("Quantity", product.quantity);
      if (product.imageFile) formData.append("ImageFile", product.imageFile);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      setMessage("✅ Product added successfully!");
      setProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        brand: "",
        specifications: "",
        warranty: "",
        quantity:"",
        imageFile: null,
      });
      setTimeout(() => navigate("/admin-manage-product"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add product!");
    }
  };

  return (
    <div className="add-product-page">
      <aside className="add-product-sidebar">
        <h2 className="logo">Store</h2>
        <ul>
          <li onClick={() => navigate("/admin-dashboard")}>Dashboard</li>
          {/* <li onClick={() => navigate("/admin-customers")}>Users</li> */}
          <li onClick={() => navigate("/admin-manage-product")}>Manage Products</li>
          <li className="active">Add Product</li>
          {/* <li onClick={() => navigate("/admin-customer-orders")}>Orders</li> */}
          <li>Reports</li>
          <li
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      <main className="add-product-main">
        <div className="add-product-card">
          <h2>Add New Product</h2>
          {message && <p style={{ textAlign: "center" }}>{message}</p>}

          <div className="form-group">
            <input
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Brand"
              value={product.brand}
              onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Specifications"
              value={product.specifications}
              onChange={(e) =>
                setProduct({ ...product, specifications: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Warranty"
              value={product.warranty}
              onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
            />
          </div>


          <div className="form-group">
            <input
              type="number"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProduct({ ...product, imageFile: e.target.files[0] })}
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: "20px" }}>
            <button className="btn-submit" onClick={handleAdd}>
              Add Product
            </button>
            <button
              className="btn-cancel"
              onClick={() => navigate("/admin-dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
