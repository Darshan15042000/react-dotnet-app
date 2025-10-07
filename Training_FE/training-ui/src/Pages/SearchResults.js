import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchResults.css"; // 👈 new CSS file for styling

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
          setProducts(data);
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

  if (loading) {
    return <div className="text-center mt-5 text-light">Loading...</div>;
  }

  return (
    <div className="searchresults-bg min-vh-100 py-5">
      <div className="container">
        <h2
          className="mb-5 text-center fw-bold"
          style={{
            fontSize: "2.5rem",
            background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 6px rgba(0,0,0,0.4)",
          }}
        >
          Search Results for "{query}"
        </h2>

        {error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <div className="row">
            {products.map((p, index) => (
              <div key={p.id || index} className="col-md-4 mb-4">
                <div className="product-card h-100 shadow-lg d-flex flex-column">
                  {/* Image */}
                  <div className="image-wrapper">
                    {p.imageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${p.imageBase64}`}
                        alt={p.name}
                        className="product-img"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="card-body text-center d-flex flex-column justify-content-between mt-2">
                    <div>
                      <h5 className="product-name text-white">{p.name}</h5>
                      <p className="text-light">{p.description}</p>
                    </div>
                    <div>
                      <h6 className="fw-bold text-gradient">₹{p.price}</h6>
                      <button
                        className="btn btn-gradient mt-2 w-100"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        View Details
                      </button>
                    </div>
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
