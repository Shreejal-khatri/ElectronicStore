import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/products/${id}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        const responseText = await response.text();

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Response is not valid JSON. Content-Type: ${contentType}, Body: ${responseText}`);
        }

        let productData;
        try {
          productData = JSON.parse(responseText);
        } catch (jsonError) {
          throw new Error(`Failed to parse JSON: ${jsonError.message}. Response: ${responseText}`);
        }

        if (!productData || typeof productData !== 'object') {
          throw new Error("Invalid product data received");
        }

        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !product) return;

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const wishlist = await res.json();
          const isProductInWishlist = wishlist.some(item => item._id === product._id);
          setIsInWishlist(isProductInWishlist);
        }
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    };

    if (product) {
      checkWishlistStatus();
    }
  }, [product]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const handleWishlistToggle = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setAuthAction('wishlist');
      setShowAuthModal(true);
      return;
    }

    if (!product) return;

    setWishlistLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      
      if (isInWishlist) {
        const res = await fetch(`${API_BASE_URL}/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          setAuthAction('wishlist');
          setShowAuthModal(true);
          return;
        }

        if (res.ok) {
          setIsInWishlist(false);
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/wishlist/${product._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          setAuthAction('wishlist');
          setShowAuthModal(true);
          return;
        }

        if (res.ok) {
          setIsInWishlist(true);
        } else if (res.status === 400) {
          const errorData = await res.json();
          if (errorData.message === 'Product already in wishlist') {
            setIsInWishlist(true);
          }
        } else {
          throw new Error('Failed to add to wishlist');
        }
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setAuthAction('cart');
      setShowAuthModal(true);
      return;
    }

    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item._id === product._id);

    if (existingIndex >= 0) {
      const newQuantity = cart[existingIndex].quantity + quantity;
      if (newQuantity > 5) {
        alert(`You can only add up to 5 items of ${product.name} to your cart.`);
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      if (quantity > 5) {
        alert(`You can only add up to 5 items of ${product.name} to your cart.`);
        return;
      }
      cart.push({ 
        ...product, 
        quantity: quantity,
        image: product.image || product.imageUrl
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedToCart(true);
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    navigate("/login");
  };

  const handleSignup = () => {
    setShowAuthModal(false);
    navigate("/signup");
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setAuthAction(null);
  };

  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return (
    <div className="loading-spinner" style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '1.2rem'
    }}>
      Loading product details...
    </div>
  );

  if (error || !product) return (
    <div style={{ textAlign: "center", marginTop: "40px", minHeight: "50vh" }}>
      <Navbar />
      <h3>❌ {error || "Product not found!"}</h3>
      <Link 
        to="/products" 
        style={{ 
          marginTop: "20px", 
          display: "inline-block",
          color: '#0066cc',
          textDecoration: 'none'
        }}
      >
        ← Back to Products
      </Link>
      <Footer />
    </div>
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;

    const BASE_URL = import.meta.env.VITE_API_BASE; 

    return imagePath.startsWith('/')
      ? `${BASE_URL}${imagePath}`
      : `${BASE_URL}/${imagePath}`;
  };

  const productImages = [
    getImageUrl(product.imageUrl),
    getImageUrl(product.imageUrl),
    getImageUrl(product.imageUrl),
    getImageUrl(product.imageUrl)
  ];

  // Auth Modal Component
  const AuthModal = () => (
    <div className="auth-modal-overlay" onClick={handleCloseModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleCloseModal}>×</button>
        
        <div className="auth-modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="auth-modal-title">Authentication Required</h2>
        
        <p className="auth-modal-description">
          {authAction === 'wishlist' 
            ? "You need to be logged in to manage your wishlist." 
            : authAction === 'cart'
            ? "You need to be logged in to add items to your cart."
            : "You need to be logged in to continue."}
        </p>
        
        <div className="auth-modal-buttons">
          <button className="auth-modal-btn auth-modal-btn-primary" onClick={handleLogin}>
            Log In
          </button>
          
          <button className="auth-modal-btn auth-modal-btn-secondary" onClick={handleSignup}>
            Create Account
          </button>
        </div>
        
        <p className="auth-modal-footer">
          Join thousands of satisfied tech enthusiasts
        </p>
      </div>
    </div>
  );

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #fafafa;
    }

    .product-details-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 32px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: #fafafa;
      min-height: 100vh;
    }

    .breadcrumb {
      margin-top: 60px;
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .breadcrumb-link {
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: #000;
    }

    .breadcrumb-separator {
      margin: 0 12px;
      color: #d1d5db;
    }

    .product-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      background: #ffffff;
      border-radius: 24px;
      padding: 60px;
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.05),
        0 10px 24px rgba(0, 0, 0, 0.05),
        0 24px 48px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
      position: relative;
      overflow: hidden;
    }

    .product-details::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
    }

    .details-img-section {
      position: relative;
    }

    .image-gallery {
      position: sticky;
      top: 40px;
    }

    .main-image-container {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 20px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .main-image-container:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .main-image-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .zoom-indicator {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .main-image-container:hover .zoom-indicator {
      opacity: 1;
    }

    .thumbnail-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .thumbnail {
      aspect-ratio: 1;
      border-radius: 12px;
      border: 2px solid transparent;
      background: #f8f9fa;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumbnail:hover {
      border-color: #e5e5e7;
      transform: translateY(-2px);
    }

    .thumbnail.active {
      border-color: #000;
    }

    .thumbnail img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .details-info {
      padding-left: 20px;
    }

    .product-badge {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #000 0%, #333 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .product-title {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 700;
      margin-bottom: 12px;
      color: #000;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: linear-gradient(135deg, #000 0%, #333 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .product-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 32px;
      font-weight: 500;
      line-height: 1.4;
    }

    .price-section {
      margin-bottom: 40px;
      padding: 24px 0;
      border-top: 1px solid #f3f4f6;
      border-bottom: 1px solid #f3f4f6;
    }

    .price-current {
      font-size: 2.25rem;
      font-weight: 700;
      color: #000;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .price-original {
      font-size: 1.25rem;
      color: #9ca3af;
      text-decoration: line-through;
      margin-right: 12px;
    }

    .price-discount {
      display: inline-flex;
      align-items: center;
      background: #ef4444;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 8px;
      width: fit-content;
    }

    .quantity-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: #000000;
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
    
    .quantity-btn:hover {
      background: #000000;
      color: #ffffff;
      transform: translateY(-1px);
    }
    
    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #000000;
      color: #ffffff;
      transform: none;
    }

    .quantity-value {
      margin: 0 16px;
      font-size: 1.1rem;
      font-weight: 600;
      min-width: 30px;
      text-align: center;
    }

    .quantity-label {
      font-size: 0.95rem;
      color: #6b7280;
      margin-right: 12px;
      font-weight: 500;
    }

    .product-description {
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 40px;
      border: 1px solid #f3f4f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .description-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f3f4f6;
    }

    .description-content {
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .description-highlights {
      margin-top: 24px;
    }

    .highlights-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      margin-bottom: 12px;
    }

    .highlights-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .highlight-item {
      display: flex;
      align-items: flex-start;
      padding: 8px 0;
      font-size: 0.95rem;
      color: #6b7280;
      line-height: 1.5;
    }

    .highlight-icon {
      color: #22c55e;
      margin-right: 12px;
      margin-top: 2px;
      font-size: 1rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .feature-item:hover {
      background: #f1f3f4;
      transform: translateY(-1px);
    }

    .feature-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #4f46e5;
    }

    .feature-text {
      font-size: 0.95rem;
      font-weight: 500;
      color: #374151;
    }

    .product-specs {
      background: #f8f9fa;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 40px;
    }

    .specs-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      margin-bottom: 16px;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .spec-row:last-child {
      border-bottom: none;
    }

    .spec-label {
      font-weight: 500;
      color: #6b7280;
      font-size: 0.95rem;
    }

    .spec-value {
      font-weight: 600;
      color: #000;
      font-size: 0.95rem;
    }

    .stock-indicator {
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      padding: 16px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
    }

    .stock-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .stock-text {
      font-weight: 500;
      color: #166534;
      font-size: 0.95rem;
    }

    .action-section {
      margin-top: 40px;
    }

    .button-group {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .btn-primary {
      flex: 1;
      background: ${addedToCart ? '#22c55e' : 'linear-gradient(135deg, #000 0%, #333 100%)'};
      color: white;
      border: none;
      padding: 18px 32px;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: ${addedToCart ? 'default' : 'pointer'};
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      letter-spacing: -0.01em;
      position: relative;
      overflow: hidden;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .btn-primary:hover::before {
      left: ${addedToCart ? '-100%' : '100%'};
    }

    .btn-primary:hover {
      transform: ${addedToCart ? 'none' : 'translateY(-2px)'};
      box-shadow: ${addedToCart ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.2)'};
    }

    .btn-secondary {
      flex: 1;
      background: ${isInWishlist ? '#dc2626' : 'white'};
      color: ${isInWishlist ? 'white' : '#000'};
      border: 2px solid ${isInWishlist ? '#dc2626' : '#e5e7eb'};
      padding: 16px 32px;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: ${wishlistLoading ? 'default' : 'pointer'};
      transition: all 0.2s ease;
      letter-spacing: -0.01em;
      position: relative;
      opacity: ${wishlistLoading ? 0.7 : 1};
    }

    .btn-secondary:hover {
      border-color: ${isInWishlist ? '#dc2626' : '#000'};
      transform: ${wishlistLoading ? 'none' : 'translateY(-2px)'};
      box-shadow: ${wishlistLoading ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.1)'};
      background: ${isInWishlist ? '#b91c1c' : 'white'};
    }

    .btn-secondary:active {
      transform: translateY(0);
    }

    .payment-options {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      margin-top: 24px;
    }

    .payment-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .payment-icons {
      display: flex;
      gap: 8px;
    }

    .payment-icon {
      width: 32px;
      height: 20px;
      background: #e5e7eb;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      color: #6b7280;
    }

    .trust-badges {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32px;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
      border-radius: 12px;
    }

    .trust-badge {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: #6b7280;
      font-weight: 500;
    }

    .trust-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      color: #22c55e;
    }

    /* Auth Modal Styles */
    .auth-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .auth-modal {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
    }

    .auth-modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .auth-modal-icon {
      text-align: center;
      margin-bottom: 20px;
    }

    .auth-modal-icon svg {
      width: 60px;
      height: 60px;
      color: #6366f1;
    }

    .auth-modal-title {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 16px;
      color: #1f2937;
    }

    .auth-modal-description {
      text-align: center;
      color: #6b7280;
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .auth-modal-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .auth-modal-btn {
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .auth-modal-btn-primary {
      background: #000;
      color: white;
    }

    .auth-modal-btn-primary:hover {
      background: #333;
    }

    .auth-modal-btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .auth-modal-btn-secondary:hover {
      background: #e5e7eb;
    }

    .auth-modal-footer {
      text-align: center;
      margin-top: 24px;
      color: #9ca3af;
      font-size: 14px;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .product-details {
        gap: 60px;
        padding: 40px;
      }
    }

    @media (max-width: 768px) {
      .product-details-container {
        padding: 20px 16px;
      }

      .product-details {
        grid-template-columns: 1fr;
        gap: 40px;
        padding: 32px 24px;
      }

      .details-info {
        padding-left: 0;
      }

      .image-gallery {
        position: static;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }

      .trust-badges {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .payment-options {
        flex-direction: column;
        gap: 12px;
      }

      .auth-modal {
        padding: 24px;
      }
    }

    @media (max-width: 480px) {
      .product-title {
        font-size: 2rem;
      }

      .price-current {
        font-size: 1.75rem;
      }

      .thumbnail-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .auth-modal-title {
        font-size: 20px;
      }
    }
  `;

  return (
    <>
      <Navbar />
      <style>{styles}</style>

      {/* Authentication Modal */}
      {showAuthModal && <AuthModal />}

      <div className="product-details-container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">›</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-details">
          <div className="details-img-section">
            <div className="image-gallery">
              <div className="main-image-container">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
                <div className="zoom-indicator">🔍</div>
              </div>
              <div className="thumbnail-grid">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="details-info">
            <div className="product-badge">New Arrival</div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-subtitle">{product.description}</p>

            <div className="price-section">
              <div className="price-current">Rs {product.price}</div>
              <div>
                <span className="price-original">Rs {(product.price * 1.2).toFixed(2)}</span>
                <span className="price-discount">20% OFF</span>
              </div>
            </div>

            <div className="quantity-selector">
              <span className="quantity-label">Quantity:</span>
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >-</button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                disabled={quantity >= 5}
              >+</button>
            </div>

            <div className="product-description">
              <h3 className="description-title">Product Description</h3>
              <div className="description-content">
                {product.description || 'No detailed description available for this product.'}
              </div>

              {(product.features || product.highlights) && (
                <div className="description-highlights">
                  <h4 className="highlights-title">Key Features</h4>
                  <ul className="highlights-list">
                    {product.features ? 
                      product.features.map((feature, index) => (
                        <li key={index} className="highlight-item">
                          <span className="highlight-icon">✓</span>
                          <span>{feature}</span>
                        </li>
                      )) :
                      ['Premium build quality', 'Durable design', 'Warranty included', 'Compatible with accessories'].map((feature, index) => (
                        <li key={index} className="highlight-item">
                          <span className="highlight-icon">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              )}
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Premium Quality</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚚</div>
                <div className="feature-text">Free Shipping</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">Secure Payment</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">↩</div>
                <div className="feature-text">Easy Returns</div>
              </div>
            </div>

            <div className="product-specs">
              <h3 className="specs-title">Specifications</h3>
              <div className="spec-row">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category || 'General'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Brand</span>
                <span className="spec-value">Premium Brand</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Material</span>
                <span className="spec-value">High Quality</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Warranty</span>
                <span className="spec-value">2 Years</span>
              </div>
            </div>

            <div className="stock-indicator">
              <div className="stock-dot"></div>
              <span className="stock-text">{product.stock || 0} items in stock - Order now!</span>
            </div>

            <div className="action-section">
              <div className="button-group">
                <button 
                  className="btn-primary" 
                  onClick={addToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? '...' : isInWishlist ? '❤ Wishlisted' : '♡ Wishlist'}
                </button>
              </div>

              <div className="payment-options">
                <span className="payment-text">Secure payments with</span>
                <div className="payment-icons">
                  <div className="payment-icon">VISA</div>
                  <div className="payment-icon">MC</div>
                  <div className="payment-icon">AMEX</div>
                  <div className="payment-icon">PP</div>
                </div>
              </div>

              <div className="trust-badges">
                <div className="trust-badge">
                  <div className="trust-icon">🛡️</div>
                  <span>SSL Secured</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">✓</div>
                  <span>Verified Seller</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">⭐</div>
                  <span>5 Star Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}