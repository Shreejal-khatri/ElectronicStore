import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const [buttonHover, setButtonHover] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const navigate = useNavigate();

  //Environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL;  
  const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE; 

  //Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to load wishlist');

      const data = await res.json();
      setWishlist(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  //Remove item from wishlist
  const handleRemove = async (id, e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to remove item');

      const updated = await res.json();
      setWishlist(updated);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to remove item');
    }
  };

  const handleProductClick = (productId) => navigate(`/product/${productId}`);
  const handleBackToHome = () => navigate('/');

  const handleCardHover = (id, isHovering) => setHoverStates(prev => ({ ...prev, [id]: isHovering }));
  const handleButtonHover = (name, isHovering) => setButtonHover(prev => ({ ...prev, [name]: isHovering }));
  const handleImageError = (id) => setImageErrors(prev => ({ ...prev, [id]: true }));

  const formatPrice = (price) => `Rs ${Number(price).toFixed(2)}`;

 const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;

  const BASE_URL = import.meta.env.VITE_API_BASE; 

  //Remove leading slash from imagePath to prevent double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

  //Ensure BASE_URL ends with a slash
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

  return `${base}${cleanPath}`;
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: 0,
    padding: 0,
  },
  mainContent: {
    flex: 1,
  },
  container: {
    padding: "60px 20px",
    minHeight: "70vh",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
    color: "#1a1a1a",
    backgroundColor: "#fff",
    borderRadius: "12px",
  },
  heading: {
    fontSize: "2.8rem",
    marginBottom: "40px",
    paddingBottom: "20px",
    fontWeight: "300",
    color: "#000",
    textAlign: "center",
    letterSpacing: "1px",
    textTransform: "uppercase",
    position: "relative",
  },
  headingUnderline: {
    content: '""',
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    backgroundColor: "#000",
  },
  noItems: {
    fontSize: "1.4rem",
    color: "#666",
    textAlign: "center",
    marginTop: "100px",
    fontWeight: "300",
    letterSpacing: "0.5px",
  },
  grid: {
    display: "grid",
    gap: "30px",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    marginBottom: "50px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    height: "100%",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
  imageContainer: {
    height: "280px",
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  imageHover: {
    transform: "scale(1.05)",
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  name: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#2c3e50",
    lineHeight: "1.4",
  },
  description: {
    fontSize: "0.95rem",
    color: "#7f8c8d",
    flexGrow: 1,
    marginBottom: "15px",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: "3",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  price: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#e74c3c",
    marginTop: "10px",
    marginBottom: "15px",
  },
  removeBtn: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    color: "#e74c3c",
    border: "2px solid #e74c3c",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    fontSize: "1rem",
    zIndex: 10,
    position: "relative",
  },
  removeBtnHover: {
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
  backBtn: {
    marginTop: "20px",
    padding: "14px 35px",
    fontSize: "1.1rem",
    color: "#fff",
    backgroundColor: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    fontWeight: "600",
  },
  backBtnHover: {
    backgroundColor: "#1a2634",
    transform: "translateY(-2px)",
  },
  loading: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: "1.3rem",
    color: "#7f8c8d",
  },
  error: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: "1.3rem",
    color: "#e74c3c",
  },
  imagePlaceholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    color: "#999",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};


  if (loading) return (
    <div style={styles.pageWrapper}><Navbar /><div style={styles.mainContent}><div style={styles.loading}>Loading your wishlist...</div></div><Footer /></div>
  );

  if (error) return (
    <div style={styles.pageWrapper}><Navbar /><div style={styles.mainContent}><div style={styles.error}>Error: {error}</div></div><Footer /></div>
  );

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={styles.mainContent}>
        <div style={styles.container}>
          <h1 style={styles.heading}>My Wishlist<span style={styles.headingUnderline}></span></h1>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={styles.noItems}>Your wishlist is empty. Start adding items you love!</p>
              <button
                style={{ ...styles.backBtn, ...(buttonHover['home'] && styles.backBtnHover) }}
                onClick={handleBackToHome}
                onMouseEnter={() => handleButtonHover('home', true)}
                onMouseLeave={() => handleButtonHover('home', false)}
              >Back to Home</button>
            </div>
          ) : (
            <>
              <div style={styles.grid}>
                {wishlist.map(item => (
                  <div
                    key={item._id}
                    style={{ ...styles.card, ...(hoverStates[item._id] && styles.cardHover) }}
                    onClick={() => handleProductClick(item.productId || item._id)}
                    onMouseEnter={() => handleCardHover(item._id, true)}
                    onMouseLeave={() => handleCardHover(item._id, false)}
                  >
                    <div style={styles.imageContainer}>
                      {imageErrors[item._id] ? (
                        <div style={styles.imagePlaceholder}>Image not available</div>
                      ) : (
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          style={{ ...styles.image, ...(hoverStates[item._id] && styles.imageHover) }}
                          onError={() => handleImageError(item._id)}
                        />
                      )}
                    </div>
                    <div style={styles.content}>
                      <div style={styles.name}>{item.name}</div>
                      <div style={styles.description}>{item.description}</div>
                      <div style={styles.price}>{formatPrice(item.price)}</div>
                      <button
                        style={{ ...styles.removeBtn, ...(hoverStates[`btn-${item._id}`] && styles.removeBtnHover) }}
                        onClick={(e) => handleRemove(item._id, e)}
                        onMouseEnter={() => handleCardHover(`btn-${item._id}`, true)}
                        onMouseLeave={() => handleCardHover(`btn-${item._id}`, false)}
                      >Remove from Wishlist</button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                style={{ ...styles.backBtn, ...(buttonHover['home'] && styles.backBtnHover) }}
                onClick={handleBackToHome}
                onMouseEnter={() => handleButtonHover('home', true)}
                onMouseLeave={() => handleButtonHover('home', false)}
              >Back to Home</button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
