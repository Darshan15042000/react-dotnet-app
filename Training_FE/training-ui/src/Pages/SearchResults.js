import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";
import { ShoppingCart } from "lucide-react";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Product/search/${query}`);
                                
// https://ecommerce-be-api-j785.onrender.com/api/Product/1'
        if (!res.ok) {
          if (res.status === 404) {
            setProducts([]);
            setError("No products found.");
          } else throw new Error("Failed to fetch");
        } else {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);


  if (loading) return <h2 className="loading-screen">Loading...</h2>;

  return (
    <div className="search-wrapper">
      <div style={{ width:"95%" }}>

        <h2 className="search-title">
          Search Results for <span>"{query}"</span>
        </h2>

        {error ? (
          <p style={{textAlign:"center",color:"red",fontSize:"18px",fontWeight:"600"}}>{error}</p>
        ) : (
          <div className="results-box">

            {products.map((p, index) => (
              <div className="result-card" key={index}>

                <div className="card-img-box">
                  {p.imageBase64 ? 
                    <img src={`data:image/jpeg;base64,${p.imageBase64}`} alt={p.name}/> 
                    : <span>No Image</span>}
                </div>

                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.description}</div>
                <div className="product-price">₹{p.price}</div>

                <button className="view-btn" onClick={()=>navigate(`/product/${p.id}`)}>
                  View Details <ShoppingCart size={18}/>
                </button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
