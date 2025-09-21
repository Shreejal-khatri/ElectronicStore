export default function ProductCard({ product, onShop }) {
  if (!product) return null;

  const handleClick = () => {
    if (onShop) onShop(product._id || product.id);
  };

  const getImageUrl = (imagePath) => {
    const API_BASE = import.meta.env.VITE_API_BASE; 

    if (!imagePath) return `${API_BASE}/uploads/placeholder-image.jpg`;

    if (imagePath.startsWith('http')) return imagePath;

    
    return imagePath.startsWith('/uploads') ? `${API_BASE}${imagePath}` : `${API_BASE}/uploads/${imagePath}`;
  };

  const imageUrl = getImageUrl(product.imageUrl || product.image);

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageUrl} 
          alt={product.name} 
          onError={(e) => e.target.src = `${import.meta.env.VITE_API_BASE}/uploads/placeholder-image.jpg`} 
        />
      </div>
      
      <div className="product-info">
        {product.category && <div className="product-category">{product.category}</div>}
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-description">{product.description}</p>}
        <div className="product-price">Rs {product.price}</div>
        <button className="product-button" onClick={handleClick}>
          View Details
        </button>
      </div>
    </div>
  );
}
