import React, { useState, useEffect } from "react";
import {
  FiBox,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import ProductManagement from "../components/ProductManagement";
import UserManagement from "../components/UserManagement";
import OrderManagement from "../components/OrderManagement";
import AdminSettings from "../pages/AdminSettings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cardsVisible, setCardsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //Check for admin token
    const adminToken = localStorage.getItem("adminToken");
    const tokenExpiry = localStorage.getItem("adminTokenExpiry");
    
    //Redirect to login if no token or token is expired
    if (!adminToken || (tokenExpiry && Date.now() > parseInt(tokenExpiry))) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminTokenExpiry");
      navigate("/admin/login");
      return;
    }
    
    const timer = setTimeout(() => setCardsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  const navCards = [
    {
      id: "products",
      title: "Product Management",
      icon: <FiBox size={48} />,
      description: "Manage inventory, prices, and product details",
    },
    {
      id: "users",
      title: "User Management",
      icon: <FiUsers size={48} />,
      description: "Manage user accounts, roles, and permissions",
    },
    {
      id: "orders",
      title: "Order Management",
      icon: <FiShoppingCart size={48} />,
      description: "View and manage customer orders",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <FiBarChart2 size={48} />,
      description: "View sales data and performance metrics",
    },
    {
      id: "settings",
      title: "Settings",
      icon: <FiSettings size={48} />,
      description: "Configure system preferences and options",
    },
  ];

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <div style={styles.userInfo}>
            <span style={styles.userName}>Admin User</span>
            <div style={styles.userAvatar}>AU</div>
          </div>
        </div>
      </header>

      <main style={styles.mainContent}>
        {activeTab === "overview" && (
          <section style={styles.cardsContainer}>
            <h2 style={styles.sectionTitle}>Management Modules</h2>

            <div style={styles.cardsGrid}>
              {navCards.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    ...styles.card,
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible
                      ? "translateY(0) scale(1)"
                      : "translateY(20px) scale(0.95)",
                    transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s, box-shadow 0.3s ease`,
                  }}
                  onClick={() => setActiveTab(card.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 12px 20px -10px rgba(0,0,0,0.15)";
                    e.currentTarget.style.transform =
                      "translateY(-6px) scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  <div style={styles.cardIconContainer}>
                    {React.cloneElement(card.icon, { color: "#ff1f1f" })}
                  </div>

                  <h3 style={styles.cardTitle}>{card.title}</h3>

                  <p style={styles.cardDescription}>{card.description}</p>

                  <div style={styles.cardAction}>
                    <span style={styles.cardLink}>Access Module</span>
                    <FiArrowRight style={styles.arrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab !== "overview" && (
          <section style={styles.moduleContainer}>
            <header style={styles.moduleHeader}>
              <button
                onClick={() => setActiveTab("overview")}
                style={styles.backButton}
              >
                <FiArrowLeft style={{ marginRight: 6 }} />
                Back to Dashboard
              </button>

              <nav style={styles.moduleTabs}>
                <button
                  onClick={() => setActiveTab("products")}
                  style={{
                    ...styles.moduleTab,
                    ...(activeTab === "products"
                      ? styles.activeModuleTab
                      : {}),
                  }}
                >
                  <FiBox size={18} />
                  Products
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  style={{
                    ...styles.moduleTab,
                    ...(activeTab === "users"
                      ? styles.activeModuleTab
                      : {}),
                  }}
                >
                  <FiUsers size={18} />
                  Users
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  style={{
                    ...styles.moduleTab,
                    ...(activeTab === "orders"
                      ? styles.activeModuleTab
                      : {}),
                  }}
                >
                  <FiShoppingCart size={18} />
                  Orders
                </button>
                
                <button
                  onClick={() => setActiveTab("analytics")}
                  style={{
                    ...styles.moduleTab,
                    ...(activeTab === "analytics"
                      ? styles.activeModuleTab
                      : {}),
                  }}
                >
                  <FiBarChart2 size={18} />
                  Analytics
                </button>
                
                <button
                  onClick={() => setActiveTab("settings")}
                  style={{
                    ...styles.moduleTab,
                    ...(activeTab === "settings"
                      ? styles.activeModuleTab
                      : {}),
                  }}
                >
                  <FiSettings size={18} />
                  Settings
                </button>
              </nav>
            </header>

            <div style={styles.moduleContent}>
              {activeTab === "products" && <ProductManagement />}
              {activeTab === "users" && <UserManagement />}
              {activeTab === "orders" && <OrderManagement />}
              {activeTab === "analytics" && (
                <div style={styles.placeholder}>
                  <h3>Analytics Dashboard</h3>
                  <p>
                    Sales metrics and performance data would be displayed here.
                  </p>
                </div>
              )}
              {activeTab === "settings" && <AdminSettings />}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboard: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "'Inter', sans-serif",
    color: "#111827",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 24px",
    zIndex: 10,
  },

  headerContent: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#6b7280",
  },

  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    backgroundColor: "#374151",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    userSelect: "none",
  },

  mainContent: {
    flexGrow: 1,
    maxWidth: 1400,
    margin: "50px auto",
    padding: "0 20px",
    width: "100%",
  },

  cardsContainer: {
    marginBottom: 56,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 28,
    textAlign: "center",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    gridAutoRows: "auto",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "28px 20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    userSelect: "none",
    minHeight: 250,
    height: "auto",
  },

  cardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 1.4,
  },

  cardAction: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontWeight: 600,
    color: "#111827",
  },

  cardLink: {
    fontSize: 13,
  },

  arrowIcon: {
    fontSize: 16,
    transition: "transform 0.2s ease",
  },

  moduleContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginTop: 32,
  },

  moduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },

  backButton: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    color: "#374151",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    userSelect: "none",
    transition: "background-color 0.2s ease",
  },

  moduleTabs: {
    display: "flex",
    gap: 6,
  },

  moduleTab: {
    padding: "8px 12px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: 6,
    color: "#6b7280",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    userSelect: "none",
    transition: "color 0.2s ease, background-color 0.2s ease",
  },

  activeModuleTab: {
    color: "#111827",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  moduleContent: {
    padding: 0,
    minHeight: 300,
  },

  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    color: "#6b7280",
    fontSize: 15,
    fontWeight: 500,
    padding: 20,
  },
};