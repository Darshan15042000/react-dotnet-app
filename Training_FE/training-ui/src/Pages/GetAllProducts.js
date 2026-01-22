import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function GetAllProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/Product`;
  const token = localStorage.getItem("token");

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
      setMessage("Fetched all products!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch products!");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div style={{ backgroundColor:"lightblue",}} className="container mt-4">
      <h2 className="text-center mb-4 text-primary">All Products</h2>
      {products.length === 0 ? (
        <p className="text-center text-danger">{message}</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div key={p.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: "#f8f9fa", transition: "transform 0.2s" }}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">{p.name}</h5>
                  <p className="card-text text-warning">Price: INR {p.price}</p>
                  {p.description && <p className="card-text text-secondary">{p.description}</p>}
                </div>
                <div className="card-footer bg-white border-0">
                  <small className="text-muted">ID: {p.id}</small>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetAllProducts;
