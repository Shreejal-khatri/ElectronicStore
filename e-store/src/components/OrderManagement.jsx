import React, { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiX, FiRefreshCw, FiTruck, FiPackage, FiClock, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await axios.put(`${API_URL}/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (response.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#059669';
      case 'shipped': return '#2563eb';
      case 'processing': return '#d97706';
      case 'pending': return '#7c2d12';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <FiCheckCircle size={14} />;
      case 'shipped': return <FiTruck size={14} />;
      case 'processing': return <FiPackage size={14} />;
      case 'pending': return <FiClock size={14} />;
      case 'cancelled': return <FiXCircle size={14} />;
      default: return <FiClock size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  const styles = {
    container: {
      padding: '0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: '#fafbfc',
      minHeight: '100vh'
    },
    headerSection: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e1e5e9',
      padding: '32px 40px',
      marginBottom: '0'
    },
    headerContent: {
      maxWidth: '1600px',
      margin: '0 auto'
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
      margin: 0,
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '8px 0 0 0'
    },
    refreshButton: {
      padding: '12px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(59,130,246,0.15)'
    },
    mainContent: {
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '32px 20px'
    },
    ordersCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0'
    },
    tableContainer: {
      overflow: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      borderBottom: '3px solid #e2e8f0'
    },
    headerCell: {
      padding: '24px',
      fontSize: '14px',
      fontWeight: '700',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: 'none',
      whiteSpace: 'nowrap',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    tableRow: {
      borderBottom: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    },
    tableCell: {
      padding: '24px',
      fontSize: '15px',
      color: '#1e293b',
      verticalAlign: 'middle',
      borderBottom: '1px solid #f1f5f9'
    },
    orderIdCell: {
      fontFamily: 'Monaco, Consolas, monospace',
      fontWeight: '600',
      color: '#1e293b'
    },
    customerCell: {
      fontWeight: '500'
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      textTransform: 'capitalize',
      minWidth: '100px',
      justifyContent: 'center'
    },
    actionButtonsContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    actionButton: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      minWidth: '36px',
      justifyContent: 'center'
    },
    viewButton: {
      backgroundColor: '#64748b',
      color: 'white'
    },
    approveButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    rejectButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    shipButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '700px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f1f5f9'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a202c',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: '#64748b',
      padding: '4px',
      borderRadius: '4px',
      transition: 'color 0.2s ease'
    },
    orderDetailsGrid: {
      display: 'grid',
      gap: '24px'
    },
    detailSection: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0'
    },
    detailLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569'
    },
    detailValue: {
      fontSize: '14px',
      color: '#1e293b',
      fontWeight: '500'
    },
    itemsList: {
      marginTop: '16px'
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '8px'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      fontSize: '16px',
      color: '#64748b'
    },
    loadingSpinner: {
      marginBottom: '16px',
      animation: 'spin 1s linear infinite'
    },
    error: {
      padding: '32px',
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid #fecaca',
      margin: '32px 40px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 40px',
      color: '#64748b'
    },
    emptyStateTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px'
    },
    totalAmount: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#059669'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <FiRefreshCw size={32} style={styles.loadingSpinner} />
          <div>Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button 
            style={styles.refreshButton}
            onClick={fetchOrders}
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <div style={styles.titleRow}>
            <div>
              <h1 style={styles.title}>Order Management</h1>
              <p style={styles.subtitle}>View and manage customer orders</p>
            </div>
            <button 
              style={styles.refreshButton}
              onClick={fetchOrders}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateTitle}>No orders found</h3>
            <p>There are currently no orders to display.</p>
          </div>
        ) : (
          <div style={styles.ordersCard}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.headerCell}>Order ID</th>
                    <th style={styles.headerCell}>Customer</th>
                    <th style={styles.headerCell}>Date</th>
                    <th style={styles.headerCell}>Items</th>
                    <th style={styles.headerCell}>Total</th>
                    <th style={styles.headerCell}>Status</th>
                    <th style={styles.headerCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr 
                      key={order._id} 
                      style={styles.tableRow}
                      onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                    >
                      <td style={{...styles.tableCell, ...styles.orderIdCell}}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{...styles.tableCell, ...styles.customerCell}}>
                        {order.userId?.email || 'Unknown Customer'}
                      </td>
                      <td style={styles.tableCell}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={styles.tableCell}>
                        {order.items?.length || 0} items
                      </td>
                      <td style={{...styles.tableCell, ...styles.totalAmount}}>
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.statusContainer}>
                          <span 
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(order.status)
                            }}
                          >
                            {getStatusIcon(order.status)}
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtonsContainer}>
                          <button
                            style={styles.actionButton}
                            onClick={() => setSelectedOrder(order)}
                            title="View Details"
                          >
                            <FiEye size={14} />
                          </button>
                          
                          {order.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                style={{...styles.actionButton, ...styles.approveButton}}
                                onClick={() => updateOrderStatus(order._id, 'processing')}
                                disabled={updating === order._id}
                                title="Approve Order"
                              >
                                <FiCheck size={14} />
                              </button>
                              <button
                                style={{...styles.actionButton, ...styles.rejectButton}}
                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                disabled={updating === order._id}
                                title="Cancel Order"
                              >
                                <FiX size={14} />
                              </button>
                            </>
                          )}
                          
                          {order.status?.toLowerCase() === 'processing' && (
                            <button
                              style={{...styles.actionButton, ...styles.shipButton}}
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              disabled={updating === order._id}
                              title="Mark as Shipped"
                            >
                              <FiTruck size={14} />
                            </button>
                          )}
                          
                          {order.status?.toLowerCase() === 'shipped' && (
                            <button
                              style={{...styles.actionButton, ...styles.approveButton}}
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              disabled={updating === order._id}
                              title="Mark as Delivered"
                            >
                              <FiPackage size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={styles.modal} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button 
                style={styles.closeButton}
                onClick={() => setSelectedOrder(null)}
                onMouseEnter={(e) => e.target.style.color = '#1e293b'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
              >
                ×
              </button>
            </div>
            
            <div style={styles.orderDetailsGrid}>
              <div style={styles.detailSection}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Customer Email:</span>
                  <span style={styles.detailValue}>{selectedOrder.userId?.email || 'Unknown'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Order Date:</span>
                  <span style={styles.detailValue}>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Status:</span>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(selectedOrder.status)
                    }}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status || 'pending'}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Total Amount:</span>
                  <span style={{...styles.detailValue, ...styles.totalAmount}}>
                    {formatCurrency(selectedOrder.totalPrice)}
                  </span>
                </div>
              </div>
              
              <div style={styles.detailSection}>
                <h4 style={{margin: '0 0 16px 0', color: '#1e293b'}}>Order Items</h4>
                <div style={styles.itemsList}>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} style={styles.itemRow}>
                      <div>
                        <div style={{fontWeight: '600', marginBottom: '4px'}}>
                          {item.productId?.name || 'Unknown Product'}
                        </div>
                        <div style={{fontSize: '13px', color: '#64748b'}}>
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontWeight: '600', color: '#059669'}}>
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <div style={{fontSize: '13px', color: '#64748b'}}>
                          {formatCurrency(item.price)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;