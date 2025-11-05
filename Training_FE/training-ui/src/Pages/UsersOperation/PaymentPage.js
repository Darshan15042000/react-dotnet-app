import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profilePic from "../../assets/images/User_Profile.jpg";
import "./PaymentPage.css";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ username: "" });
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [allAddresses, setAllAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [error, setError] = useState("");
  const [isAddressLocked, setIsAddressLocked] = useState(false);
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser({ username: username || "User" });

    if (location.state && location.state.product) {
      const product = location.state.product;
      setCart([
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          description: product.description,
          price: product.price,
          quantity: product.orderQuantity,
          imageBase64: product.imageBase64,
        },
      ]);
    }

    fetchDefaultAddress();
  }, [location.state]);

  // ✅ Fetch Default Address
  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch("https://localhost:7165/api/Address/default", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch default address");
      const data = await res.json();
      setSelectedAddress(data);
    } catch (err) {
      console.error(err);
      setError("No default address found. Please add one.");
    } finally {
      setLoadingAddress(false);
    }
  };

  // ✅ Fetch All Addresses when clicking "Change"
  const fetchAllAddresses = async () => {
    try {
      const res = await fetch("https://localhost:7165/api/Address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch all addresses");
      const data = await res.json();
      setAllAddresses(data);
      setTempSelectedAddress(selectedAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddressChange = async () => {
    await fetchAllAddresses();
    setShowAddressModal(true);
  };

  const handleTempSelect = (address) => {
    setTempSelectedAddress(address);
  };

  const handleDeliverHere = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
      setIsAddressLocked(true);
      setShowAddressModal(false);
    }
  };

  const handleChangeAddress = () => {
    setIsAddressLocked(false);
    handleAddressChange();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Place Order Function
const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert("Please select an address before placing the order");
    return;
  }

  try {
    const product = cart[0];
    const res = await fetch(
      `https://localhost:7165/api/Product/order/${product.id}?quantity=${product.quantity}&addressId=${selectedAddress.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Something went wrong" }));
      alert(error.message);
      return;
    }

    const data = await res.json();
    alert("Order placed successfully!");
    navigate("/orders", { state: { order: data } });
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};



  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
// .payment-input-box
  return (
    <div className="payment-bg">
      {/* Header */}
      <header className="payment-header">
        <div className="payment-header-left">
          <img
            src={profilePic}
            alt="Profile"
            className="payment-profile-img"
            onClick={() => navigate("/user-profile")}
            title="Go to Profile"
          />
          <h2>Hi, {user.username} 👋</h2>
        </div>
        <button className="payment-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <h3 className="payment-title">💳 Payment</h3>

      <div className="payment-container">
        {/* Left Column */}
        <div className="payment-left">
          {/* Delivery Address */}
          <div className="payment-card">
            <h4>Delivery Address</h4>

            {loadingAddress ? (
              <p>Loading address...</p>
            ) : error ? (
              <p className="payment-error">{error}</p>
            ) : selectedAddress ? (
              <>
                <div className="payment-address-details">
                  <p><strong>{selectedAddress.name}</strong></p>
                  <p>{selectedAddress.addressLine}</p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pincode}
                  </p>
                  {selectedAddress.landmark && (
                    <p>Landmark: {selectedAddress.landmark}</p>
                  )}
                  <p>📞 {selectedAddress.mobileNumber}</p>
                </div>

                <div className="payment-address-buttons">
                  {isAddressLocked ? (
                    <button className="payment-btn-change" onClick={handleChangeAddress}>
                      Change
                    </button>
                  ) : (
                    <>
                      <button
                        className="payment-btn-deliver"
                        onClick={() => setIsAddressLocked(true)}
                      >
                        Deliver Here
                      </button>
                      <button
                        className="payment-btn-change"
                        onClick={handleAddressChange}
                      >
                        Change
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                className="payment-btn-edit"
                onClick={() => navigate("/add-address")}
              >
                + Add New Address
              </button>
            )}
          </div>

          {/* Payment Methods */}
          <div className="payment-card">
            <h4>Select Payment Method</h4>
            <div className="payment-methods">
              <div
                className={`payment-method ${selectedPayment === "card" ? "selected" : ""}`}
                onClick={() => setSelectedPayment("card")}
              >
                Credit / Debit Card
              </div>
              <div
                className={`payment-method ${selectedPayment === "upi" ? "selected" : ""}`}
                onClick={() => setSelectedPayment("upi")}
              >
                UPI / Wallet
              </div>
              <div
                className={`payment-method ${selectedPayment === "cod" ? "selected" : ""}`}
                onClick={() => setSelectedPayment("cod")}
              >
                Cash on Delivery
              </div>
            </div>

            {selectedPayment === "card" && (
              <div className="payment-input-box">
                <input type="text" placeholder="Card Number" maxLength="16" />
                <input type="text" placeholder="Name on Card" />
                <div className="payment-card-row">
                  <input type="text" placeholder="Expiry (MM/YY)" maxLength="5" />
                  <input type="password" placeholder="CVV" maxLength="3" />
                </div>
                <button className="payment-btn-pay">Pay ₹{totalAmount + 50}</button>
              </div>
            )}

            {selectedPayment === "upi" && (
              <div className="payment-input-box">
                <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" />
                <button className="payment-btn-verify">
                  Verify & Pay ₹{totalAmount + 50}
                </button>
              </div>
            )}

            {selectedPayment === "cod" && (
  <div className="payment-input-box">
    <p>Pay ₹{totalAmount + 50} in cash upon delivery.</p>
    <button className="payment-btn-pay" onClick={handlePlaceOrder}>
      Place Order
    </button>
  </div>
)}


          </div>
        </div>

        {/* Right Column */}
        <div className="payment-right">
          <div className="payment-card order-summary">
            <h4>Order Summary</h4>
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={
                      item.imageBase64
                        ? `data:image/jpeg;base64,${item.imageBase64}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={item.name}
                  />
                  <div className="order-item-details">
                    <p>{item.name}</p>
                    <p>Brand: {item.brand}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p>Subtotal: ₹{totalAmount}</p>
              <p>Delivery: ₹50</p>
              <p>
                <strong>Total: ₹{totalAmount + 50}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🟣 Address Selection Modal */}
      {showAddressModal && (
        <div className="address-modal">
          <div className="address-modal-content">
            <h3>Select Delivery Address</h3>
            <div className="address-list-scroll">
              {allAddresses.length === 0 ? (
                <p>No addresses found.</p>
              ) : (
                allAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-item ${
                      tempSelectedAddress?.id === addr.id ? "selected" : ""
                    }`}
                    onClick={() => handleTempSelect(addr)}
                  >
                    <p><strong>{addr.name}</strong></p>
                    <p>{addr.addressLine}</p>
                    <p>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p>📞 {addr.mobileNumber}</p>
                    {addr.isDefault && <p className="default-badge">Default</p>}
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button className="payment-btn-deliver" onClick={handleDeliverHere}>
                Deliver Here
              </button>
              <button className="modal-close-btn" onClick={() => setShowAddressModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;



//selectedPayment 