import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState(null);
  const [productId, setProductId] = useState(null);

  //Function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    return imagePath.startsWith('/') ? `${API_BASE_URL}${imagePath}` : `${API_BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  //Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/products`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Received non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned HTML instead of JSON. Check your API endpoint.');
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleShop = (productId) => {
    if (!token) {
      setProductId(productId);
      setAuthAction('shop');
      setShowAuthModal(true);
      return;
    }
    navigate(`/product/${productId}`);
  };

  const handleShopCollection = () => {
    if (!token) {
      setAuthAction('browse');
      setShowAuthModal(true);
      return;
    }
    navigate("/products");
  };

  const handleFeatureCTA = () => {
    if (!token) {
      setAuthAction('browse');
      setShowAuthModal(true);
      return;
    }
    navigate("/aboutus");
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
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  //Filter products by category
  const laptops = Array.isArray(products) ? products.filter(product => 
    product.category && (product.category.toLowerCase().includes('laptop') || 
    product.category.toLowerCase().includes('computer'))
  ) : [];
  
  const phones = Array.isArray(products) ? products.filter(product => 
    product.category && (product.category.toLowerCase().includes('phone') || 
    product.category.toLowerCase().includes('mobile'))
  ) : [];
  
  const accessories = Array.isArray(products) ? products.filter(product => 
    product.category && (product.category.toLowerCase().includes('accessory') || 
    product.category.toLowerCase().includes('accessories') ||
    (!product.category.toLowerCase().includes('laptop') && 
     !product.category.toLowerCase().includes('computer') &&
     !product.category.toLowerCase().includes('phone') &&
     !product.category.toLowerCase().includes('mobile')))
  ) : [];

  
  const styles = `   /* Animated Background Elements */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  animation: float 15s infinite ease-in-out, pulse 6s infinite ease-in-out;
  opacity: 0.7;
  background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.6), rgba(109, 40, 217, 0.6));
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
}

.floating-element:nth-child(1) {
  width: 300px;
  height: 300px;
  top: 10%;
  left: -10%;
  animation-delay: 0s;
}

.floating-element:nth-child(2) {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -5%;
  animation-delay: -7s;
}

.floating-element:nth-child(3) {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 10%;
  animation-delay: -3s;
}

/* Floating keyframes */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(40px, -30px) rotate(120deg); }
  66% { transform: translate(-30px, 20px) rotate(240deg); }
}

/* Subtle glowing / breathing effect */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 0.9; }
}

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      overflow-x: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    }

    .tech-home {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #000000;
      line-height: 1.6;
      font-weight: 400;
      position: relative;
    }

    /* Animated Background Elements */
    .floating-elements {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .floating-element {
      position: absolute;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 100%);
      border-radius: 50%;
      animation: float 15s infinite ease-in-out;
    }

    .floating-element:nth-child(1) {
      width: 300px;
      height: 300px;
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }

    .floating-element:nth-child(2) {
      width: 200px;
      height: 200px;
      top: 50%;
      right: -5%;
      animation-delay: -7s;
    }

    .floating-element:nth-child(3) {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 10%;
      animation-delay: -3s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    /* Hero Section */
    .tech-hero {
      background: linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%);
      color: #000000;
      padding: 140px 0 120px;
      text-align: center;
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-parallax {
      transform: translateY(${scrollY * 0.3}px);
      transition: transform 0.1s ease-out;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 32px;
      animation: slideUp 1s ease-out;
    }

    .hero-content h1 {
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 800;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: linear-gradient(135deg, #000000 0%, #333333 50%, #666666 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: slideUp 1s ease-out 0.2s both;
    }

    .hero-content p {
      font-size: 1.5rem;
      color: #666666;
      margin-bottom: 40px;
      font-weight: 400;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      animation: slideUp 1s ease-out 0.4s both;
    }

    .hero-cta {
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      animation: slideUp 1s ease-out 0.6s both;
    }

    .btn-hero-primary {
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white;
      border: none;
      padding: 18px 36px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      letter-spacing: -0.01em;
      position: relative;
      overflow: hidden;
    }

    .btn-hero-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .btn-hero-primary:hover::before {
      left: 100%;
    }

    .btn-hero-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .btn-hero-secondary {
      background: white;
      color: #000000;
      border: 2px solid #e5e5e5;
      padding: 16px 36px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: -0.01em;
    }

    .btn-hero-secondary:hover {
      border-color: #000000;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Stats Section */
    .stats-section {
      background: #111;
      padding: 80px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }

    .stat-item {
      padding: 20px;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 800;
      color: #ffffffff;
      margin-bottom: 8px;

    }

    .stat-label {
      font-size: 1rem;
      color: #ffffff;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Category Sections */
    .category-section {
      padding: 120px 0;
      position: relative;
    }

    .category-section:nth-child(odd) {
      background: linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #fafafa 100%);
    }

    .category-section:nth-child(even) {
      background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #ffffff 100%);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
      position: relative;
    }

    .section-badge {
      display: inline-block;
      background: rgba(0, 0, 0, 0.05);
      color: #000000;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 20px;
      color: #000000;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .section-header p {
      font-size: 1.3rem;
      color: #666666;
      max-width: 700px;
      margin: 0 auto 40px;
      line-height: 1.5;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 40px;
      margin: 0 auto;
    }

    .view-all-btn {
      display: block;
      margin: 60px auto 0;
      background: transparent;
      color: #000000;
      border: 2px solid #000000;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .view-all-btn:hover {
      background: #000000;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Enhanced Product Card */
    .product-card {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
      position: relative;
      group: hover;
    }

    .product-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }

    .product-card:hover::before {
      opacity: 1;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 16px 40px rgba(0, 0, 0, 0.12);
    }

    .product-image {
      width: 100%;
      height: 280px;
      background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .product-image::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
    }

    .product-image img {
      max-width: 80%;
      max-height: 80%;
      object-fit: contain;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 2;
    }

    .product-card:hover .product-image img {
      transform: scale(1.08);
    }

    .product-info {
      padding: 32px;
      position: relative;
      z-index: 2;
    }

    .product-category {
      font-size: 0.8rem;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .product-name {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #000000;
      line-height: 1.3;
    }

    .product-description {
      font-size: 1rem;
      color: #666666;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-price-original {
      font-size: 1.1rem;
      color: #999999;
      text-decoration: line-through;
      font-weight: 500;
    }

    .product-button {
      background: #000000;
      color: #ffffff;
      border: none;
      padding: 16px 28px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .product-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .product-button:hover::before {
      left: 100%;
    }

    .product-button:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    /* Feature Section */
    .feature-section {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%);
      padding: 120px 0;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .feature-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.5;
    }

    .feature-content {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      padding: 0 32px;
    }

    .feature-content h3 {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 32px;
      color: #ffffff;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .feature-content p {
      font-size: 1.4rem;
      color: #cccccc;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .feature-cta {
      background: white;
      color: #000000;
      border: none;
      padding: 18px 36px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: -0.01em;
    }

    .feature-cta:hover {
      background: #f0f0f0;
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
    }

    /* Newsletter Section */
    .newsletter-section {
      background: #fafafa;
      padding: 80px 0;
      text-align: center;
    }

    .newsletter-content {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .newsletter-content h4 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #000000;
    }

    .newsletter-content p {
      font-size: 1.1rem;
      color: #666666;
      margin-bottom: 32px;
    }

    .newsletter-form {
      display: flex;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;
    }

    .newsletter-input {
      flex: 1;
      padding: 16px 20px;
      border: 2px solid #e5e5e5;
      border-radius: 50px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .newsletter-input:focus {
      border-color: #000000;
    }

    .newsletter-submit {
      background: #000000;
      color: white;
      border: none;
      padding: 16px 28px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .newsletter-submit:hover {
      background: #333333;
      transform: translateY(-2px);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666666;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 12px;
      color: #000000;
    }

    .empty-state p {
      font-size: 1.1rem;
      margin-bottom: 24px;
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
      .products-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 32px;
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 { 
        font-size: 2.5rem; 
      }
      
      .hero-content p { 
        font-size: 1.2rem; 
      }

      .hero-cta {
        flex-direction: column;
        gap: 16px;
      }

      .btn-hero-primary,
      .btn-hero-secondary {
        width: 280px;
      }

      .products-grid {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin: 0 auto;
        gap: 24px;
      }
      
      .category-section, 
      .feature-section { 
        padding: 80px 0; 
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      .newsletter-form {
        flex-direction: column;
        max-width: 300px;
      }

      .newsletter-input,
      .newsletter-submit {
        width: 100%;
      }

      .auth-modal {
        padding: 24px;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 20px;
      }

      .hero-content {
        padding: 0 20px;
      }

      .tech-hero { 
        padding: 100px 0 80px; 
      }

      .hero-content h1 { 
        font-size: 2rem; 
      }
      
      .hero-content p { 
        font-size: 1.1rem; 
      }
      
      .section-header h2 { 
        font-size: 2rem; 
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .stat-number {
        font-size: 2.5rem;
      }

      .product-info {
        padding: 24px;
      }

      .auth-modal-title {
        font-size: 20px;
      }
    }
  `;

  const heroSlides = [
    {
      title: "Next-Gen Tech Products",
      subtitle: "Engineered for performance. Designed for life."
    },
    {
      title: "Innovation Meets Design",
      subtitle: "Experience the future of technology today."
    },
    {
      title: "Premium Quality Guaranteed",
      subtitle: "Built to exceed your expectations."
    }
  ];

  const CategorySection = ({ title, description, products, badge, onShop }) => (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{badge}</div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        
        {loading ? (
          <div className="empty-state">
            <h3>Loading {title}...</h3>
            <p>Please wait while we fetch our amazing products.</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Error Loading Products</h3>
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.slice(0, 3).map((product) => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={product} 
                  onShop={onShop}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
            {products.length > 3 && (
              <Link to={`/products?category=${title.toLowerCase()}`} className="view-all-btn">
                View All {title} ({products.length} products)
              </Link>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h3>Coming Soon</h3>
            <p>We're working on bringing you the best {title.toLowerCase()} collection.</p>
            <button className="view-all-btn">Notify Me</button>
          </div>
        )}
      </div>
    </section>
  );

  //Auth Modal Component
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
          {authAction === 'shop' 
            ? "You need to be logged in to view product details." 
            : "You need to be logged in to browse our collection."}
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

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="tech-home">
        {/* Authentication Modal */}
        {showAuthModal && <AuthModal />}

        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Hero Section */}
        <section className="tech-hero">
          <div className="hero-parallax">
            <div className="hero-content">
              <div className="hero-badge">● New Collection 2025</div>
              <h1>{heroSlides[currentSlide].title}</h1>
              <p>{heroSlides[currentSlide].subtitle}</p>
              <div className="hero-cta">
                <button className="btn-hero-primary" onClick={handleShopCollection}>
                  Shop Collection
                </button>
                <button className="btn-hero-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Laptops Section */}
        <CategorySection
          title="Laptops"
          description="Powerful computing solutions designed for productivity, creativity, and gaming. From ultrabooks to workstations, find the perfect laptop for your needs."
          products={laptops}
          badge="Performance"
          onShop={handleShop}
        />

        {/* Phones Section */}
        <CategorySection
          title="Phones"
          description="Stay connected with our cutting-edge smartphone collection. Experience the latest in mobile technology with superior cameras, displays, and performance."
          products={phones}
          badge="Mobile Tech"
          onShop={handleShop}
        />

        {/* Accessories Section */}
        <CategorySection
          title="Accessories"
          description="Enhance your tech experience with our premium accessories. From wireless chargers to protective cases, we have everything you need."
          products={accessories}
          badge="Enhance"
          onShop={handleShop}
        />

        {/* Feature Section */}
        <section className="feature-section">
          <div className="container">
            <div className="feature-content">
              <h3>Built for Tomorrow</h3>
              <p>
                Our products combine innovative technology with elegant design to create
                solutions that adapt to your lifestyle and empower your potential. Experience
                the perfect blend of form and function.
              </p>
              <button className="feature-cta" onClick={handleFeatureCTA}>
                Explore Innovation
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for the latest product releases and exclusive offers.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                  required 
                />
                <button type="submit" className="newsletter-submit">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}