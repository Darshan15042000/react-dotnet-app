import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginImages.css"; // if you have styles for floating images

// Import images (same as login page)
import shoes1 from "../assets/images/shoes1.png";
import shoes2 from "../assets/images/shoes2.png";
import laptop1 from "../assets/images/laptop1.png";
import laptop2 from "../assets/images/laptop2.png";
import ac from "../assets/images/ac.png";
import ac2 from "../assets/images/ac2.png";
import freezer1 from "../assets/images/freezer1.png";
import freezer2 from "../assets/images/freezer2.png";
import freezer3 from "../assets/images/freezer3.png";
import headphone1 from "../assets/images/headphone1.jpeg";
import headphone2 from "../assets/images/headphone2.png";
import watch1 from "../assets/images/watch1.png";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:7165/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });
      if (!res.ok) {
        alert("Registration failed!");
        return;
      }
      alert("Registration successful! Now login.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="vh-100 register-container d-flex justify-content-center align-items-center position-relative"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2c2c2c, #3a3a3a)",
        overflow: "hidden",
      }}
    >
      {/* Floating images */}
      <img
        onClick={() => navigate("/search/shoes")}
        src={shoes1}
        alt="Shoes1"
        className="login-floating-img md"
        style={{ top: "5%", left: "5%", width: "110px", height: "110px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/shoes")}
        src={shoes2}
        alt="Shoes2"
        className="login-floating-img md"
        style={{ top: "3%", right: "10%", width: "110px", height: "110px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/laptop")}
        src={laptop2}
        alt="Laptop2"
        className="login-floating-img lg"
        style={{ bottom: "1%", right: "50%", transform: "translateX(50%)", width: "130px", height: "130px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/headphone")}
        src={headphone2}
        alt="Headphone2"
        className="login-floating-img sm"
        style={{ bottom: "35%", left: "8%", width: "90px", height: "90px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/freezer")}
        src={freezer2}
        alt="Freezer2"
        className="login-floating-img md"
        style={{ top: "20%", right: "25%", width: "100px", height: "100px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/laptop")}
        src={laptop1}
        alt="Laptop1"
        className="login-floating-img lg"
        style={{ top: "10%", left: "23%", width: "130px", height: "130px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/headphone")}
        src={headphone1}
        alt="Headphone1"
        className="login-floating-img sm"
        style={{ bottom: "23%", right: "27%", width: "90px", height: "90px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/watch")}
        src={watch1}
        alt="Watch"
        className="login-floating-img sm"
        style={{ top: "5%", left: "50%", transform: "translateX(-50%)", width: "90px", height: "90px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/ac")}
        src={ac}
        alt="AC"
        className="login-floating-img md"
        style={{ top: "35%", left: "20%", width: "100px", height: "100px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/ac")}
        src={ac2}
        alt="AC2"
        className="login-floating-img md"
        style={{ top: "40%", right: "12%", width: "100px", height: "100px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/freezer")}
        src={freezer1}
        alt="Freezer1"
        className="login-floating-img md"
        style={{ bottom: "13%", left: "18%", width: "110px", height: "110px", pointerEvents: "none" }}
      />
      <img
        onClick={() => navigate("/search/freezer")}
        src={freezer3}
        alt="Freezer3"
        className="login-floating-img md"
        style={{ bottom: "5%", right: "15%", width: "110px", height: "110px", pointerEvents: "none" }}
      />

      {/* Register card */}
      <div
        className="register-card p-5 rounded-4 shadow position-relative"
        style={{
          background: "linear-gradient(to right, #2a2a2a, #3c3c3c)",
          width: "400px",
          maxWidth: "90%",
          color: "#fff",
        }}
      >
        <h2 className="text-center fw-bold mb-4" style={{ color: "#fc5c7d" }}>
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ backgroundColor: "#1f1f1f", color: "#fff", border: "1px solid #444" }}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: "#1f1f1f", color: "#fff", border: "1px solid #444" }}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#1f1f1f", color: "#fff", border: "1px solid #444" }}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select rounded-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: "#2c2c2c", color: "#fff", border: "1px solid #444" }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold rounded-3 py-2"
            style={{ background: "linear-gradient(90deg, #4e54c8, #fc5c7d)", color: "#fff" }}
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "#8f94fb" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#fc5c7d", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
