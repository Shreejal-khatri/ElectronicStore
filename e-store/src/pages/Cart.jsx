import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: 0,
    padding: 0,
    paddingBottom: 0,
    backgroundColor: "#f9fafb",
  },
  mainContent: { flex: "1" },
  container: {
    padding: "60px 20px",
    minHeight: "70vh",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
  emptyMessage: {
    fontSize: "1.4rem",
    color: "#666",
    textAlign: "center",
    marginTop: "100px",
    fontWeight: "300",
    letterSpacing: "0.5px",
  },
  cartItemCard: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "20px",
    alignItems: "center",
    gap: "30px",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
    position: "relative",
  },
  cartItemCardHover: {
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    borderColor: "#e0e0e0",
    transform: "translateY(-2px)",
  },
  imageContainer: {
    flexShrink: 0,
    width: "160px",
    height: "160px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  imageHover: {
    transform: "scale(1.05)",
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
  detailsContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  itemHeader: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#000",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },
  priceText: {
    fontWeight: "500",
    marginBottom: "15px",
    fontSize: "1.2rem",
    color: "#444",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  quantityButton: {
    backgroundColor: "#000",
    border: "none",
    color: "#fff",
    width: "38px",
    height: "38px",
    fontSize: "1.4rem",
    borderRadius: "8px",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.2s ease",
    position: "relative",
    overflow: "hidden",
  },
  quantityButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  quantityButtonHover: {
    backgroundColor: "#333",
  },
  quantityInput: {
    width: "60px",
    height: "38px",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "500",
    border: "1px solid #ddd",
    borderRadius: "8px",
    color: "#000",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  quantityInputFocus: {
    outline: "none",
    borderColor: "#000",
    boxShadow: "0 0 0 1px #000",
  },
  totalText: {
    fontWeight: "500",
    fontSize: "1.3rem",
    marginBottom: "15px",
    color: "#000",
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    color: "#888",
    padding: "10px 25px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
  },
  removeButtonHover: {
    backgroundColor: "#000",
    color: "#fff",
    borderColor: "#000",
  },
  grandTotal: {
    fontSize: "2rem",
    fontWeight: "300",
    textAlign: "right",
    color: "#000",
    marginTop: "50px",
    paddingTop: "30px",
    borderTop: "1px solid #eee",
    letterSpacing: "1px",
  },
  quantityError: {
    color: "#d32f2f",
    fontSize: "0.9rem",
    marginTop: "5px",
  },
  itemCountBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "8px",
    padding: "4px 8px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  orderButton: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "15px 40px",
    fontSize: "1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "30px",
    fontWeight: "500",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    alignSelf: "flex-end",
  },
  orderButtonHover: {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
  },
  orderButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
    transform: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s ease-in-out infinite",
    marginRight: "10px",
  },
  errorMessage: {
    color: "#d32f2f",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "1rem",
  },
  successMessage: {
    color: "#2e7d32",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "1rem",
  },
};


  //Function to get proper image URL
  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;

  const BASE_URL = import.meta.env.VITE_API_BASE;

  return imagePath.startsWith('/') ? `${BASE_URL}${imagePath}` : `${BASE_URL}/${imagePath}`;
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageHoverIndex, setImageHoverIndex] = useState(null);
  const [removeHoverIndex, setRemoveHoverIndex] = useState(null);
  const [quantityHoverIndex, setQuantityHoverIndex] = useState(null);
  const [inputFocusIndex, setInputFocusIndex] = useState(null);
  const [quantityErrors, setQuantityErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderButtonHover, setOrderButtonHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    const quantity = Math.max(1, Math.min(5, parseInt(newQuantity) || 1));
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (quantityErrors[id]) {
      const newErrors = { ...quantityErrors };
      delete newErrors[id];
      setQuantityErrors(newErrors);
    }
  };

  const handleQuantityInput = (id, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    if (numValue > 5) {
      setQuantityErrors({ ...quantityErrors, [id]: "Maximum quantity is 5" });
      updateQuantity(id, 5);
    } else {
      updateQuantity(id, numValue);
    }
  };

  const incrementQuantity = (id, currentQuantity) => {
    if (currentQuantity >= 5) {
      setQuantityErrors({ ...quantityErrors, [id]: "Maximum quantity is 5" });
      return;
    }
    updateQuantity(id, currentQuantity + 1);
  };

  const decrementQuantity = (id, currentQuantity) => {
    if (currentQuantity <= 1) return;
    updateQuantity(id, currentQuantity - 1);
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderError("Your cart is empty. Add items before placing an order.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderError("Please log in to place an order.");
      navigate("/login");
      return;
    }

    setIsOrdering(true);
    setOrderError("");
    setOrderSuccess("");

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalPrice,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setOrderError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(data.message || "Failed to place order");
      }

      setOrderSuccess("Order placed successfully!");
      setCart([]);
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Order error:", error);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setOrderError("Network error. Please check your connection and try again.");
      } else {
        setOrderError(error.message || "Failed to place order. Please try again.");
      }
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <style>
        {`
          html, body { margin:0;padding:0;height:100%;box-sizing:border-box; }
          * { box-sizing: border-box; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}
      </style>
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={styles.mainContent}>
          <div style={styles.container}>
            <h2 style={styles.heading}>
              Your Cart
              <span style={styles.headingUnderline}></span>
            </h2>
            {cart.length === 0 ? (
              <p style={styles.emptyMessage}>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    key={item._id}
                    style={{
                      ...styles.cartItemCard,
                      ...(hoveredIndex === index ? styles.cartItemCardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div style={styles.itemCountBadge}>Item {index + 1}</div>
                    <div
                      style={styles.imageContainer}
                      onMouseEnter={() => setImageHoverIndex(index)}
                      onMouseLeave={() => setImageHoverIndex(null)}
                    >
                      {imageErrors[item._id] ? (
                        <div style={styles.imagePlaceholder}>Image not available</div>
                      ) : (
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          style={{
                            ...styles.image,
                            ...(imageHoverIndex === index ? styles.imageHover : {}),
                          }}
                          onError={() => handleImageError(item._id)}
                        />
                      )}
                    </div>
                    <div style={styles.detailsContainer}>
                      <h3 style={styles.itemHeader}>{item.name}</h3>
                      <p style={styles.priceText}>Price: Rs {item.price}</p>
                      <div style={styles.quantityContainer}>
                        <button
                          style={{
                            ...styles.quantityButton,
                            ...(item.quantity === 1 ? styles.quantityButtonDisabled : {}),
                            ...(quantityHoverIndex === index * 2 ? styles.quantityButtonHover : {}),
                          }}
                          onClick={() => decrementQuantity(item._id, item.quantity)}
                          disabled={item.quantity === 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          onMouseEnter={() => setQuantityHoverIndex(index * 2)}
                          onMouseLeave={() => setQuantityHoverIndex(null)}
                        >−</button>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={item.quantity}
                          style={{
                            ...styles.quantityInput,
                            ...(inputFocusIndex === index ? styles.quantityInputFocus : {}),
                          }}
                          onChange={(e) => handleQuantityInput(item._id, e.target.value)}
                          onFocus={() => setInputFocusIndex(index)}
                          onBlur={() => setInputFocusIndex(null)}
                          aria-label={`Quantity of ${item.name}`}
                        />
                        <button
                          style={{
                            ...styles.quantityButton,
                            ...(item.quantity >= 5 ? styles.quantityButtonDisabled : {}),
                            ...(quantityHoverIndex === index * 2 + 1 ? styles.quantityButtonHover : {}),
                          }}
                          onClick={() => incrementQuantity(item._id, item.quantity)}
                          disabled={item.quantity >= 5}
                          aria-label={`Increase quantity of ${item.name}`}
                          onMouseEnter={() => setQuantityHoverIndex(index * 2 + 1)}
                          onMouseLeave={() => setQuantityHoverIndex(null)}
                        >+</button>
                      </div>
                      {quantityErrors[item._id] && (
                        <p style={styles.quantityError}>{quantityErrors[item._id]}</p>
                      )}
                      <p style={styles.totalText}>Total: Rs {item.price * item.quantity}</p>
                      <button
                        style={{
                          ...styles.removeButton,
                          ...(removeHoverIndex === index ? styles.removeButtonHover : {}),
                        }}
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                        onMouseEnter={() => setRemoveHoverIndex(index)}
                        onMouseLeave={() => setRemoveHoverIndex(null)}
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                ))}
                <h3 style={styles.grandTotal}>Grand Total: Rs {totalPrice}</h3>
                <div style={styles.buttonContainer}>
                  <button
                    style={{
                      ...styles.orderButton,
                      ...(orderButtonHover ? styles.orderButtonHover : {}),
                      ...(isOrdering || cart.length === 0 ? styles.orderButtonDisabled : {}),
                    }}
                    onClick={placeOrder}
                    disabled={isOrdering || cart.length === 0}
                    onMouseEnter={() => setOrderButtonHover(true)}
                    onMouseLeave={() => setOrderButtonHover(false)}
                  >
                    {isOrdering && <span style={styles.loadingSpinner}></span>}
                    {isOrdering ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
                {orderError && <p style={styles.errorMessage}>{orderError}</p>}
                {orderSuccess && <p style={styles.successMessage}>{orderSuccess}</p>}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
