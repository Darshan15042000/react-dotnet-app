import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginImages.css";   // 👈 new css

// Import multiple images
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




function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                alert("Login failed!");
                return;
            }

            // Backend can return token + role as JSON instead of plain string
            const data = await res.json();
            localStorage.setItem("token", data.token); //  token stored in react localstorage api
            localStorage.setItem("role", data.role);
            localStorage.setItem("username",data.username)
            alert("Login successful! Token saved.");
            //console.log("JWT Token:", data.token);


            //check user is admin or normal user

            if(data.role === "Admin")
            {
              navigate("/admin-dashboard");
            }
            else{
                  navigate("/user-home");
            }

             
        } catch (err) {
            console.error("Error:", err);
        }
  };

  
  

  return (
 <div
      className="vh-100 login-container d-flex justify-content-center align-items-center position-relative"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2c2c2c, #3a3a3a)",
        overflow: "hidden",
      }}
    >
{/* Shoes Nike */}
<img onClick={()=> navigate('/search/shoes')}src={shoes1} alt="Shoes1" className="login-floating-img md" style={{ top: "5%", left: "5%", width: "110px", height: "110px" }} />
{/* Shoes2 - keep top but a bit higher */}
<img onClick={()=> navigate('/search/shoes')} src={shoes2} alt="Shoes2" className="login-floating-img md" 
     style={{ top: "3%", right: "10%", width: "110px", height: "110px" }} />

{/* Laptop - moved below Register button */}
<img onClick={()=> navigate('/search/laptop')} src={laptop2} alt="Laptop2" className="login-floating-img lg" style={{ bottom: "8%", right: "50%", transform: "translateX(50%)", width: "130px", height: "130px" }} />

{/*asus tug gaming */}
<img onClick={()=> navigate('/search/headphone')} src={headphone2} alt="Headphone2" className="login-floating-img sm" style={{ bottom: "35%", left: "8%", width: "90px", height: "90px" }} />

{/* Freezer2 - stays near shoes but slight gap */}
<img onClick={()=> navigate('/search/freezer')}
src={freezer2} alt="Freezer2" className="login-floating-img md" 
     style={{ top: "20%", right: "25%", width: "100px", height: "100px" }} />

{/*laptop with shade */}
<img onClick={()=> navigate('/search/laptop')} src={laptop1} alt="Laptop1" className="login-floating-img lg" style={{ top: "10%", left: "27%", width: "130px", height: "130px" }} />
{/* Headphone1 - Emote */}
<img onClick={()=> navigate('/search/headphone')} src={headphone1} alt="Headphone1" className="login-floating-img sm" 
     style={{ bottom: "23%", right: "27%", width: "90px", height: "90px" }} />

     {/* casio watch */}
<img onClick={()=> navigate('/search/watch')} src={watch1} alt="Watch" className="login-floating-img sm" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: "90px", height: "90px" }} />


{/* Animated Freeze */}
<img onClick={()=> navigate('/search/ac')} src={ac} alt="AC" className="login-floating-img md" style={{ top: "35%", left: "20%", width: "100px", height: "100px" }} />
{/* AC2 - push a little lower */}
<img onClick={()=> navigate('/search/ac')} src={ac2} alt="AC2" className="login-floating-img md" 
     style={{ top: "40%", right: "12%", width: "100px", height: "100px" }} />

     {/* freeze with food */}
<img onClick={()=> navigate('/search/freezer')} src={freezer1} alt="Freezer1" className="login-floating-img md" style={{ bottom: "13%", left: "18%", width: "110px", height: "110px" }} />


{/* Freezer3 - lowest on right side */}
<img onClick={()=> navigate('/search/freezer')} src={freezer3} alt="Freezer3" className="login-floating-img md" 
     style={{ bottom: "5%", right: "15%", width: "110px", height: "110px" }} />




      {/* Login card */}
      <div
        className="login-card p-5 rounded-4 shadow position-relative"
        style={{
          background: "linear-gradient(to right, #2a2a2a, #3c3c3c)",
          width: "400px",
          maxWidth: "90%",
          color: "#fff",
        }}
      >
        <h2 className="text-center fw-bold mb-4" style={{ color: "#fc5c7d" }}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ backgroundColor: "#eee8e8ff", color: "#fff", border: "1px solid #444" }}
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
              style={{ backgroundColor: "#f7f6f6ff", color: "#fff", border: "1px solid #444" }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold rounded-3 py-2"
            style={{ background: "linear-gradient(90deg, #4e54c8, #fc5c7d)", color: "#fff" }}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "#8f94fb" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#fc5c7d", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
