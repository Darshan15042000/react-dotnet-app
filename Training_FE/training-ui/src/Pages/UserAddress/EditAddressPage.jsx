import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditAddressPage.css";
import profilePic from "../../assets/images/User_Profile.jpg";

function EditAddressPage() {
  const { id } = useParams(); // Address ID from URL
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

  useEffect(() => {
    if (id) {
      fetchAddressById();
    }
  }, [id]);

  // Fetch address by ID
  const fetchAddressById = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch address");

      const data = await res.json();
      setFormData({
        name: data.name || "",
        mobileNumber: data.mobileNumber || "",
        alternatePhone: data.alternatePhone || "",
        pincode: data.pincode || "",
        addressLine: data.addressLine || "",
        city: data.city || "",
        state: data.state || "",
        landmark: data.landmark || "",
        isDefault: data.isDefault || false,
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Address/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update address");
      }

      navigate("/addresses"); // Back to address list
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
    <div className="editaddress-container">
      {/* Header */}
      <div className="editaddress-header">
        <div className="editaddress-header-left">
          <img src={profilePic} 
                    alt="Profile" 
                    className="editaddress-profile-img"
                    onClick={() => navigate("/user-profile")}
                    title="Go to Profile" 
          />
          <div className="editaddress-user-info">
            <h2>👋 Hi, {localStorage.getItem("username") || "User"}</h2>
            <p>{localStorage.getItem("email") || "user@example.com"}</p>
          </div>
        </div>
        <button
          className="editaddress-logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="editaddress-form-container">
        <h2>Edit Address</h2>
        {error && <p className="editaddress-error">{error}</p>}
        <form className="editaddress-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
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
          <label className="editaddress-default-label">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />{" "}
            Set as default address
          </label>

          <div className="editaddress-btns">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Address"}
            </button>
            <button type="button" className="editaddress-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAddressPage;
