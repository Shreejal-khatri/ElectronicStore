import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

//Custom hook for media queries
function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setShowMessage(false);

  try {
    
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      setShowMessage(true);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");
      setShowMessage(true);

      setTimeout(() => navigate("/"), 1500);
    }
  } catch (err) {
    setError("Server error. Try again later.");
    setShowMessage(true);
  }
};


  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div
        style={{
          ...styles.wrapper,
          padding: isMobile ? "20px 15px" : isTablet ? "40px 30px" : "80px 40px",
        }}
      >
        <div
          style={{
            ...styles.container,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : isTablet ? "90%" : "70%",
            maxWidth: "1100px",
          }}
        >
          <div
            style={{
              ...styles.left,
              padding: isMobile ? "30px 20px" : isTablet ? "40px 40px" : "60px 60px",
              width: isMobile ? "100%" : "50%",
            }}
          >
            <div style={styles.logoRow}>
              <span style={styles.logo}>
                <span style={styles.khatri}>Khatri</span>
                <span style={styles.store}> Store</span>
              </span>
            </div>

            <div style={styles.formWrapper}>
              <h3
                style={{
                  ...styles.title,
                  fontSize: isMobile ? "1.6rem" : "2.2rem",
                }}
              >
                Log in to your account
              </h3>
              <p
                style={{
                  ...styles.subtitle,
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  marginBottom: isMobile ? "28px" : "36px",
                }}
              >
                Welcome back! Please enter your details
              </p>

              {showMessage && error && (
                <div style={{ ...styles.message, ...styles.errorMessage }}>
                  <AiOutlineCloseCircle style={styles.icon} />
                  <span>{error}</span>
                </div>
              )}
              {showMessage && success && (
                <div style={{ ...styles.message, ...styles.successMessage }}>
                  <AiOutlineCheckCircle style={styles.icon} />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <div style={styles.labelContainer}>
                    <label htmlFor="password" style={styles.label}>
                      Password
                    </label>
                    <a href="#!" style={styles.linkMuted}>
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" style={styles.btnPrimary}>
                  <span style={styles.btnText}>Sign in</span>
                </button>
              </form>

              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span style={styles.dividerText}>Or</span>
                <div style={styles.dividerLine}></div>
              </div>


              <p style={styles.signupText}>
                Don't have an account?{" "}
                <Link to="/signup" style={styles.linkInfo}>
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {!isMobile && (
            <div
              style={{
                ...styles.right,
                width: "50%",
                height: isTablet ? "320px" : "auto",
                marginLeft: "20px",
              }}
            >
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="Login"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  wrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    display: "flex",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff",
    transition: "padding 0.3s ease",
  },
  logoRow: {
    marginBottom: "30px",
    textAlign: "center",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  khatri: {
    color: "#000000",
  },
  store: {
    color: "#2563eb",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "8px",
    fontWeight: "700",
    color: "#1a202c",
    letterSpacing: "-0.5px",
    textAlign: "center",
    transition: "font-size 0.3s ease",
  },
  subtitle: {
    color: "#64748b",
    lineHeight: "1.5",
    textAlign: "center",
    transition: "font-size 0.3s ease, margin-bottom 0.3s ease",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "14px 0",
    background: "linear-gradient(135deg, #1a202c, #2d3748)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  btnText: {
    letterSpacing: "0.5px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    padding: "0 15px",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  btnSecondary: {
    padding: "14px 0",
    background: "transparent",
    color: "#374151",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "24px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  btnSecondaryText: {
    letterSpacing: "0.5px",
  },
  signupText: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#64748b",
    margin: "0",
  },
  linkMuted: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  linkInfo: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600",
  },
  right: {
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    transition: "all 0.3s ease",
  },
  message: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "500",
    marginBottom: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
    opacity: 1,
    transition: "opacity 0.5s ease, transform 0.5s ease",
  },
  successMessage: {
    backgroundColor: "#d1fae5",
    border: "1px solid #34d399",
    color: "#065f46",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    border: "1px solid #f87171",
    color: "#b91c1c",
  },
  icon: {
    fontSize: "1.3rem",
  },
};
