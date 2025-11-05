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
import { Search, LogOut } from "lucide-react";

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
    <div className="uh-container">
      {/* Header */}
      <header className="uh-header">
        <div className="uh-header-left">
          <img
            src={profilePic}
            alt="Profile"
            className="uh-profile"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
          <h2>Hi, {user.username} 👋</h2>
        </div>
        <button className="uh-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Search Section */}
      <section className="uh-search-section">
        <h3 className="uh-heading">Find Your Favorite Products</h3>

        <form className="uh-search-form" onSubmit={handleSearch}>
          <div className="uh-search-box">
            <Search className="uh-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
            />
          </div>
          <button className="uh-search-btn">Search</button>
        </form>
      </section>

      {/* Categories */}
      <div className="uh-category-section">
        <div className="uh-card" onClick={() => navigate(`/search/headphone`)}>
          <img src={headphones} alt="Headphones" />
          <h5>Headphones</h5>
        </div>

        <div className="uh-card" onClick={() => navigate(`/search/shoes`)}>
          <img src={shoes} alt="Shoes" />
          <h5>Shoes</h5>
        </div>

        <div className="uh-card" onClick={() => navigate(`/search/mobile`)}>
          <img src={smartphoneImg} alt="SmartPhones" />
          <h5>SmartPhones</h5>
        </div>

        <div className="uh-card" onClick={() => navigate(`/search/laptop`)}>
          <img src={LaptopImg} alt="Laptops" />
          <h5>Laptops</h5>
        </div>

        <div className="uh-card" onClick={() => navigate(`/search/watch`)}>
          <img src={Watches} alt="Watches" />
          <h5>Watches</h5>
        </div>
      </div>

      {message && <div className="alert alert-success w-50 mx-auto">{message}</div>}
    </div>
  );
}

export default UserHome;
