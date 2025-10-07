import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // default role
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
      navigate("/login"); // go to login page
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
     <div
      className="register-page d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        background: "radial-gradient(circle at top left, #1f1f1f, #2c2c2c, #3a3a3a)",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          top: "10%",
          left: "5%",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          bottom: "10%",
          right: "5%",
        }}
      ></div>

      <div
        className="card p-5 shadow-lg position-relative"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "rgba(40, 40, 40, 0.95)",
          zIndex: 1,
        }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#ff6f91", textShadow: "1px 1px 5px rgba(0,0,0,0.3)" }}
        >
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ borderRadius: "10px", backgroundColor: "white", color: "#fff", border: "1px solid #555" }}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control shadow-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: "10px", backgroundColor: "white", color: "#fff", border: "1px solid #555" }}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "10px", backgroundColor: "white", color: "#fff", border: "1px solid #555" }}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select shadow-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ borderRadius: "10px", backgroundColor: "#2c2c2c", color: "#fff", border: "1px solid #555" }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-gradient btn-lg fw-bold"
              style={{
                background: "linear-gradient(90deg, #ff6f91, #ff9472)",
                color: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <span
            style={{ color: "#ff6f91", cursor: "pointer", fontWeight: "600" }}
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
