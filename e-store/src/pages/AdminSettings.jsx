import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [adminData, setAdminData] = useState({
    email: '',
    name: '',
    id: '',
    role: 'admin',
    issuedAt: '',
    expiresAt: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    //Check if the animation already exists
    if (!document.getElementById('spin-animation')) {
      const style = document.createElement('style');
      style.id = 'spin-animation';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    try {
      // Parse JWT token to extract admin data
      const tokenPayload = JSON.parse(atob(adminToken.split('.')[1]));
      
      setAdminData({
        email: tokenPayload.email || 'admin@test.com',
        name: tokenPayload.name || 'Administrator',
        id: tokenPayload.id || 'ADM-001',
        role: tokenPayload.role || 'admin',
        issuedAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toLocaleDateString() : 'N/A',
        expiresAt: tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toLocaleDateString() : 'N/A'
      });
    } catch (error) {
      console.error('Error parsing token:', error);
      //If token is invalid, log out
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading admin details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Settings</h2>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {adminData.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={styles.adminName}>{adminData.name}</h3>
          <p style={styles.adminRole}>{adminData.role}</p>
        </div>
        
        <div style={styles.detailsSection}>
          <h3 style={styles.sectionTitle}>Account Details</h3>
          <div style={styles.detailRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{adminData.email}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Admin ID:</span>
            <span style={styles.value}>{adminData.id}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Token Issued:</span>
            <span style={styles.value}>{adminData.issuedAt}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Token Expires:</span>
            <span style={styles.value}>{adminData.expiresAt}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#bb2d3b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center'
  },
  title: {
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600'
  },
  profileSection: {
    marginBottom: '30px'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4a6cf7',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 auto 15px'
  },
  adminName: {
    margin: '0 0 5px 0',
    color: '#333',
    fontSize: '22px'
  },
  adminRole: {
    margin: '0',
    color: '#666',
    fontSize: '16px'
  },
  detailsSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  sectionTitle: {
    marginTop: '0',
    marginBottom: '15px',
    color: '#333',
    fontSize: '18px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee'
  },
  label: {
    fontWeight: '600',
    color: '#555'
  },
  value: {
    color: '#333'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4a6cf7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  }
};

export default AdminSettings;