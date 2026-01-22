import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageProductsPage.css"; // <-- use new CSS

function ManageProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/admin/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => (p.id ?? p.Id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    navigate("/update-product", { state: { product } });
  };

  return (
    <div className="manage-products-wrapper">
      {/* Sidebar */}
      <aside className="manage-products-sidebar">
        <h2 className="sidebar-logo">Store</h2>
        <ul>
          <li onClick={() => navigate("/admin-dashboard")}>Dashboard</li>
          <li className="active">Manage Products</li>
          <li onClick={() => navigate("/add-product")}>Add Product</li>
          <li>Reports</li>
          <li onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="manage-products-content">
        <header className="manage-products-header">
          <h1>Manage Products</h1>
          <button
            className="btn-add"
            onClick={() => navigate("/add-product")}
          >
            + Add New Product
          </button>
        </header>

        {loading ? (
          <p className="manage-products-status">Loading products...</p>
        ) : error ? (
          <p className="manage-products-status text-danger">{error}</p>
        ) : products.length === 0 ? (
          <p className="manage-products-status">No products found.</p>
        ) : (
          <div className="manage-products-grid">
            {products.map((p) => {
              const id = p.id ?? p.Id;
              const name = p.name ?? p.Name;
              const price = p.price ?? p.Price;
              const desc = p.description ?? p.Description;
              const imageBase64 = p.imageBase64 ?? p.ImageBase64;
              const imgSrc = imageBase64 ? `data:image/*;base64,${imageBase64}` : null;

              return (
                <div className="manage-products-card" key={id}>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={name}
                      className="manage-products-image"
                    />
                  ) : (
                    <div className="manage-products-noimg">No image</div>
                  )}
                  <div className="manage-products-info">
                    <h4>{name}</h4>
                    <p className="manage-products-desc">{desc || "No description available"}</p>
                    <p className="manage-products-price">₹{Number(price).toLocaleString()}</p>
                    <h6 className="manage-products-date">Date: {new Date(p.createdAt).toLocaleString()}</h6>
                    <div className="manage-products-btns">
                      <button
                        className="manage-products-btn-edit"
                        onClick={() => handleEdit(p)}
                      >
                        Update
                      </button>
                      <button
                        className="manage-products-btn-delete"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ManageProductsPage;
