import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

 
  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;

  const BASE_URL = import.meta.env.VITE_API_BASE;

  return imagePath.startsWith('/') ? `${BASE_URL}${imagePath}` : `${BASE_URL}/${imagePath}`;
};


  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({}); 
    } else {
      setSearchParams({ category });
    }
  };

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
        setFilteredProducts(data);
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

  //Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(
        product => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    switch(sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; 
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption]);
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "laptops", name: "Laptops" },
    { id: "phones", name: "Phones" },
    { id: "accessories", name: "Accessories" }
  ];


   const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .products-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 32px;
      background: #fafafa;
      min-height: 100vh;
    }

    .page-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .page-title {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 700;
      margin-bottom: 16px;
      color: #000;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: linear-gradient(135deg, #000 0%, #333 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .products-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .category-filters {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .category-filter {
      padding: 12px 24px;
      border-radius: 50px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-filter:hover {
      border-color: #000;
      transform: translateY(-2px);
    }

    .category-filter.active {
      background: #000;
      color: #fff;
      border-color: #000;
    }

    .category-count {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .sort-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sort-label {
      font-weight: 500;
      color: #6b7280;
    }

    .sort-select {
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      font-size: 0.95rem;
      cursor: pointer;
    }

    .subcategory-filters {
      display: flex;
      gap: 12px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .subcategory-filter {
      padding: 8px 16px;
      border-radius: 30px;
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .subcategory-filter:hover {
      border-color: #000;
    }

    .subcategory-filter.active {
      background: #000;
      color: #fff;
      border-color: #000;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 60px;
    }

    .product-card {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.05),
        0 4px 12px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 10px 24px rgba(0, 0, 0, 0.08),
        0 20px 48px rgba(0, 0, 0, 0.06);
    }

    .product-image-container {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background: #f8f9fa;
      position: relative;
      overflow: hidden;
    }

    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: linear-gradient(135deg, #000 0%, #333 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-info {
      padding: 24px;
    }

    .product-category {
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .product-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: #000;
      line-height: 1.4;
    }

    .product-description {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 20px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-price-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
    }

    .product-original-price {
      font-size: 1rem;
      color: #9ca3af;
      text-decoration: line-through;
      margin-right: 8px;
    }

    .product-discount {
      display: inline-flex;
      align-items: center;
      background: #ef4444;
      color: white;
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .add-to-cart-btn {
      background: #000;
      color: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .add-to-cart-btn:hover {
      background: #333;
      transform: scale(1.05);
    }

    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .no-products-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: #000;
    }

    .no-products-text {
      color: #6b7280;
      max-width: 500px;
      margin: 0 auto;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .products-page-container {
        padding: 40px 20px;
      }

      .products-controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .category-filters {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 10px;
      }

      .subcategory-filters {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 10px;
      }

      .sort-container {
        width: 100%;
        justify-content: flex-end;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 24px;
      }
    }

    @media (max-width: 480px) {
      .products-grid {
        grid-template-columns: 1fr;
      }

      .category-filter {
        padding: 10px 16px;
        font-size: 0.9rem;
      }
      
      .subcategory-filter {
        padding: 6px 12px;
        font-size: 0.8rem;
      }
    }
  `;

  if (loading) return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="products-page-container">
        <div className="loading-spinner" style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '1.2rem'
        }}>
          Loading products...
        </div>
      </div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="products-page-container">
        <h1>Error Loading Products</h1>
        <p>{error}</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="products-page-container">
        <div className="page-header">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">Discover our latest collection of premium tech products</p>
        </div>

        <div className="products-controls">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-filter ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
                <span className="category-count">
                  ({cat.id === 'all' ? products.length : products.filter(p => p.category.toLowerCase() === cat.id).length})
                </span>
              </button>
            ))}
          </div>

          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select
              className="sort-select"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-container">
                  <img 
                    src={getImageUrl(product.imageUrl)} 
                    alt={product.name} 
                    className="product-image"
                    onError={e => e.target.src = "https://via.placeholder.com/200x200?text=No+Image"}
                  />
                  <div className="product-badge">{product.category}</div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price-container">
                    <span className="product-price">Rs {product.price}</span>
                    <button className="add-to-cart-btn">+</button>
                  </div>
                </div>
              </Link>
            </div>
          )) : (
            <div className="no-products">
              <h3 className="no-products-title">No products found</h3>
              <p className="no-products-text">Try selecting a different category or check back later for new products.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}