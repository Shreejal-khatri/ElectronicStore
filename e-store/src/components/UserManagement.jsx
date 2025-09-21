import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [adminToken, navigate]);


  const fetchUsers = async () => {
  try {
    setLoading(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    setUsers(res.data.data);
    setError(null);
  } catch (err) {
    setError("Failed to fetch users. Make sure you are an admin.");
    console.error("Error fetching users:", err);
    if (err.response && err.response.status === 401) {
      navigate("/admin/login");
    }
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    setSuccessMessage("User deleted successfully");
    fetchUsers();
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    setError("Failed to delete user. Please try again.");
    console.error("Error deleting user:", err);
  }
};


  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f5f7f9",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      color: "#2c3e50",
      fontWeight: "700",
      fontSize: "28px",
      margin: "0",
    },
    refreshBtn: {
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      boxShadow: "0 4px 8px rgba(52, 152, 219, 0.3)",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    },
    alert: {
      padding: "14px 20px",
      borderRadius: "6px",
      marginBottom: "20px",
      fontWeight: "600",
      fontSize: "15px",
    },
    alertError: {
      backgroundColor: "#fde8e8",
      color: "#e53e3e",
      border: "1.5px solid #feb2b2",
    },
    alertSuccess: {
      backgroundColor: "#f0fff4",
      color: "#38a169",
      border: "1.5px solid #9ae6b4",
    },
    loading: {
      textAlign: "center",
      padding: "50px",
      color: "#718096",
      fontStyle: "italic",
      fontSize: "18px",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      padding: "18px 20px",
      textAlign: "left",
      fontWeight: "700",
      color: "#4a5568",
      borderBottom: "3px solid #e2e8f0",
      fontSize: "16px",
    },
    tableCell: {
      padding: "18px 20px",
      borderBottom: "1.5px solid #e2e8f0",
      color: "#2d3748",
      fontSize: "15px",
    },
    tableRow: {
      transition: "background-color 0.3s ease",
      cursor: "default",
    },
    noUsers: {
      textAlign: "center",
      color: "#a0aec0",
      fontStyle: "italic",
      fontSize: "16px",
    },
    roleBadge: {
      backgroundColor: "#ebf8ff",
      color: "#3182ce",
      padding: "6px 12px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.03em",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.03em",
    },
    statusActive: {
      backgroundColor: "#f0fff4",
      color: "#38a169",
    },
    actions: {
      display: "flex",
      gap: "12px",
    },
    actionBtn: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    viewBtn: {
      backgroundColor: "#e6fffa",
      color: "#234e52",
    },
    deleteBtn: {
      backgroundColor: "#fff5f5",
      color: "#c53030",
    },
    modalOverlay: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "12px",
      width: "520px",
      maxWidth: "90%",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
      overflow: "hidden",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 28px",
      borderBottom: "1.5px solid #e2e8f0",
    },
    modalTitle: {
      margin: "0",
      color: "#2d3748",
      fontWeight: "700",
      fontSize: "22px",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "28px",
      cursor: "pointer",
      color: "#718096",
      transition: "color 0.3s ease",
    },
    modalBody: {
      padding: "28px 32px",
    },
    userDetail: {
      display: "flex",
      marginBottom: "20px",
    },
    detailLabel: {
      fontWeight: "700",
      width: "110px",
      color: "#4a5568",
      fontSize: "16px",
    },
    detailValue: {
      color: "#2d3748",
      fontSize: "16px",
    },
    modalFooter: {
      padding: "20px 28px",
      borderTop: "1.5px solid #e2e8f0",
      textAlign: "right",
    },
    closeModalBtn: {
      backgroundColor: "#e2e8f0",
      color: "#4a5568",
      border: "none",
      padding: "10px 22px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "background-color 0.3s ease",
    },
  };

  if (!adminToken) return <div>Access denied. Please log in as admin.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <button
          onClick={fetchUsers}
          style={styles.refreshBtn}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2980b9";
            e.target.style.boxShadow = "0 6px 12px rgba(41, 128, 185, 0.5)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#3498db";
            e.target.style.boxShadow = "0 4px 8px rgba(52, 152, 219, 0.3)";
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>
      )}
      {successMessage && (
        <div style={{ ...styles.alert, ...styles.alertSuccess }}>
          {successMessage}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Role</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...styles.tableCell, ...styles.noUsers }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    style={styles.tableRow}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f7fafc")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={styles.tableCell}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.roleBadge}>{user.role || "User"}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ ...styles.statusBadge, ...styles.statusActive }}>
                        Active
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => viewUserDetails(user)}
                          style={{ ...styles.actionBtn, ...styles.viewBtn }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#b2f5ea")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#e6fffa")
                          }
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#fed7d7")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#fff5f5")
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>User Details</h3>
              <button
                onClick={closeModal}
                style={styles.closeBtn}
                onMouseOver={(e) => (e.target.style.color = "#4a5568")}
                onMouseOut={(e) => (e.target.style.color = "#718096")}
              >
                &times;
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.userDetail}>
                <label style={styles.detailLabel}>Name:</label>
                <span style={styles.detailValue}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </span>
              </div>
              <div style={styles.userDetail}>
                <label style={styles.detailLabel}>Email:</label>
                <span style={styles.detailValue}>{selectedUser.email}</span>
              </div>
              <div style={styles.userDetail}>
                <label style={styles.detailLabel}>Role:</label>
                <span style={styles.detailValue}>{selectedUser.role || "User"}</span>
              </div>
              <div style={styles.userDetail}>
                <label style={styles.detailLabel}>Joined:</label>
                <span style={styles.detailValue}>
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={closeModal}
                style={styles.closeModalBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#cbd5e0")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#e2e8f0")
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}