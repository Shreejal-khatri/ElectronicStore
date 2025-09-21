import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', category: '', stock: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  //Separate image file and preview states for Add and Edit forms
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);

  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('adminToken');
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);


  // Function to get proper image URL
  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;

  const BASE_URL = import.meta.env.VITE_API_BASE;

  return imagePath.startsWith('/') ? `${BASE_URL}${imagePath}` : `${BASE_URL}/${imagePath}`;
};


  useEffect(() => {
    fetchProducts();
  }, []);



  const fetchProducts = async () => {
  try {
    setIsLoading(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await axios.get(`${API_BASE_URL}/products`);

    setProducts(res.data || []);
    setError('');
  } catch (err) {
    console.error(err);
    setError('Failed to fetch products');
  } finally {
    setIsLoading(false);
  }
};

  //Add Product Handlers
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setAddImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAddImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setError('');
    }
  };

  const removeAddImage = () => {
    setAddImageFile(null);
    setAddImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleAddProduct = async () => {
  if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category || !newProduct.stock) {
    setError('Please fill all required fields.');
    return;
  }

  try {
    setIsLoading(true);
    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    formData.append('stock', newProduct.stock);

    if (addImageFile) {
      formData.append('image', addImageFile);
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await axios.post(`${API_BASE_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    setProducts([res.data, ...products]);
    setNewProduct({ name: '', price: '', description: '', category: '', stock: '' });
    setAddImageFile(null);
    setAddImagePreview(null);
    setError('');
    setSuccessMessage('Product added successfully!');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Error details:', err);
    setError(err.response?.data?.message || 'Failed to add product');
  } finally {
    setIsLoading(false);
  }
};

  //Edit Product Handlers
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setEditImageFile(null);
    setEditImagePreview(
      product.imageUrl ? `${getImageUrl(product.imageUrl)}?t=${Date.now()}` : null
    );
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setError('');
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setEditImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setError('');
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleEditProduct = async () => {
  if (!editingProduct.name || !editingProduct.price || !editingProduct.description || !editingProduct.category || !editingProduct.stock) {
    setError('Please fill all required fields.');
    return;
  }

  try {
    setIsLoading(true);
    const formData = new FormData();

    formData.append('name', editingProduct.name);
    formData.append('price', editingProduct.price);
    formData.append('description', editingProduct.description);
    formData.append('category', editingProduct.category);
    formData.append('stock', editingProduct.stock);

    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    await fetchProducts();

    closeEditModal();
    setError('');
    setSuccessMessage('Product updated successfully!');

    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Error details:', err);
    setError(err.response?.data?.message || 'Failed to update product');
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteProduct = async (id) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;

  try {
    setIsLoading(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    await axios.delete(`${API_BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setProducts(products.filter(p => p._id !== id));
    setSuccessMessage('Product deleted successfully!');

    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error(err);
    setError('Failed to delete product');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Product Management</h1>
            <p style={styles.subtitle}>Manage your product inventory with precision and efficiency</p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{products.length}</div>
              <div style={styles.statLabel}>Total Products</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{products.filter(p => p.stock > 0).length}</div>
              <div style={styles.statLabel}>In Stock</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{products.filter(p => p.stock === 0).length}</div>
              <div style={styles.statLabel}>Out of Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={styles.alertContainer}>
          <div style={styles.alert}>
            <div style={styles.alertContent}>
              <div style={styles.alertIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h4 style={styles.alertTitle}>Error</h4>
                <p style={styles.alertMessage}>{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                style={styles.alertClose}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div style={styles.alertContainer}>
          <div style={{...styles.alert, ...styles.successAlert}}>
            <div style={styles.alertContent}>
              <div style={{...styles.alertIcon, color: '#10b981'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <div>
                <h4 style={{...styles.alertTitle, color: '#10b981'}}>Success</h4>
                <p style={{...styles.alertMessage, color: '#047857'}}>{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage('')}
                style={{...styles.alertClose, color: '#10b981'}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner}></div>
            <span style={styles.loadingText}>Processing...</span>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Product</h2>
              <button onClick={closeEditModal} style={styles.modalCloseButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGrid}>
                <div style={styles.formColumn}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Product Name <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      value={editingProduct.name}
                      onChange={handleEditInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Price (Rs) <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWithIcon}>
                      <span style={styles.inputIcon}>Rs </span>
                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        value={editingProduct.price}
                        onChange={handleEditInputChange}
                        style={{ ...styles.input, paddingLeft: '32px' }}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Category <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Enter product category"
                      value={editingProduct.category}
                      onChange={handleEditInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Stock Quantity <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="Enter stock quantity"
                      value={editingProduct.stock}
                      onChange={handleEditInputChange}
                      style={styles.input}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div style={styles.formColumn}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Description <span style={styles.required}>*</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter detailed product description..."
                      value={editingProduct.description}
                      onChange={handleEditInputChange}
                      style={styles.textarea}
                      required
                      rows="6"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Product Image</label>

                    {editImagePreview ? (
                      <div style={styles.imagePreviewContainer}>
                        <img
                          src={editImagePreview}
                          alt="Product preview"
                          style={styles.imagePreview}
                        />
                        <div style={styles.imagePreviewOverlay}>
                          <button
                            type="button"
                            onClick={removeEditImage}
                            style={styles.removeImageButton}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.fileDropZone}>
                        <input
                          type="file"
                          onChange={handleEditFileChange}
                          style={styles.fileInput}
                          accept="image/*"
                          id="edit-file-upload"
                          ref={editFileInputRef}
                        />
                        <label htmlFor="edit-file-upload" style={styles.fileDropContent}>
                          <div style={styles.fileDropIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17,8 12,3 7,8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </div>
                          <div style={styles.fileDropText}>
                            <span style={styles.fileDropTitle}>
                              Click to upload or drag and drop
                            </span>
                            <span style={styles.fileDropSubtitle}>PNG, JPG, GIF up to 5MB</span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                onClick={closeEditModal}
                style={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                onClick={handleEditProduct}
                style={{
                  ...styles.primaryButton,
                  ...(isLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                }}
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      <div style={styles.addProductSection}>
        <h2 style={styles.sectionTitle}>Add New Product</h2>
        <div style={styles.formGrid}>
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Product Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Price (Rs) <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWithIcon}>
                <span style={styles.inputIcon}>Rs </span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  style={{ ...styles.input, paddingLeft: '32px' }}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Category <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="category"
                placeholder="Enter product category"
                value={newProduct.category}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Stock Quantity <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                value={newProduct.stock}
                onChange={handleInputChange}
                style={styles.input}
                min="0"
                required
              />
            </div>
          </div>

          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter detailed product description..."
                value={newProduct.description}
                onChange={handleInputChange}
                style={styles.textarea}
                required
                rows="6"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Product Image</label>

              {addImagePreview ? (
                <div style={styles.imagePreviewContainer}>
                  <img
                    src={addImagePreview}
                    alt="Product preview"
                    style={styles.imagePreview}
                  />
                  <div style={styles.imagePreviewOverlay}>
                    <button
                      type="button"
                      onClick={removeAddImage}
                      style={styles.removeImageButton}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    onChange={handleAddFileChange}
                    style={styles.fileInput}
                    accept="image/*"
                    id="add-file-upload"
                    ref={fileInputRef}
                  />
                  <label htmlFor="add-file-upload" style={styles.fileDropContent}>
                    <div style={styles.fileDropIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17,8 12,3 7,8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div style={styles.fileDropText}>
                      <span style={styles.fileDropTitle}>
                        Click to upload or drag and drop
                      </span>
                      <span style={styles.fileDropSubtitle}>PNG, JPG, GIF up to 5MB</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.formActions}>
          <button
            onClick={handleAddProduct}
            style={{
              ...styles.primaryButton,
              ...(isLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Products List */}
      <div style={styles.productsList}>
        <h2 style={styles.sectionTitle}>Product List</h2>
        {products.length === 0 ? (
          <p style={styles.noProductsText}>No products available.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Image</th>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Price</th>
                  <th style={styles.tableHeader}>Category</th>
                  <th style={styles.tableHeader}>Stock</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
                  }}>
                    <td style={styles.tableCell}>
                      <div style={styles.productImageContainer}>
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          style={styles.productImage}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.productDetails}>
                        <div style={styles.productName}>{product.name}</div>
                        <div style={styles.productDescription}>{product.description}</div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.priceContainer}>
                        <span style={styles.price}>Rs {parseFloat(product.price).toFixed(2)}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.categoryBadge}>{product.category}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.stockBadge,
                        ...(product.stock > 10 ? styles.stockGood : 
                             product.stock > 0 ? styles.stockWarning : styles.stockDanger)
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => openEditModal(product)}
                          style={styles.editButton}
                          title="Edit Product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          style={styles.deleteButton}
                          title="Delete Product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {

  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#1a202c',
    lineHeight: '1.6',
    position: 'relative',
  },
  
  
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '0',
    zIndex: '100',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  headerText: {
    flex: '1',
    minWidth: '300px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    color: '#1a202c',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    fontSize: '18px',
    color: '#4a5568',
    margin: '0',
    fontWeight: '400',
  },
  headerStats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '20px 24px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    minWidth: '120px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a202c',
    lineHeight: '1',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  
  
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  

  alertContainer: {
    maxWidth: '1400px',
    margin: '0 auto 24px',
    padding: '0 24px',
  },
  alert: {
    background: 'rgba(254, 242, 242, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.1)',
  },
  successAlert: {
    background: 'rgba(240, 253, 244, 0.95)',
    border: '1px solid #bbf7d0',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
  },
  alertContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px',
  },
  alertIcon: {
    color: '#dc2626',
    flexShrink: '0',
    marginTop: '2px',
  },
  alertTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#dc2626',
    margin: '0 0 4px 0',
  },
  alertMessage: {
    fontSize: '14px',
    color: '#7f1d1d',
    margin: '0',
    lineHeight: '1.6',
  },
  alertClose: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  
  //Enhanced Loading Overlay
  loadingOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4b5563',
  },
  
  //Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0',
    color: '#1f2937',
  },
  modalCloseButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  modalContent: {
    padding: '32px',
    overflow: 'auto',
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16px',
    padding: '24px 32px',
    borderTop: '1px solid #e5e7eb',
  },
  
  // Section Styles
  section: {
    marginBottom: '48px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  sectionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#1f2937',
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
  },
  sectionBadge: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  //Add Product Section
addProductSection: {
  background: '#fff',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  marginBottom: '48px',

  
  maxWidth: '1200px',  
  marginLeft: 'auto',
  marginRight: 'auto',
},

//Product List Section
productsList: {
  background: '#fff',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  marginBottom: '48px',

  //Center and give breathing space
  maxWidth: '1200px', 
  marginLeft: 'auto',
  marginRight: 'auto',
},


  
  //Form Styles
  formContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e5e7eb',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
  },
  inputWithPadding: {
    paddingLeft: '32px',
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  
  // File Upload Styles
  fileDropZone: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  fileDropContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  fileDropIcon: {
    color: '#9ca3af',
  },
  fileDropText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fileDropTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },
  fileDropSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  
  //Image Preview Styles
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '200px',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePreviewOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 0.2s',
  },
  removeImageButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  
  //Form Actions
  formActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  
  //Button Styles
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
  },
  
  //Table Styles
  tableContainer: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    padding: '16px 24px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#374151',
  },
  
  //Product Image in Table
  productImageContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
  },
  
  //Product Details in Table
  productDetails: {
    maxWidth: '300px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  },
  productDescription: {
    fontSize: '14px',
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
  },
  
  //Price Container
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#059669',
  },
  
  //Category Badge
  categoryBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  
  //Stock Badge
  stockBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  stockGood: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  stockWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  stockDanger: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  
  //Action Buttons
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  //Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 32px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px dashed #d1d5db',
  },
  emptyStateIcon: {
    color: '#9ca3af',
    marginBottom: '16px',
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0',
  },
  emptyStateDescription: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0',
    maxWidth: '400px',
  },
  
  //Hover effects
  hoverEffects: {
    statCard: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    primaryButton: {
      backgroundColor: '#2563eb',
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
    },
    editButton: {
      backgroundColor: '#dbeafe',
    },
    deleteButton: {
      backgroundColor: '#fee2e2',
    },
    imagePreviewContainer: {
      imagePreviewOverlay: {
        opacity: '1',
      },
    },
    alertClose: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalCloseButton: {
      backgroundColor: '#f3f4f6',
    },
  },
};

//Add hover effects using JavaScript in the components
Object.assign(styles.statCard, {
  ':hover': styles.hoverEffects.statCard,
});

Object.assign(styles.primaryButton, {
  ':hover': styles.hoverEffects.primaryButton,
  ':disabled': styles.buttonDisabled,
});

Object.assign(styles.secondaryButton, {
  ':hover': styles.hoverEffects.secondaryButton,
});

Object.assign(styles.editButton, {
  ':hover': styles.hoverEffects.editButton,
  ':disabled': styles.buttonDisabled,
});

Object.assign(styles.deleteButton, {
  ':hover': styles.hoverEffects.deleteButton,
  ':disabled': styles.buttonDisabled,
});

Object.assign(styles.imagePreviewContainer, {
  ':hover': {
    imagePreviewOverlay: styles.hoverEffects.imagePreviewContainer.imagePreviewOverlay,
  },
});

Object.assign(styles.alertClose, {
  ':hover': styles.hoverEffects.alertClose,
});

Object.assign(styles.modalCloseButton, {
  ':hover': styles.hoverEffects.modalCloseButton,
});
