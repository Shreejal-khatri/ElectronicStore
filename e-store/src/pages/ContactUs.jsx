import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = `
    /* Reuse the floating elements from home/about */
    .floating-elements {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .floating-element {
      position: absolute;
      border-radius: 50%;
      animation: float 15s infinite ease-in-out, pulse 6s infinite ease-in-out;
      opacity: 0.4;
      background: radial-gradient(circle at top left, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.2), rgba(236, 72, 153, 0.1));
      box-shadow: 
        0 0 60px rgba(147, 51, 234, 0.4),
        0 0 100px rgba(79, 70, 229, 0.3),
        0 0 140px rgba(236, 72, 153, 0.2),
        inset 0 0 60px rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(147, 51, 234, 0.3);
    }

    .floating-element:nth-child(1) {
      width: 300px;
      height: 300px;
      top: 10%;
      left: -10%;
      animation-delay: 0s;
      background: radial-gradient(circle at top left, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.2));
      box-shadow: 
        0 0 80px rgba(147, 51, 234, 0.5),
        0 0 120px rgba(79, 70, 229, 0.3),
        inset 0 0 40px rgba(255, 255, 255, 0.1);
    }

    .floating-element:nth-child(2) {
      width: 200px;
      height: 200px;
      top: 50%;
      right: -5%;
      animation-delay: -7s;
      background: radial-gradient(circle at top right, rgba(236, 72, 153, 0.3), rgba(147, 51, 234, 0.2));
      box-shadow: 
        0 0 70px rgba(236, 72, 153, 0.5),
        0 0 110px rgba(147, 51, 234, 0.3),
        inset 0 0 35px rgba(255, 255, 255, 0.1);
    }

    .floating-element:nth-child(3) {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 10%;
      animation-delay: -3s;
      background: radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.3), rgba(236, 72, 153, 0.2));
      box-shadow: 
        0 0 60px rgba(79, 70, 229, 0.5),
        0 0 100px rgba(236, 72, 153, 0.3),
        inset 0 0 30px rgba(255, 255, 255, 0.1);
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(40px, -30px) rotate(120deg); }
      66% { transform: translate(-30px, 20px) rotate(240deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.15); opacity: 0.5; }
    }

    /* Contact Us Specific Styles */
    .contact-us {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #1f2937;
      line-height: 1.6;
      font-weight: 400;
      position: relative;
    }

    /* Hero Section */
    .contact-hero {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
      color: #1f2937;
      padding: 160px 0 100px;
      text-align: center;
      position: relative;
      overflow: hidden;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-parallax {
      transform: translateY(${scrollY * 0.3}px);
      transition: transform 0.1s ease-out;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 32px;
      animation: slideUp 1s ease-out;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .hero-content h1 {
      font-size: clamp(3rem, 6vw, 4.5rem);
      font-weight: 800;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: linear-gradient(135deg, #111827 0%, #374151 50%, #6b7280 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: slideUp 1s ease-out 0.2s both;
    }

    .hero-content p {
      font-size: 1.3rem;
      color: #4b5563;
      margin-bottom: 40px;
      font-weight: 400;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      animation: slideUp 1s ease-out 0.4s both;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Contact Section */
    .contact-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .contact-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center;
      align-items: start;
    }

    /* Contact Info */
    .contact-info {
      position: static;
      max-width: 800px;
    }

    .section-header {
      margin-bottom: 40px;
      text-align: center;
    }

    .section-badge {
      display: inline-block;
      background: rgba(0, 0, 0, 0.1);
      color: #000000;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 20px;
      color: #111827;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .section-header p {
      font-size: 1.2rem;
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 40px;
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .contact-method {
      background: #ffffff;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
    }

    .contact-method:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.08);
    }

    .method-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .method-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .contact-method h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #111827;
    }

    .contact-method p {
      font-size: 1rem;
      color: #4b5563;
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .contact-method a {
      color: #000000;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .contact-method a:hover {
      color: #374151;
    }

    /* FAQ Section */
    .faq-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
      color: white;
    }

    .faq-section .section-badge {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .faq-section .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .faq-section .section-header h2 {
      color: #ffffff;
    }

    .faq-section .section-header p {
      color: #cbd5e1;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .faq-item {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 32px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.3s ease;
    }

    .faq-item:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
    }

    .faq-item h4 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
    }

    .faq-item p {
      font-size: 1rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0;
    }

    /* Office Hours Section */
    .hours-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%);
      text-align: center;
      position: relative;
    }

    .hours-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
    }

    .hours-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    .hours-header {
      margin-bottom: 60px;
    }

    .hours-badge {
      display: inline-block;
      background: rgba(0, 0, 0, 0.1);
      color: #000000;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .hours-content h3 {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      color: #111827;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .hours-content p {
      font-size: 1.2rem;
      color: #4b5563;
      line-height: 1.5;
      max-width: 600px;
      margin: 0 auto;
    }

    .hours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      margin-top: 60px;
    }

    .hours-item {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .hours-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #000000, #333333);
    }

    .hours-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.08);
    }

    .hours-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .hours-item:hover .hours-icon {
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      border-color: #000000;
    }

    .hours-icon svg {
      width: 28px;
      height: 28px;
      color: #4b5563;
      transition: color 0.3s ease;
    }

    .hours-item:hover .hours-icon svg {
      color: white;
    }

    .hours-item h4 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
      text-align: center;
    }

    .hours-item p {
      font-size: 1rem;
      color: #4b5563;
      margin: 0;
      line-height: 1.6;
      text-align: center;
    }

    .hours-item .time-highlight {
      color: #000000;
      font-weight: 600;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .contact-wrapper {
        grid-template-columns: 1fr;
        gap: 60px;
      }

      .contact-info {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .contact-hero {
        padding: 140px 0 80px;
        min-height: 50vh;
      }

      .hero-content h1 {
        font-size: 2.5rem;
      }

      .hero-content p {
        font-size: 1.1rem;
      }

      .contact-methods {
        gap: 20px;
      }

      .contact-method {
        padding: 24px;
      }

      .faq-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .hours-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 20px;
      }

      .hero-content {
        padding: 0 20px;
      }

      .contact-hero {
        padding: 120px 0 60px;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .contact-method,
      .faq-item,
      .hours-content {
        padding: 24px;
      }
    }
  `;

  const contactMethods = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours.",
      contact: "getogod69@gmail.com"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      description: "Speak with our customer service team directly.",
      contact: "+977 (98345899436)"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Visit Us",
      description: "Come visit our flagship store in downtown.",
      contact: "Nepal, Kahtmandu, Durbarmarg, 1400"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Live Chat",
      description: "Chat with our support team in real-time.",
      contact: "Available 9 AM - 6 PM PST"
    }
  ];

  const faqData = [
    {
      question: "What are your shipping options?",
      answer: "We offer free standard shipping on orders over $50, with express shipping available for faster delivery."
    },
    {
      question: "What's your return policy?",
      answer: "We accept returns within 30 days of purchase for most items in original condition with proof of purchase."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes! Our technical support team is available via phone, email, or live chat to help with any product questions."
    },
    {
      question: "Can I track my order?",
      answer: "Absolutely! Once your order ships, you'll receive a tracking number via email to monitor your package."
    },
    {
      question: "Do you have a warranty program?",
      answer: "Yes, all our products come with manufacturer warranties, and we offer extended warranty options at checkout."
    },
    {
      question: "How can I cancel my order?",
      answer: "Orders can be cancelled within 1 hour of placement. After that, please contact our customer service team."
    }
  ];

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="contact-us">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-parallax">
            <div className="hero-content">
              <div className="hero-badge">● Get In Touch</div>
              <h1>We're Here to Help</h1>
              <p>
                Have a question, need support, or want to collaborate? Our team is ready 
                to assist you with anything you need.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <div className="contact-wrapper">
              {/* Contact Information */}
              <div className="contact-info">
                <div className="section-header">
                  <div className="section-badge">Contact Info</div>
                  <h2>Let's Connect</h2>
                  <p>
                    Choose the method that works best for you. We're committed to 
                    providing exceptional customer service across all channels.
                  </p>
                </div>

                <div className="contact-methods">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="contact-method">
                      <div className="method-icon">
                        {method.icon}
                      </div>
                      <h3>{method.title}</h3>
                      <p>{method.description}</p>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        {method.contact}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Hours Section */}
        <section className="hours-section">
          <div className="container">
            <div className="hours-content">
              <div className="hours-header">
                <div className="hours-badge">Business Hours</div>
                <h3>Office Hours & Support</h3>
                <p>Our team is available to help during the following hours. We're committed to providing timely support across all our service channels.</p>
              </div>
              
              <div className="hours-grid">
                <div className="hours-item">
                  <div className="hours-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4>Customer Service</h4>
                  <p>Monday - Friday<br /><span className="time-highlight">9:00 AM - 6:00 PM PST</span></p>
                </div>
                <div className="hours-item">
                  <div className="hours-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4>Technical Support</h4>
                  <p>Monday - Saturday<br /><span className="time-highlight">8:00 AM - 8:00 PM PST</span></p>
                </div>
                <div className="hours-item">
                  <div className="hours-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4>Live Chat</h4>
                  <p>Monday - Friday<br /><span className="time-highlight">9:00 AM - 6:00 PM PST</span></p>
                </div>
                <div className="hours-item">
                  <div className="hours-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4>Store Visits</h4>
                  <p>Monday - Saturday<br /><span className="time-highlight">10:00 AM - 7:00 PM PST</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">FAQ</div>
              <h2>Frequently Asked Questions</h2>
              <p>
                Find quick answers to common questions about our products, services, 
                and policies.
              </p>
            </div>

            <div className="faq-grid">
              {faqData.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h4>{faq.question}</h4>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}