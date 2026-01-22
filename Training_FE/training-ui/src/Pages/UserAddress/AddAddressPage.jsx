import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAddressPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function AddAddressPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    alternatePhone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    landmark: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add address");
      }

      navigate("/addresses"); // go back to addresses list
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/addresses");
  };

  return (
    <div className="addaddress-container">
      {/* Header */}
      <div className="addaddress-header">
        <div className="addaddress-header-left">
          <img src={profilePic} 
                  alt="Profile" 
                  className="addaddress-profile-img" 
                  onClick={() => navigate("/user-profile")}
                  title="Go to Profile"
          />
          <div className="addaddress-user-info">
            <h2>👋 Hi, {localStorage.getItem("username") || "User"}</h2>
            <p>{localStorage.getItem("email") || "user@example.com"}</p>
          </div>
        </div>
        <button className="addaddress-logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="addaddress-form-container">
        <h2>Add New Address</h2>
        {error && <p className="addaddress-error">{error}</p>}
        <form className="addaddress-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="alternatePhone"
            placeholder="Alternate Phone (optional)"
            value={formData.alternatePhone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="addressLine"
            placeholder="Address Line"
            value={formData.addressLine}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark (optional)"
            value={formData.landmark}
            onChange={handleChange}
          />
          <label className="addaddress-default-label">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />{" "}
            Set as default address
          </label>

          <div className="addaddress-btns">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add Address"}
            </button>
            <button type="button" className="addaddress-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAddressPage;
