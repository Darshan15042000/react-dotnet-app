import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserHome.css";
import profilePic from "../../assets/images/User_Profile.jpg";
import smartphoneImg from "../../Dummy_Pics/SmartPhones.png";
import LaptopImg from "../../Dummy_Pics/Laptops.png";
import Watches from "../../Dummy_Pics/Watch.png";
import shoes from "../../Dummy_Pics/Shoes.png";
import headphones from "../../Dummy_Pics/headphones.png";

function UserHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ username: "" });

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "User" });
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
    <div className="userhome-bg vh-100 d-flex flex-column">
      {/* Header */}
      <header className="header shadow-sm d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center gap-3">
          <h2 style={{ color: "#fff", fontWeight: "bold", margin: 0 }}>
            Hello, {user.username}
          </h2>
          <img
            src={profilePic}
            alt="Profile"
            className="profile-img"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
        </div>
        <button className="btn btn-outline-light btn-lg" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Search Section */}
      <section className="user-section text-center">
        <h3 className="mb-4 title">Find Your Favorite Products</h3>

        {/* Search Form */}
        <form className="d-flex justify-content-center mb-3 search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control me-2 search-input"
            placeholder="Search products..."
          />
          <button className="btn btn-gradient px-4">Search</button>
        </form>

        {/* Category Images */}
        <div className="category-container">
          <div className="category-item" onClick={() => navigate(`/search/headphone`)}>
            <img src={headphones} alt="Headphones" />
            <h5>HeadPhones</h5>
          </div>

          <div className="category-item" onClick={() => navigate(`/search/shoes`)}>
            <img src={shoes} alt="Shoes" />
            <h5>Shoes</h5>
          </div>

          <div className="category-item" onClick={() => navigate(`/search/mobile`)}>
            <img src={smartphoneImg} alt="SmartPhones" />
            <h5>SmartPhones</h5>
          </div>

          <div className="category-item" onClick={() => navigate(`/search/laptop`)}>
            <img src={LaptopImg} alt="Laptops" />
            <h5>Laptops</h5>
          </div>

          <div className="category-item" onClick={() => navigate(`/search/watch`)}>
            <img src={Watches} alt="Watches" />
            <h5>Watches</h5>
          </div>
        </div>

        {message && <div className="alert alert-success w-50">{message}</div>}
      </section>
    </div>
  );
}

export default UserHome;
