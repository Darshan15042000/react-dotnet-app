import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DeliveryPartnerRegister.css";

// Images
import Partner1 from "../../assets/DeliveryImages/Partner1.png";
import Partner2 from "../../assets/DeliveryImages/Partner2.png";
import Partner3 from "../../assets/DeliveryImages/Partner3.png";
import Partner4 from "../../assets/DeliveryImages/Partner4.png";
import Partner5 from "../../assets/DeliveryImages/Partner5.png";
import Partner6 from "../../assets/DeliveryImages/Partner6.webp";
import Partner7 from "../../assets/DeliveryImages/Partner7.png";
import Partner8 from "../../assets/DeliveryImages/Partner8.png";
import Partner9 from "../../assets/DeliveryImages/Partner9.png";

function DeliveryPartnerRegister() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handlePartnerRegister = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      phoneNumber,
      pincode,
      email,
      password
    };

    try {
      const res = await fetch("https://localhost:7165/api/deliverypartner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Delivery Partner Registered Successfully!");
      navigate("/deliverypartner-login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="partner-register-container">

      {/* Floating Images */}
      <img src={Partner1} className="partner-reg-img sm" style={{ top: "10%", left: "5%" }} />
      <img src={Partner2} className="partner-reg-img md" style={{ top: "25%", right: "8%" }} />
      <img src={Partner3} className="partner-reg-img lg" style={{ bottom: "10%", left: "10%" }} />
      <img src={Partner4} className="partner-reg-img md" style={{ top: "40%", right: "20%" }} />
      <img src={Partner5} className="partner-reg-img sm" style={{ bottom: "5%", right: "40%" }} />
      <img src={Partner6} className="partner-reg-img sm" style={{ top: "5%", right: "35%" }} />
      <img src={Partner7} className="partner-reg-img sm" style={{ top: "5%", right: "60%" }} />
      <img src={Partner8} className="partner-reg-img md" style={{ top: "50%", left: "45%" }} />
      <img src={Partner9} className="partner-reg-img sm" style={{ bottom: "5%", left: "55%" }} />

      {/* REGISTER CARD */}
      <div className="partner-register-card">
        <h2 className="text-center mb-4">Register as Delivery Partner</h2>

        <form onSubmit={handlePartnerRegister}>

          <input
            type="text"
            className="form-control partner-reg-input mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control partner-reg-input mb-3"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control partner-reg-input mb-3"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />

          <input
            type="email"
            className="form-control partner-reg-input mb-3"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control partner-reg-input mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="partner-reg-btn w-100 mt-2" type="submit">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            className="partner-reg-login-link"
            onClick={() => navigate("/deliverypartner-login")}
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default DeliveryPartnerRegister;
