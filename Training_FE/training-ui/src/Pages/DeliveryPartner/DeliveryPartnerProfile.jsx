import React, { useEffect, useState } from "react";
import "./DeliveryPartnerProfile.css";

function DeliveryPartnerProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("partner_token");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/deliverypartner/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("partner_token");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/deliverypartner/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        alert("Failed to update profile");
        return;
      }

      alert("Profile Updated Successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="dp-loading">Loading Profile...</div>;

  return (
    <div className="dp-profile-wrapper">

      {/* LEFT CARD */}
      <div className="dp-profile-left pastel-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          alt="profile"
          className="dp-profile-photo"
        />

        <h2 className="dp-name">{profile.name}</h2>
        <p className="dp-role">Delivery Partner</p>

        <div className="dp-basic-info">
          <p><strong>📞 Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>📧 Email:</strong> {profile.email}</p>
          <p><strong>📍 Pincode:</strong> {profile.pincode}</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="dp-profile-right pastel-card">
        <h2 className="dp-section-title">Profile Details</h2>

        <form onSubmit={handleUpdate} className="dp-form-container">

          <div className="dp-field-row">
            <label>Name</label>
            <input
              type="text"
              value={profile.name}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="dp-field-row">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="dp-field-row">
            <label>Phone Number</label>
            <input
              type="text"
              value={profile.phoneNumber}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
            />
          </div>

          <div className="dp-field-row">
            <label>Pincode</label>
            <input
              type="text"
              value={profile.pincode}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, pincode: e.target.value })
              }
            />
          </div>

          <div className="dp-field-row">
            <label>Max Active Orders</label>
            <input
              type="number"
              value={profile.maxActiveOrders}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  maxActiveOrders: parseInt(e.target.value),
                })
              }
            />
          </div>

          {!editMode ? (
            <button
              type="button"
              className="dp-btn edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="dp-btn-group">
              <button type="submit" className="dp-btn save-btn">
                Save
              </button>
              <button
                type="button"
                className="dp-btn cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default DeliveryPartnerProfile;
