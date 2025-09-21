import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!terms) {
    setError("You must accept the terms");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
 
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
    } else {
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    }

  } catch (err) {
    setError("Server error. Try again later.");
  }
};


  //Fade out effect
  useEffect(() => {
    let timer;
    if (error || success) {
      timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  //Responsive handling
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={styles.pageContainer}>

      <Navbar />

      <div
        style={{
          ...styles.wrapper,
          padding: isMobile ? "40px 10px 20px 10px" : "80px 20px 40px 20px"
        }}
      >

        <div
          style={{
            ...styles.container,
            flexDirection: isMobile ? "column" : "row",
            marginTop: isMobile ? "10px" : "20px"
          }}
        >

          <div
            style={{
              ...styles.left,
              padding: isMobile ? "30px 20px" : "60px 50px"
            }}
          >

            <div style={styles.logoRow}>
              <span style={styles.logo}>
                <span style={styles.khatri}>Khatri</span>
                <span style={styles.store}> Store</span>
              </span>
            </div>

            <div style={styles.formWrapper}>

              <h3 style={styles.title}>Create your account</h3>
              <p style={styles.subtitle}>Join us today! Please fill in your details</p>

              {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
              {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}

              <div
                style={{
                  ...styles.nameRow,
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "0" : "16px"
                }}
              >

                <div style={styles.inputGroup}>
                  <label htmlFor="firstName" style={styles.label}>First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    style={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="lastName" style={styles.label}>Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    style={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  style={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  id="terms"
                  type="checkbox"
                  style={styles.checkbox}
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label htmlFor="terms" style={styles.checkboxLabel}>
                  I agree to the{" "}
                  <a href="#!" style={styles.linkInfo}>Terms of Service</a> and{" "}
                  <a href="#!" style={styles.linkInfo}>Privacy Policy</a>
                </label>
              </div>

              <button style={styles.btnPrimary} onClick={handleSubmit}>
                <span style={styles.btnText}>Create Account</span>
              </button>

              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span style={styles.dividerText}>Or</span>
                <div style={styles.dividerLine}></div>
              </div>



              <p style={styles.signupText}>
                Already have an account?{" "}
                <Link to="/login" style={styles.linkInfo}>Sign in here</Link>
              </p>

            </div>

          </div>

          <div
            style={{
              ...styles.right,
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "200px" : "100%"
            }}
          >
            <img
              src="https://res.cloudinary.com/dzrfxgqb6/image/upload/v1758459498/coverlogin_js3wya.jpg"
              alt="Signup"
              style={styles.image}
            />
          </div>

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
    minHeight: "100vh"
  },

  wrapper: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#f8fafc"
  },

  container: {
    display: "flex",
    maxWidth: "1200px",
    width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    backgroundColor: "#ffffff",
    marginTop: "20px"
  },

  left: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff"
  },

  logoRow: {
    marginBottom: "40px"
  },

  logo: {
    fontSize: "1.8rem",
    fontWeight: "700",
    letterSpacing: "0.5px"
  },
  
  khatri: {
    color: "#000000"
  },
  
  store: {
    color: "#2563eb"
  },

  formWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "450px"
  },

  title: {
    marginBottom: "8px",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a202c",
    letterSpacing: "-0.5px"
  },
  
  subtitle: {
    marginBottom: "32px",
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.5"
  },

  nameRow: {
    display: "flex",
    marginBottom: "24px"
  },
  
  inputGroup: {
    marginBottom: "24px",
    flex: "1"
  },

  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px"
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    boxSizing: "border-box"
  },

  checkboxGroup: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "24px"
  },
  
  checkbox: {
    width: "18px",
    height: "18px",
    marginTop: "2px",
    accentColor: "#2563eb"
  },
  
  checkboxLabel: {
    fontSize: "0.875rem",
    color: " #374151",
    lineHeight: "1.5"
  },

  btnPrimary: {
    padding: "16px 0",
    background: "linear-gradient(135deg, #1a202c, #2d3748)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "24px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  
  btnText: {
    letterSpacing: "0.5px"
  },

  divider: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px"
  },
  
  dividerLine: {
    flex: "1",
    height: "1px",
    backgroundColor: "#e2e8f0"
  },
  
  dividerText: {
    padding: "0 15px",
    color: "#64748b",
    fontSize: "0.875rem"
  },

  btnSecondary: {
    padding: "16px 0",
    background: "transparent",
    color: "#374151",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "32px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  
  btnSecondaryText: {
    letterSpacing: "0.5px"
  },

  signupText: {
    textAlign: "center",
    fontSize: "0.9375rem",
    color: "#64748b",
    margin: "0"
  },
  
  linkInfo: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600"
  },

  right: {
    flex: "1.2",
    minWidth: "300px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  },
  
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  message: {
    padding: "12px 16px",
    borderRadius: "10px",
    fontWeight: "500",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "opacity 0.5s ease"
  },
  
  error: {
    border: "1px solid #f87171",
    backgroundColor: "#fee2e2",
    color: "#b91c1c"
  },
  
  success: {
    border: "1px solid #34d399",
    backgroundColor: "#d1fae5",
    color: "#065f46"
  }
};