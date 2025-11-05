import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UpdateProduct.css";

function UpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProduct = location.state?.product || null;

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    specifications: "",
    warranty: "",
    quantity: "",   // new feild for manage the quantity
    imageFile: null,
  });

  const [message, setMessage] = useState("");
  const API_URL = "https://localhost:7165/api/Product";
  const token = localStorage.getItem("token");

  // Prefill form
  useEffect(() => {
    if (existingProduct) {
      setProduct({
        id: existingProduct.id ?? existingProduct.Id,
        name: existingProduct.name ?? existingProduct.Name,
        price: existingProduct.price ?? existingProduct.Price,
        description: existingProduct.description ?? existingProduct.Description,
        category: existingProduct.category ?? existingProduct.Category,
        brand: existingProduct.brand ?? existingProduct.Brand,
        specifications: existingProduct.specifications ?? existingProduct.Specifications,
        warranty: existingProduct.warranty ?? existingProduct.Warranty,
        quantity: existingProduct.quantity ?? existingProduct.Quantity,
        imageFile: null,
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, imageFile: e.target.files[0] });
  };

  const handleUpdate = async () => {
    if (!product.id) {
      setMessage("❌ Product ID not found!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Name", product.name);
      formData.append("Price", product.price);
      formData.append("Description", product.description);
      formData.append("Category", product.category);
      formData.append("Brand", product.brand);
      formData.append("Specifications", product.specifications);
      formData.append("Warranty", product.warranty);
      formData.append("Quantity", product.quantity);

      if (product.imageFile) formData.append("ImageFile", product.imageFile);

      const res = await fetch(`${API_URL}/${product.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      setMessage("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin-manage-product"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update product!");
    }
  };

  return (
    <div className="update-product-page">
      <aside className="update-product-sidebar">
        
        <h2 className="logo">Store</h2>
        <ul>
          <li onClick={() => navigate("/admin-dashboard")}>Dashboard</li>
          {/* <li onClick={() => navigate("/admin-customers")}>Users</li> */}
          <li onClick={() => navigate("/admin-manage-product")}>Manage Products</li>
          <li className="active">Update Product</li>
          {/* <li onClick={() => navigate("/admin-customer-orders")}>Orders</li> */}
          <li>Reports</li>
          <li onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</li>
        </ul>
      </aside>

      <main className="update-product-main">

        <header className="update-page-header">
            
          <button className="btn btn-primary" onClick={() => navigate("/add-product")}>
            + Add New Product
          </button>
          </header>
          
        <div className="update-product-card">
          
           <h2>Update Product</h2>
          {message && <p style={{ textAlign: "center" }}>{message}</p>}

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={product.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="specifications"
              placeholder="Specifications"
              value={product.specifications}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="warranty"
              placeholder="Warranty"
              value={product.warranty}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
  <input
    type="number"
    name="quantity"
    placeholder="Quantity"
    value={product.quantity}
    onChange={handleChange}
  />
</div>


          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: "20px" }}>
            <button className="btn-submit" onClick={handleUpdate}>
              Update Product
            </button>
            <button className="btn-cancel" onClick={() => navigate("/admin-dashboard")}>
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UpdateProduct;
