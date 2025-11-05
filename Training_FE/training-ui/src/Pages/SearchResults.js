import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchResults.css";
import { Heart, ShoppingCart, Star } from "lucide-react";

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
        const res = await fetch(`https://localhost:7165/api/product/search/${query}`);
        if (!res.ok) {
          if (res.status === 404) {
            setProducts([]);
            setError("No products found.");
          } else {
            throw new Error("Failed to fetch products");
          }
        } else {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  if (loading) return <div className="modern-loading">Loading...</div>;

  return (
    <div className="modern-bg">
      <div className="container">
        <h2 className="modern-title">
          Search Results for "<span className="modern-highlight">{query}</span>"
        </h2>

        {error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="row g-4">
            {products.map((p, idx) => (
              <div key={p.id || idx} className="col-md-4 col-sm-6">
                <div className="modern-card">
                  <div className="modern-img-wrapper">
                    {p.imageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${p.imageBase64}`}
                        alt={p.name}
                        className="modern-product-img"
                      />
                    ) : (
                      <div className="modern-no-image">No Image</div>
                    )}
                    <div className="modern-floating-icons">
                      <Heart size={20} color="#ff4757" title="Wishlist"/>
                      <Star size={20} color="#ffa502" title="Favorite"/>
                    </div>
                  </div>

                  <div className="modern-product-info">
                    <h5 className="modern-product-name">{p.name}</h5>
                    <p className="modern-product-description">{p.description || "No description"}</p>
                    <div className="modern-product-price">₹{p.price}</div>
                    <button
                      className="modern-btn-view w-100"
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      View Details <ShoppingCart size={18} style={{marginLeft: "5px"}}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
