import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState(""); // for dynamic ID input
  const [showIdInput, setShowIdInput] = useState(false); // toggle input box

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/Product`;

  const token = localStorage.getItem("token"); // get JWT from login
  const role = localStorage.getItem("role"); // get role from login

  const navigate = useNavigate(); // initialize navigate

  // Get All Products
  // const getAllProducts = async () => {
  //   try {
  //     const res = await fetch(API_URL, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     const data = await res.json();
  //     setProducts(data);
  //     setMessage("Fetched all products!");
  //     setShowIdInput(false);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Failed to fetch products!");
  //   }
  // };

  // //  Show input for Get Product by ID
  // const handleShowIdInput = () => {
  //   setShowIdInput(true);
  //   setProducts([]);
  //   setMessage("");
  // };

  // //  Get Product by dynamic ID
  // const getProductById = async () => {
  //   if (!searchId) {
  //     setMessage("Please enter an ID!");
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`${API_URL}/${searchId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     const data = await res.json();
  //     setProducts([data]);
  //     setMessage(`Fetched product with ID ${searchId}`);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Failed to fetch product!");
  //   }
  // };

  // Navigate to Add Product page (Admin only)
  const handleAddProduct = () => {
    if (role !== "Admin") {
      setMessage("Only Admin can add products!");
      return;
    }
    navigate("/add-product"); // go to AddProduct page
  };

  

  

  return (
    <div className="container mt-5" style={{ maxWidth: "650px" }}>
      <div className="card shadow-lg p-4 rounded-4">
      <h2 className="text-center mb-4 text-primary fw-bold">Simple Product CRUD Tester (Role: <span className="text-dark">{role}</span>)</h2>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <button
        className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
        onClick={() => navigate("/all-products")}>Get All Products</button>

        <button 
         className="btn btn-secondary px-4 py-2 fw-semibold shadow-sm"
        onClick={()=> navigate("/get-product-by-id")}>Get Product by ID</button>

        {/* Only show Add Product button for Admin */}
        {role === "Admin" && (
          <button
          className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
          onClick={handleAddProduct}>Add Product</button>
        )}

        {role === "Admin" && (
         <button
          className="btn btn-warning px-4 py-2 fw-semibold shadow-sm"
         onClick={()=> navigate("/update-product")}>Update Product</button>
        )} 


        {role === "Admin" && (
         <button 
         className="btn btn-danger px-4 py-2 fw-semibold shadow-sm"
         onClick={()=> navigate("/delete-product")}>Delete Product</button>
        )}  

        
        </div>
      </div>

      {/* Input for dynamic ID
      {showIdInput && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="number"
            placeholder="Enter product ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button  onClick={()=> navigate("/get-product-by-id")}>Search</button>
        </div>
      )} */}

      {/* <p>{message}</p> */}

      {/* <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price} INR - {p.description}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default Product;










