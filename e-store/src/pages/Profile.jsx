import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    reviews: 0
  });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

 
  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
     
      const payload = JSON.parse(atob(parts[1]));
      return payload.email || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    } 
  };

  
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;


      const ordersResponse = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      let wishlistCount = 0;
      try {
        const wishlistResponse = await axios.get(`${API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        wishlistCount = Array.isArray(wishlistResponse.data) ? wishlistResponse.data.length : 0;
      } catch (wishlistError) {
        console.error('Error fetching wishlist:', wishlistError);
      }

      setStats({
        orders: ordersResponse.data.orders?.length || 0,
        wishlist: wishlistCount,
        reviews: 0 
      });

    } catch (error) {
      console.error('Error fetching user stats:', error);
      
    }
  };

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('user');
      const tokenEmail = getEmailFromToken();
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          
          if (tokenEmail) {
            userData.email = tokenEmail;
          }
          
          setUser(userData);
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || tokenEmail || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zipCode: userData.zipCode || ''
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else if (tokenEmail) {
        const minimalUser = { email: tokenEmail };
        setUser(minimalUser);
        setFormData({
          firstName: '',
          lastName: '',
          email: tokenEmail,
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        });
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);


  useEffect(() => {
    if (user && !isLoading) {
      fetchUserStats();
    }
  }, [user, isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    

    setTimeout(() => {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user.email || formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        updatedAt: new Date().toISOString(),
        name: `${formData.firstName} ${formData.lastName}`.trim() || 'User'
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setIsLoading(false);
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };


  const getFullName = () => {
    if (user.name) return user.name;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return 'User';
  };

  const getUserInitial = () => {
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <h2 style={styles.errorTitle}>No User Found</h2>
            <p style={styles.errorMessage}>Please log in to view your profile.</p>
            <button 
              style={styles.loginButton}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Profile</h1>
            <p style={styles.subtitle}>Manage your personal information and preferences</p>
          </div>
          <div style={styles.headerButtons}>
            <button 
              style={styles.backButton}
              onClick={handleBackToHome}
            >
              ← Back to Home
            </button>
            {!isEditing && (
              <button 
                style={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
            <button 
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {saveMessage && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✓</span>
            {saveMessage}
          </div>
        )}

        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {getUserInitial()}
            </div>
            <h2 style={styles.userName}>{getFullName()}</h2>
            <p style={styles.userEmail}>{user.email}</p>
            <div style={styles.userBadge}>Member</div>
          </div>

          <div style={styles.detailsSection}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>👤</span>
              Personal Information
            </h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <div style={styles.value}>{user.firstName || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <div style={styles.value}>{user.lastName || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.value}>{user.email || 'Not provided'}</div>
                {!user.email && isEditing && (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your email"
                  />
                )}
                <small style={styles.helpText}>
                  {user.email ? 'Email from your authentication token' : 'Please provide your email'}
                </small>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div style={styles.value}>{user.phone || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div style={styles.value}>{user.address || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your city"
                  />
                ) : (
                  <div style={styles.value}>{user.city || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your state"
                  />
                ) : (
                  <div style={styles.value}>{user.state || 'Not provided'}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your ZIP code"
                  />
                ) : (
                  <div style={styles.value}>{user.zipCode || 'Not provided'}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div style={styles.buttonGroup}>
                <button 
                  style={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.statsSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📊</span>
            Account Statistics
          </h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📦</div>
              <h4 style={styles.statNumber}>{stats.orders}</h4>
              <p style={styles.statLabel}>Orders</p>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>❤️</div>
              <h4 style={styles.statNumber}>{stats.wishlist}</h4>
              <p style={styles.statLabel}>Wishlist Items</p>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <h4 style={styles.statNumber}>{stats.reviews}</h4>
              <p style={styles.statLabel}>Reviews</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '120px 20px 40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    backgroundColor: '#ffffff',
    paddingTop: '100px'
  },
  spinner: {
    border: '4px solid rgba(0,0,0,0.1)',
    borderTop: '4px solid #333',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '18px',
    color: '#333',
    fontWeight: '500'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '100px auto'
  },
  errorTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '16px'
  },
  errorMessage: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px'
  },
  loginButton: {
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    color: '#333',
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    margin: '0'
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  backButton: {
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  editButton: {
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '16px 24px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #c3e6cb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '1200px',
    margin: '0 auto 30px auto',
    fontSize: '16px',
    fontWeight: '500'
  },
  successIcon: {
    fontSize: '20px'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    border: '1px solid #e5e5e5'
  },
  avatarSection: {
    backgroundColor: '#f8f9fa',
    padding: '50px 30px',
    textAlign: 'center',
    color: '#333',
    position: 'relative',
    borderBottom: '1px solid #e5e5e5'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#4cafef',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
    border: '3px solid #e5e5e5'
  },
  userName: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '700'
  },
  userEmail: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#666'
  },
  userBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#333',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  detailsSection: {
    padding: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#333',
    margin: '0 0 30px 0',
    paddingBottom: '16px',
    borderBottom: '3px solid #f1f1f1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '700'
  },
  sectionIcon: {
    fontSize: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    marginBottom: '40px'
  },
  formGroup: {
    marginBottom: '0'
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#333',
    fontSize: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    outline: 'none'
  },
  value: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    color: '#333',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    border: '1px solid #ddd'
  },
  helpText: {
    color: '#666',
    fontSize: '13px',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '30px',
    flexWrap: 'wrap'
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    border: '1px solid #e5e5e5'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
  },
  statCard: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: '1px solid #e5e5e5'
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '16px'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 12px 0'
  },
  statLabel: {
    margin: '0',
    color: '#666',
    fontSize: '16px',
    fontWeight: '600'
  }
};