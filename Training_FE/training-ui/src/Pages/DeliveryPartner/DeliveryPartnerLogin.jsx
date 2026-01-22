import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DeliveryPartnerLogin.css";

// Delivery Partner Images
import Partner1 from "../../assets/DeliveryImages/Partner1.png";
import Partner2 from "../../assets/DeliveryImages/Partner2.png";
import Partner3 from "../../assets/DeliveryImages/Partner3.png";
import Partner4 from "../../assets/DeliveryImages/Partner4.png";
import Partner5 from "../../assets/DeliveryImages/Partner5.png";
import Partner6 from "../../assets/DeliveryImages/Partner6.webp";
import Partner7 from "../../assets/DeliveryImages/Partner7.png";
import Partner8 from "../../assets/DeliveryImages/Partner8.png";
import Partner9 from "../../assets/DeliveryImages/Partner9.png";

function DeliveryPartnerLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePartnerLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/deliverypartner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password })
      });

      if (!res.ok) {
        alert("Invalid phone number or password!");
        return;
      }

      const data = await res.json();
      localStorage.setItem("partner_token", data.token);
      localStorage.setItem("role", data.role);

      alert("Partner login successful!");
      navigate("/deliverypartner-dashboard");
    }
    catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="partner-login-container">

      {/* Floating Partner Images */}
      <img src={Partner1} className="partner-floating-img sm" style={{ top: "10%", left: "5%", width: "300px", height: "220px" }}  />
      <img src={Partner2} className="partner-floating-img md" style={{ top: "20%", right: "8%", width: "300px",height: "300px"  }} />
      <img src={Partner3} className="partner-floating-img lg" style={{ bottom: "8%", left: "15%" }} />
      <img src={Partner4} className="partner-floating-img sm" style={{ bottom: "12%", right: "15%", width: "200px",height: "200px" }} />
      <img src={Partner5} className="partner-floating-img md" style={{ top: "50%", left: "40%" }} />
      <img src={Partner6} className="partner-floating-img sm" style={{ top: "3%", right: "30%", width: "150px",height: "150px" }} />
      <img src={Partner7} className="partner-floating-img sm" style={{ top: "3%", right: "60%", width: "150px",height: "150px" }} />
      <img src={Partner8} className="partner-floating-img sm" style={{ top: "40%", right: "67%", width: "200px",height: "200px" }} />
      <img src={Partner9} className="partner-floating-img sm" style={{ bottom: "3%", right: "45%", width: "150px",height: "150px" }} />

      {/* LOGIN CARD */}
      <div className="partner-login-card">
        <h2 className="text-center mb-4">Delivery Partner Login</h2>

        <form onSubmit={handlePartnerLogin}>
          <input
            type="text"
            className="form-control partner-input mb-3"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ backgroundColor: "#eee8e8ff", color: "#080808ff", border: "1px solid #444" }}
            required
          />
          

          <input
            type="password"
            className="form-control partner-input mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: "#eee8e8ff", color: "#0e0000ff", border: "1px solid #444" }}
            required
          />

          <button className="partner-btn w-100 mt-2" type="submit">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Not registered?{" "}
          <span className="partner-register" onClick={() => navigate("/deliverypartner-register")}>
            Register as Partner
          </span>
        </p>
      </div>
    </div>
  );
}

export default DeliveryPartnerLogin;
