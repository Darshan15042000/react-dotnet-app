import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

import shoes1 from "../assets/images/shoes1.png";
import shoes2 from "../assets/images/shoes2.png";
import shoes3 from "../assets/images/shoes3.png";
import headphone2 from "../assets/images/headphone2.png";
import laptop1 from "../assets/images/laptop1.png";
import laptop2 from "../assets/images/laptop2.png";
import phone2 from "../assets/images/phone2.png";
import watch1 from "../assets/images/watch1.png";
import ac from "../assets/images/ac.png";
import ac2 from "../assets/images/ac2.png";
import freezer1 from "../assets/images/freezer1.png";
import freezer2 from "../assets/images/freezer2.png";

import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
   

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [ghost, setGhost] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (query) navigate(`/search/${query}`);
  };

  const handleTyping = async (value) => {
    setSearch(value);
    setGhost("");

    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/product/suggest?term=${value}`
      );
      const data = await res.json();
      setSuggestions(data);

      if (
        data.length > 0 &&
        data[0].label.toLowerCase().startsWith(value.toLowerCase())
      ) {
        setGhost(data[0].label.slice(value.length));
      }
    } catch {
      setSuggestions([]);
      setGhost("");
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && ghost) {
      e.preventDefault();
      setSearch(search + ghost);
      setGhost("");
      setSuggestions([]);
    }
  };

  return (
    <div
      className="home-container vh-100 d-flex justify-content-center align-items-center position-relative"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2c2c2c, #3a3a3a)",
        overflow: "hidden",
      }}
    >

      {/* Floating Images */}
      <img onClick={() => navigate('/search/shoes')} src={shoes1} alt="Shoes1" className="floating-img" style={{ top: "5%", left: "5%", width: "100px", height: "100px" }} />
      <img onClick={() => navigate('/search/shoes')} src={shoes2} alt="Shoes2" className="floating-img" style={{ top: "15%", right: "10%", width: "110px", height: "110px" }} />
      <img onClick={() => navigate('/search/shoes')} src={shoes3} alt="Shoes3" className="floating-img" style={{ top: "30%", left: "15%", width: "100px", height: "100px" }} />
      <img onClick={() => navigate('/search/headphone')} src={headphone2} alt="Headphone" className="floating-img" style={{ bottom: "20%", left: "20%", width: "110px", height: "110px" }} />
      <img onClick={() => navigate('/search/laptop')} src={laptop1} alt="Laptop1" className="floating-img" style={{ bottom: "25%", right: "15%", width: "120px", height: "120px" }} />
      <img onClick={() => navigate('/search/laptop')} src={laptop2} alt="Laptop2" className="floating-img" style={{ top: "40%", left: "40%", width: "100px", height: "100px" }} />
      <img onClick={() => navigate('/search/mobile')} src={phone2} alt="Phone2" className="floating-img" style={{ bottom: "10%", left: "50%", width: "100px", height: "100px", transform: "translateX(-50%)" }} />
      <img onClick={() => navigate('/search/watch')} src={watch1} alt="Watch" className="floating-img" style={{ top: "10%", left: "35%", width: "90px", height: "90px" }} />
      <img onClick={() => navigate('/search/ac')} src={ac} alt="AC" className="floating-img" style={{ top: "35%", right: "50%", width: "110px", height: "110px" }} />
      <img onClick={() => navigate('/search/ac')} src={ac2} alt="AC2" className="floating-img" style={{ bottom: "35%", right: "40%", width: "100px", height: "100px" }} />
      <img onClick={() => navigate('/search/freezer')} src={freezer1} alt="Freezer1" className="floating-img" style={{ bottom: "15%", left: "65%", width: "110px", height: "110px" }} />
      <img onClick={() => navigate('/search/freezer')} src={freezer2} alt="Freezer2" className="floating-img" style={{ top: "10%", right: "30%", width: "100px", height: "100px" }} />

      {/* Main Center Container */}
      <div className="main-container text-center p-5 rounded-4 shadow-lg position-relative"
        style={{ background: "linear-gradient(to right, #2a2a2a, #3c3c3c)", color: "#fff", width: "450px", maxWidth: "90%", zIndex: 10 }}>

        <h1 className="mb-4 fw-bold" style={{ color: "#fc5c7d" }}>Welcome to Store</h1>

        {/* Search */}
        <form className="d-flex mb-2 position-relative" onSubmit={handleSearch}>
          <div style={{ position: "relative", width: "100%" }}>

            {ghost && (
              <div style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                fontSize: "16px",
                zIndex: 5
              }}>
                <span style={{ color: "#000" }}>{search}</span>
                <span style={{ color: "#999" }}>{ghost}</span>
              </div>
            )}

            <input
              autoComplete="off"
              type="text"
              name="search"
              value={search}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-control"
              placeholder="Search products..."
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #444",
                position: "relative",
                zIndex: 2
              }}
            />
          </div>

          <button className="btn px-4 ms-2"
            style={{ background: "linear-gradient(90deg, #4e54c8, #fc5c7d)", color: "#fff" }}>
            Search
          </button>
        </form>

        {suggestions.length > 0 && (
          <div style={{ background: "#222", borderRadius: "10px", marginTop: "5px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
            {suggestions.map((item, i) => (
              <div key={i}
                onClick={() => {
                  setSuggestions([]);
                  setSearch(item.label);
                  navigate(`/search/${item.value}`);
                }}
                style={{ padding: "10px 14px", cursor: "pointer", color: "#fff", borderBottom: "1px solid #333" }}>
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* USER + PARTNER BUTTONS */}
        <div className="d-flex flex-column align-items-center gap-3 mt-3">

          <div className="d-flex gap-3">
            <button className="btn px-4 py-2"
              style={{ background: "transparent", border: "1px solid #fff", color: "#fff" }}
              onClick={() => navigate("/login")}>Login</button>

            <button className="btn px-4 py-2"
              style={{ background: "#4e54c8", color: "#fff", border: "none" }}
              onClick={() => navigate("/register")}>Register</button>
          </div>

          <div className="d-flex gap-3">
            <button className="btn px-4 py-2"
              style={{ background: "#1abc9c", color: "#fff", border: "none" }}
              onClick={() => navigate("/deliverypartner-login")}>Login As Partner</button>

            <button className="btn px-4 py-2"
              style={{ background: "#16a085", color: "#fff", border: "none" }}
              onClick={() => navigate("/deliverypartner-register")}>Register As Partner</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
