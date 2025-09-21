import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveSection, setMobileActiveSection] = useState(null);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);
  const navRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  //Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "User",
          email: parsedUser.email || "",
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          picture: parsedUser.picture || null
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  //Get cart items count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItemsCount(cart.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error reading cart data:', error);
        setCartItemsCount(0);
      }
    };

    //Initial count
    updateCartCount();

    //Listen for custom cart update events
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    //Listen for storage changes 
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') updateCartCount();
    });

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  //Get wishlist items count
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // If user is logged in, we'll fetch the wishlist count from the server
          // For now, we'll use localStorage as a fallback
          const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setWishlistItemsCount(wishlist.length);
        } else {
          setWishlistItemsCount(0);
        }
      } catch (error) {
        console.error('Error reading wishlist data:', error);
        setWishlistItemsCount(0);
      }
    };

    //Initial count
    updateWishlistCount();

    //Listen for custom wishlist update events
    const handleWishlistUpdate = () => updateWishlistCount();
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    //Listen for storage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'wishlist') updateWishlistCount();
    });

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', updateWishlistCount);
    };
  }, []);

  //Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!navRef.current) return;
      
      //Check if click is outside profile dropdown
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
      
      //Check if click is outside other dropdowns
      if (!navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    }
    
    function onKey(e) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleDropdownToggle = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileSection = (name) => {
    setMobileActiveSection((p) => (p === name ? null : name));
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleWishlistClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/wishlist');
    } else {
      navigate('/login');
    }
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    navigate('/contact');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  //Safe function to get user initial
  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  const productCategories = [
    { name: 'Laptops', id: 'laptops' },
    { name: 'Phones', id: 'phones' },
    { name: 'Accessories', id: 'accessories' },
  ];

  return (
    <>
      <style>{`
        :root{
          --accent:#0071e3;
          --accent-2:#00b4d8;
          --text:#111214;
          --muted:#6b6b70;
          --shadow: 0 10px 30px rgba(8,15,25,0.08);
        }

        /* ---------- NAVBAR ---------- */
        .khatri-navbar{
          position:fixed;
          inset:0 0 auto 0;
          z-index:1200;
          padding:0 20px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all .35s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        .khatri-navbar.scrolled{
          box-shadow: 0 6px 20px rgba(9,20,40,0.06);
        }

        .navbar-container{
          max-width:1280px;
          margin:0 auto;
          height:64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }

        .navbar-logo{
          font-weight:700;
          font-size:1.5rem;
          color:var(--text);
          text-decoration:none;
          display:flex;
          align-items:center;
        }
        .navbar-logo span{
          background:linear-gradient(90deg,var(--accent),var(--accent-2));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        /* ---------- MENU (desktop) ---------- */
        .navbar-menu{ display:flex; gap:18px; align-items:center; list-style:none; margin:0; padding:0; }
        .navbar-item{ position:relative; }
        .navbar-link{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:18px 8px;
          color:var(--text);
          font-weight:500;
          text-decoration:none;
          cursor:pointer;
          transition: color .18s ease;
        }
        .navbar-link:hover{ color:var(--accent); }

        /* subtle gradient underline */
        .navbar-link::after{
          content:'';
          display:block;
          height:2px;
          width:0%;
          background: linear-gradient(90deg,var(--accent),var(--accent-2));
          border-radius:2px;
          transition: width .25s ease;
          margin-top:4px;
        }
        .navbar-link:hover::after{ width:100%; }

        /* ---------- DROPDOWN ---------- */
        .dropdown {
          position:absolute;
          top:calc(100% + 10px);
          left:0;
          transform: translateY(10px);
          opacity:0;
          pointer-events:none;
          transition: all .28s cubic-bezier(.2,.9,.2,1);
          background: #ffffff;
          border-radius:12px;
          padding:14px;
          min-width:300px;
          box-shadow: var(--shadow);
          border: 1px solid #e5e7eb;
          display:flex;
          flex-direction: column;
          gap:8px;
          z-index:1100;
        }
        .dropdown.open { transform: translateY(0); opacity:1; pointer-events:auto; }

        .dropdown-column{ display:flex; flex-direction:column; gap:6px; min-width:160px; }
        .dropdown-title{ font-size:.92rem; font-weight:700; color:var(--accent); margin-bottom:6px; }
        .dropdown-link{
          color:var(--text); text-decoration:none; font-size:.9rem;
          padding:8px 12px; border-radius:8px; transition: all .18s ease;
          cursor: pointer;
        }
        .dropdown-link:hover{ color:var(--accent); background: rgba(0,113,227,0.06); }

        /* small screens shrink dropdown */
        @media (max-width:980px){
          .dropdown{ min-width:280px; }
        }
        @media (max-width:720px){
          .dropdown{ display:none; }
        }

        /* ---------- ACTION ICONS ---------- */
        .navbar-actions{ display:flex; gap:8px; align-items:center; }
        .icon-btn{
          display:inline-grid;
          place-items:center;
          width:40px; height:40px;
          border-radius:10px;
          border:1px solid #e5e7eb;
          background: #f9fafb;
          cursor:pointer;
          transition: transform .15s ease, box-shadow .15s ease;
          position: relative;
        }
        .icon-btn:hover{ transform: translateY(-3px); box-shadow: 0 8px 20px rgba(11,22,40,0.06); }
        .hamburger { display:none; }

        /* Cart badge */
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Wishlist badge */
        .wishlist-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Profile icon styles */
        .profile-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        
        .profile-icon:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(11, 22, 40, 0.1);
        }
        
        /* Profile dropdown */
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          transform: translateY(10px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.28s cubic-bezier(0.2, 0.9, 0.2, 1);
          background: #ffffff;
          border-radius: 12px;
          padding: 14px;
          min-width: 180px;
          box-shadow: var(--shadow);
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 1100;
        }
        
        .profile-dropdown.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        
        .profile-dropdown-header {
          padding: 8px 12px;
          color: var(--text);
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 4px;
        }
        
        .profile-dropdown-item {
          padding: 8px 12px;
          border-radius: 8px;
          color: var(--text);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        
        .profile-dropdown-item:hover {
          color: var(--accent);
          background: rgba(0, 113, 227, 0.06);
        }
        
        .profile-dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        /* ---------- MOBILE MENU ---------- */
        .mobile-menu {
          position: fixed;
          inset: 64px 12px auto 12px;
          background: #ffffff;
          border-radius: 12px;
          padding: 14px;
          transform: translateY(-8px) scale(.995);
          opacity:0;
          pointer-events:none;
          transition: all .28s ease;
          box-shadow: 0 20px 40px rgba(8,18,30,0.08);
          border: 1px solid #e5e7eb;
        }
        .mobile-menu.open{
          transform: translateY(0) scale(1);
          opacity:1;
          pointer-events:auto;
        }
        .mobile-list{ list-style:none; margin:0; padding:8px; display:flex; flex-direction:column; gap:12px; }
        .mobile-section-title{ font-weight:700; color:var(--text); margin-bottom:6px; cursor: pointer; }
        .mobile-submenu {
          display:flex; flex-wrap:wrap; gap:10px;
        }
        .mobile-pill{
          padding:8px 12px; border-radius:999px; text-decoration:none; background:#f9fafb;
          border:1px solid #e5e7eb; color:var(--text);
          font-size:.92rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-pill:hover{ background: rgba(0,113,227,0.12); color:var(--accent); transform:translateY(-2px); }

        @media (max-width:980px){
          .navbar-container{ height:60px; }
          .hamburger{ display:block; }
          .icon-btn { width:40px; height:40px; border-radius:10px; }
        }

        @media (max-width:720px){
          .navbar-menu{ display:none; }
          .hamburger{ display:block; }
          .khatri-navbar{ padding:0 12px; }
        }

      `}</style>

      <nav ref={navRef} className={`khatri-navbar ${isScrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            Khatri<span>Store</span>
          </a>

          {/* ------- Desktop Menu ------- */}
          <ul className="navbar-menu" role="menubar">
            <li className="navbar-item" role="none">
              <a className="navbar-link" href="/" role="menuitem">Home</a>
            </li>

            <li
              className="navbar-item"
              onClick={() => handleDropdownToggle('products')}
              onMouseEnter={() => setActiveDropdown('products')}
              role="none"
            >
              <div className="navbar-link" aria-haspopup="true" aria-expanded={activeDropdown === 'products'}>
                Products
              </div>

              <div className={`dropdown ${activeDropdown === 'products' ? 'open' : ''}`} role="menu" aria-label="Products submenu">
                <div className="dropdown-column">
                  <div className="dropdown-title">Categories</div>
                  {productCategories.map((category, i) => (
                    <div 
                      key={i} 
                      className="dropdown-link" 
                      role="menuitem"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li className="navbar-item" role="none">
              <div className="navbar-link" role="menuitem" onClick={handleAboutClick}>
                About
              </div>
            </li>

            <li className="navbar-item" role="none">
              <div className="navbar-link" role="menuitem" onClick={handleContactClick}>
                Support
              </div>
            </li>
          </ul>

          {/* ------- Actions (search, wishlist, cart, profile, mobile) ------- */}
          <div className="navbar-actions">
            <button className="icon-btn" title="Search" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6"/>
              </svg>
            </button>

            <button className="icon-btn" title="Wishlist" aria-label="Wishlist" onClick={handleWishlistClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  stroke="currentColor" 
                  strokeWidth="1.2" 
                  fill={wishlistItemsCount > 0 ? "currentColor" : "none"}
                />
              </svg>
              {wishlistItemsCount > 0 && (
                <span className="wishlist-badge">{wishlistItemsCount}</span>
              )}
            </button>

            <button className="icon-btn" title="Cart" aria-label="Cart" onClick={handleCartClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 7h12l-1.2 9.6A2 2 0 0 1 14.8 19H9.2a2 2 0 0 1-1.98-2.4L6 7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap='round' strokeLinejoin='round'/>
                <path d="M9 7V6a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <div 
                  className="profile-icon" 
                  onClick={handleProfileClick}
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                  title={user.name || user.firstName || 'User'}
                >
                  {getUserInitial()}
                </div>
                
                <div className={`profile-dropdown ${isProfileDropdownOpen ? 'open' : ''}`}>
                  <div className="profile-dropdown-header">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || 'User'
                    }
                  </div>
                  <div className="profile-dropdown-item" onClick={() => navigate('/profile')}>
                    Profile
                  </div>
                  <div className="profile-dropdown-item" onClick={() => navigate('/orders')}>
                    Orders
                  </div>
                  <div className="profile-dropdown-item" onClick={() => navigate('/wishlist')}>
                    Wishlist
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <div className="profile-dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              <button 
                className="icon-btn" 
                title="Login" 
                aria-label="Login"
                onClick={handleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </button>
            )}

            <button
              className="icon-btn hamburger"
              onClick={() => {
                setIsMobileMenuOpen((p) => !p);
                setActiveDropdown(null);
              }}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap='round'/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap='round'/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ------- Mobile Drawer ------- */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} role="dialog" aria-label="Mobile menu">
          <ul className="mobile-list">
            <li>
              <a className="mobile-section-title" href="/">Home</a>
            </li>

            <li>
              <div
                onClick={() => toggleMobileSection('products')}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
              >
                <span className="mobile-section-title">Products</span>
                <span style={{ color: 'var(--muted)' }}>{mobileActiveSection === 'products' ? '−' : '+'}</span>
              </div>

              {mobileActiveSection === 'products' && (
                <div className="mobile-submenu" style={{ marginTop:8 }}>
                  {productCategories.map((category, i) => (
                    <div 
                      key={i} 
                      className="mobile-pill"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </li>

            <li>
              <div className="mobile-section-title" onClick={handleAboutClick}>
                About
              </div>
            </li>

            <li>
              <div className="mobile-section-title" onClick={handleContactClick}>
                Support
              </div>
            </li>
            
            {/* Mobile wishlist section */}
            <li>
              <div
                onClick={() => toggleMobileSection('wishlist')}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
              >
                <span className="mobile-section-title">
                  Wishlist {wishlistItemsCount > 0 && `(${wishlistItemsCount})`}
                </span>
                <span style={{ color: 'var(--muted)' }}>{mobileActiveSection === 'wishlist' ? '−' : '+'}</span>
              </div>
              {mobileActiveSection === 'wishlist' && (
                <div className="mobile-submenu" style={{ marginTop:8 }}>
                  <div className="mobile-pill" onClick={handleWishlistClick}>
                    View Wishlist
                  </div>
                </div>
              )}
            </li>
            
            {/* Mobile cart section */}
            <li>
              <div
                onClick={() => toggleMobileSection('cart')}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
              >
                <span className="mobile-section-title">
                  Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </span>
                <span style={{ color: 'var(--muted)' }}>{mobileActiveSection === 'cart' ? '−' : '+'}</span>
              </div>
              {mobileActiveSection === 'cart' && (
                <div className="mobile-submenu" style={{ marginTop:8 }}>
                  <div className="mobile-pill" onClick={handleCartClick}>
                    View Cart
                  </div>
                </div>
              )}
            </li>
            
            {/* Mobile profile section */}
            <li>
              <div
                onClick={() => toggleMobileSection('account')}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
              >
                <span className="mobile-section-title">Account</span>
                <span style={{ color: 'var(--muted)' }}>{mobileActiveSection === 'account' ? '−' : '+'}</span>
              </div>
              {mobileActiveSection === 'account' && (
                <div className="mobile-submenu" style={{ marginTop:8 }}>
                  {user ? (
                    <>
                      <div className="mobile-pill" onClick={() => navigate('/profile')}>Profile</div>
                      <div className="mobile-pill" onClick={() => navigate('/orders')}>Orders</div>
                      <div className="mobile-pill" onClick={() => navigate('/wishlist')}>Wishlist</div>
                      <div className="mobile-pill" onClick={handleLogout}>Logout</div>
                    </>
                  ) : (
                    <div className="mobile-pill" onClick={handleLogin}>Login</div>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}