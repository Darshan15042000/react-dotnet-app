import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminHome.css";
import profilePic from '../assets/images/User_Profile.jpg';

// Import Lottie Player
import { Player } from '@lottiefiles/react-lottie-player';

function AdminHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState({ username: "" });

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "Admin" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${query}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="vh-100 admin-bg d-flex flex-column align-items-center">
      {/* Header */}
      <header className="w-100 admin-header d-flex justify-content-between align-items-center px-5 py-3 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <h2 className="m-0 text-white">Welcome, Admin {user.username}</h2>
          <img
            src={profilePic}
            alt="Admin Profile"
            className="profile-img"
            onClick={() => navigate("/admin-profile")}
            title="Go to Admin Profile"
          />
        </div>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Search & CRUD Buttons Container */}
      <section className="container mt-5 text-center">
        <h3 className="mb-4 search-heading">Search Products</h3>

        {/* Search Form */}
        <form className="d-flex justify-content-center mb-5" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control me-2 search-input"
            placeholder="Type product name..."
          />
          <button className="btn btn-search rounded-pill px-4">Search</button>
        </form>

        {/* Admin CRUD Buttons */}
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <button className="btn admin-btn btn-add" onClick={() => navigate("/add-product")}>
            Add Product
          </button>
          <button className="btn admin-btn btn-update" onClick={() => navigate("/update-product")}>
            Update Product
          </button>
          <button className="btn admin-btn btn-delete" onClick={() => navigate("/delete-product")}>
            Delete Product
          </button>
        </div>
      </section>

      {/* Animated Character */}
      <Player
        autoplay
        loop
        src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
        style={{
          height: '150px',
          width: '150px',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
      />
    </div>
  );
}

export default AdminHome;
