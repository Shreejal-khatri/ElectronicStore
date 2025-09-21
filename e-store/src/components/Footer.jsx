import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const styles = `
    /* Reset body margin and padding */
    body {
      margin: 0;
      padding: 0;
    }
    
    .footer {
      background-color: #111;
      color: #eee;
      padding: 50px 20px 20px;
      font-family: Arial, sans-serif;
      width: 100%;
      box-sizing: border-box; /* Ensure padding doesn't add to total width */
    }
    .footer-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    .footer-logo {
      font-size: 1.6rem;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .footer-logo span {
      color: #4cafef;
    }
    .footer-about {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #bbb;
    }
    .footer-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-links li {
      margin: 8px 0;
    }
    .footer-links a {
      text-decoration: none;
      color: #bbb;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: #fff;
    }
    .footer-social {
      display: flex;
      gap: 12px;
      margin-top: 15px;
    }
    .footer-social a {
      display: inline-flex;
      width: 36px;
      height: 36px;
      background-color: #222;
      color: #eee;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;
      font-size: 1rem;
    }
    .footer-social a:hover {
      background-color: #4cafef;
      transform: translateY(-2px);
    }
    .footer-bottom {
      border-top: 1px solid #333;
      margin-top: 30px;
      padding-top: 15px;
      text-align: center;
      font-size: 0.85rem;
      color: #888;
      width: 100%;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <footer className="footer">
        <div className="footer-container">
          {/* Brand / About */}
          <div>
            <div className="footer-logo">
              Khatri<span>Store</span>
            </div>
            <p className="footer-about">
              Your trusted electronics partner. We bring you the latest gadgets,
              laptops, and accessories with premium quality and service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Shop</a></li>
              <li><a href="/aboutus">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="footer-title">Customer Support</h3>
            <ul className="footer-links">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="footer-title">Follow Us</h3>
            <div className="footer-social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} Khatri-Store. All rights reserved.
        </div>
      </footer>
    </>
  );
}