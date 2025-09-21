// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [cancellingOrder, setCancellingOrder] = useState(null);

//   const API_URL = import.meta.env.VITE_API_URL;

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('You are not logged in.');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`${API_URL}/orders/my-orders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setOrders(response.data.orders);
//       } else {
//         setError(response.data.message || 'Failed to fetch orders');
//       }
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       setError(err.response?.data?.message || 'Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setCancellingOrder(orderId);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.delete(`${API_URL}/api/orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         // Remove the cancelled order from the state
//         setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
//         alert('Order cancelled successfully!');
//       } else {
//         alert(response.data.message || 'Failed to cancel order');
//       }
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       console.error('Error response:', err.response?.data);
      
//       // Show more detailed error message
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to cancel order';
//       alert(`Error: ${errorMessage}`);
//     } finally {
//       setCancellingOrder(null);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'delivered':
//         return '#10b981';
//       case 'shipped':
//         return '#3b82f6';
//       case 'processing':
//       case 'pending':
//         return '#f59e0b';
//       case 'cancelled':
//         return '#ef4444';
//       default:
//         return '#6b7280';
//     }
//   };

//   const canCancelOrder = (status) => {
//     const cancellableStatuses = ['pending', 'processing'];
//     // If status is empty or undefined, treat it as 'processing' (the default)
//     const actualStatus = status || 'processing';
//     return cancellableStatuses.includes(actualStatus.toLowerCase());
//   };

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//   const styles = {
//     pageWrapper: {
//       display: 'flex',
//       flexDirection: 'column',
//       minHeight: '100vh',
//       margin: 0,
//       padding: 0,
//       backgroundColor: '#f9fafb',
//     },
//     mainContent: {
//       flex: '1 0 auto',
//       width: '100%',
//     },
//     container: {
//       maxWidth: '1000px',
//       margin: '0 auto',
//       padding: '60px 20px',
//       backgroundColor: '#fff',
//       borderRadius: '12px',
//       boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
//       fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       color: '#1a1a1a',
//     },
//     heading: {
//       fontSize: '2.8rem',
//       marginBottom: '40px',
//       paddingBottom: '20px',
//       fontWeight: '300',
//       color: '#000000',
//       textAlign: 'center',
//       letterSpacing: '1px',
//       textTransform: 'uppercase',
//       position: 'relative',
//     },
//     headingUnderline: {
//       content: '""',
//       position: 'absolute',
//       bottom: '0',
//       left: '50%',
//       transform: 'translateX(-50%)',
//       width: '80px',
//       height: '3px',
//       backgroundColor: '#000000',
//     },
//     emptyMessage: {
//       fontSize: '1.4rem',
//       color: '#666',
//       textAlign: 'center',
//       marginTop: '100px',
//       fontWeight: '300',
//       letterSpacing: '0.5px',
//     },
//     cartItemCard: {
//       display: 'flex',
//       flexDirection: 'row',
//       backgroundColor: '#ffffff',
//       borderRadius: '12px',
//       padding: '30px',
//       marginBottom: '20px',
//       alignItems: 'center',
//       gap: '30px',
//       transition: 'all 0.3s ease',
//       border: '1px solid #f0f0f0',
//       position: 'relative',
//       boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
//     },
//     cardHeader: {
//       position: 'absolute',
//       top: '15px',
//       right: '15px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '10px',
//     },
//     imageContainer: {
//       flexShrink: 0,
//       width: '160px',
//       height: '160px',
//       borderRadius: '12px',
//       overflow: 'hidden',
//       position: 'relative',
//       backgroundColor: '#f5f5f5',
//     },
//     image: {
//       width: '100%',
//       height: '100%',
//       objectFit: 'cover',
//       display: 'block',
//     },
//     detailsContainer: {
//       flexGrow: 1,
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     itemHeader: {
//       fontSize: '1.8rem',
//       marginBottom: '15px',
//       color: '#000000',
//       fontWeight: '400',
//       letterSpacing: '0.5px',
//     },
//     priceText: {
//       fontWeight: '500',
//       marginBottom: '15px',
//       fontSize: '1.2rem',
//       color: '#444444',
//     },
//     buttonContainer: {
//       display: 'flex',
//       gap: '10px',
//       alignItems: 'center',
//     },
//     cancelButton: {
//       backgroundColor: '#ef4444',
//       border: 'none',
//       color: 'white',
//       padding: '10px 25px',
//       fontSize: '1rem',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       transition: 'all 0.3s ease',
//       letterSpacing: '0.5px',
//     },
//     cancelButtonDisabled: {
//       backgroundColor: '#ccc',
//       cursor: 'not-allowed',
//       opacity: 0.6,
//     },
//     itemCountBadge: {
//       backgroundColor: '#000000',
//       color: '#ffffff',
//       borderRadius: '8px',
//       padding: '4px 8px',
//       fontSize: '0.8rem',
//       fontWeight: '500',
//     },
//     statusBadge: {
//       padding: '6px 12px',
//       borderRadius: '20px',
//       fontSize: '0.8rem',
//       fontWeight: '600',
//       textTransform: 'uppercase',
//       color: 'white',
//     },
//     orderButton: {
//       backgroundColor: '#000000',
//       color: '#ffffff',
//       border: 'none',
//       padding: '15px 40px',
//       fontSize: '1.2rem',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       marginTop: '30px',
//       fontWeight: '500',
//       letterSpacing: '0.5px',
//       textDecoration: 'none',
//       display: 'inline-block',
//     },
//     loadingSpinner: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '200px',
//     },
//     spinner: {
//       width: '40px',
//       height: '40px',
//       border: '4px solid #f3f3f3',
//       borderTop: '4px solid #000000',
//       borderRadius: '50%',
//       animation: 'spin 1s linear infinite',
//     },
//   };

//   // Add CSS animation for spinner
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
//   }, []);

//   return (
//     <div style={styles.pageWrapper}>
//       <Navbar />
//       <main style={styles.mainContent}>
//         <div style={styles.container}>
//           <h1 style={styles.heading}>
//             MY ORDERS
//             <span style={styles.headingUnderline}></span>
//           </h1>

//           {loading ? (
//             <div style={styles.loadingSpinner}>
//               <div style={styles.spinner}></div>
//             </div>
//           ) : error ? (
//             <>
//               <div style={{ ...styles.emptyMessage, color: '#d32f2f' }}>
//                 {error}
//               </div>
//               <div style={{ textAlign: 'center', marginTop: '20px' }}>
//                 <button onClick={fetchOrders} style={styles.orderButton}>
//                   Try Again
//                 </button>
//               </div>
//             </>
//           ) : orders.length === 0 ? (
//             <div style={styles.emptyMessage}>
//               <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
//               <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: '400' }}>
//                 No orders yet
//               </h2>
//               <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
//                 Start shopping to see your orders here
//               </p>
//               <Link to="/products" style={styles.orderButton}>
//                 Shop Now
//               </Link>
//             </div>
//           ) : (
//             orders.map((order) => (
//               <div key={order._id} style={styles.cartItemCard}>
//                 <div style={styles.cardHeader}>
//                   <div style={styles.itemCountBadge}>
//                     {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
//                   </div>
//                   <span
//                     style={{
//                       ...styles.statusBadge,
//                       backgroundColor: getStatusColor(order.status),
//                     }}
//                   >
//                     {order.status || 'Processing'}
//                   </span>
//                 </div>

//                 <div style={styles.imageContainer}>
//                   <img
//                     src={
//                       order.items?.[0]?.productId?.imageUrl
//                         ? `${API_URL}${order.items[0].productId.imageUrl}`
//                         : '/images/placeholder.jpg'
//                     }
//                     alt={order.items?.[0]?.productId?.name}
//                     style={styles.image}
//                     onError={(e) => {
//                       e.target.src = '/images/placeholder.jpg';
//                     }}
//                   />
//                 </div>

//                 <div style={styles.detailsContainer}>
//                   <div style={{ marginBottom: '15px' }}>
//                     <h3 style={styles.itemHeader}>
//                       Order #{order._id.slice(-8).toUpperCase()}
//                     </h3>
//                     <p style={{ color: '#666', marginBottom: '10px' }}>
//                       Placed on {formatDate(order.createdAt || order.date)}
//                     </p>
//                   </div>

//                   <div style={styles.priceText}>
//                     Total: <strong>${order.totalPrice?.toFixed(2)}</strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <p style={{ color: '#666', fontSize: '0.9rem' }}>
//                       Includes {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
//                     </p>
//                     {canCancelOrder(order.status) && (
//                       <div style={styles.buttonContainer}>
//                         <button
//                           style={{
//                             ...styles.cancelButton,
//                             ...(cancellingOrder === order._id ? styles.cancelButtonDisabled : {})
//                           }}
//                           onClick={() => cancelOrder(order._id)}
//                           disabled={cancellingOrder === order._id}
//                         >
//                           {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

    try {
      setCancellingOrder(orderId);
      const token = localStorage.getItem('token');

      const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        alert('Order cancelled successfully!');
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to cancel order';
      alert(`Error: ${errorMessage}`);
    } finally {
      setCancellingOrder(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing':
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const canCancelOrder = (status) => {
    const cancellableStatuses = ['pending', 'processing'];
    const actualStatus = status || 'processing';
    return cancellableStatuses.includes(actualStatus.toLowerCase());
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return `${API_BASE}/uploads/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/uploads') ? `${API_BASE}${imagePath}` : `${API_BASE}/uploads/${imagePath}`;
  };

  const styles = {
    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#f9fafb',
    },
    mainContent: {
      flex: '1 0 auto',
      width: '100%',
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '60px 20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#1a1a1a',
    },
    heading: {
      fontSize: '2.8rem',
      marginBottom: '40px',
      paddingBottom: '20px',
      fontWeight: '300',
      color: '#000000',
      textAlign: 'center',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      position: 'relative',
    },
    headingUnderline: {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '3px',
      backgroundColor: '#000000',
    },
    emptyMessage: {
      fontSize: '1.4rem',
      color: '#666',
      textAlign: 'center',
      marginTop: '100px',
      fontWeight: '300',
      letterSpacing: '0.5px',
    },
    cartItemCard: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '20px',
      alignItems: 'center',
      gap: '30px',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    },
    cardHeader: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    imageContainer: {
      flexShrink: 0,
      width: '160px',
      height: '160px',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f5f5f5',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    detailsContainer: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    itemHeader: {
      fontSize: '1.8rem',
      marginBottom: '15px',
      color: '#000000',
      fontWeight: '400',
      letterSpacing: '0.5px',
    },
    priceText: {
      fontWeight: '500',
      marginBottom: '15px',
      fontSize: '1.2rem',
      color: '#444444',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      border: 'none',
      color: 'white',
      padding: '10px 25px',
      fontSize: '1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '0.5px',
    },
    cancelButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    itemCountBadge: {
      backgroundColor: '#000000',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '4px 8px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      color: 'white',
    },
    orderButton: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: 'none',
      padding: '15px 40px',
      fontSize: '1.2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '30px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      textDecoration: 'none',
      display: 'inline-block',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #000000',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  //CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <main style={styles.mainContent}>
        <div style={styles.container}>
          <h1 style={styles.heading}>
            MY ORDERS
            <span style={styles.headingUnderline}></span>
          </h1>

          {loading ? (
            <div style={styles.loadingSpinner}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <>
              <div style={{ ...styles.emptyMessage, color: '#d32f2f' }}>{error}</div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={fetchOrders} style={styles.orderButton}>Try Again</button>
              </div>
            </>
          ) : orders.length === 0 ? (
            <div style={styles.emptyMessage}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: '400' }}>No orders yet</h2>
              <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>Start shopping to see your orders here</p>
              <Link to="/products" style={styles.orderButton}>Shop Now</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={styles.cartItemCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.itemCountBadge}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</div>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) }}>{order.status || 'Processing'}</span>
                </div>

                <div style={styles.imageContainer}>
                  <img
                    src={getProductImageUrl(order.items?.[0]?.productId?.imageUrl)}
                    alt={order.items?.[0]?.productId?.name || 'Product'}
                    style={styles.image}
                    onError={(e) => { e.target.src = `${API_BASE}/uploads/placeholder.jpg`; }}
                  />
                </div>

                <div style={styles.detailsContainer}>
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={styles.itemHeader}>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p style={{ color: '#666', marginBottom: '10px' }}>Placed on {formatDate(order.createdAt || order.date)}</p>
                  </div>

                  <div style={styles.priceText}>
                    Total: <strong>${order.totalPrice?.toFixed(2)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Includes {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                    {canCancelOrder(order.status) && (
                      <div style={styles.buttonContainer}>
                        <button
                          style={{ ...styles.cancelButton, ...(cancellingOrder === order._id ? styles.cancelButtonDisabled : {}) }}
                          onClick={() => cancelOrder(order._id)}
                          disabled={cancellingOrder === order._id}
                        >
                          {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
