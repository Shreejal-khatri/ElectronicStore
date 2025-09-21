import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = `
    /* Reuse the floating elements from home */
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

    /* About Us Specific Styles */
    .about-us {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #1f2937;
      line-height: 1.6;
      font-weight: 400;
      position: relative;
    }

    /* Hero Section */
    .about-hero {
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

    /* Mission Section */
    .mission-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
      position: relative;
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
      max-width: 700px;
      margin: 0 auto 40px;
      line-height: 1.5;
    }

    .mission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      margin-top: 60px;
    }

    .mission-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
    }

    .mission-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.08);
    }

    .mission-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .mission-icon svg {
      width: 32px;
      height: 32px;
      color: white;
    }

    .mission-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #111827;
    }

    .mission-card p {
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.6;
    }

    /* Timeline Section - Vertical layout with center line */
    .timeline-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
      color: white;
      text-align: center;
    }

    .timeline-section .section-badge {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .timeline-section .section-header h2 {
      color: #ffffff;
    }

    .timeline-section .section-header p {
      color: #cbd5e1;
    }

    .timeline {
      position: relative;
      max-width: 1000px;
      margin: 80px auto 0;
      padding: 40px 0;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
      transform: translateX(-50%);
      border-radius: 2px;
    }

    .timeline-item {
      display: flex;
      justify-content: flex-end;
      padding-right: 50px;
      position: relative;
      margin-bottom: 80px;
      width: 50%;
      text-align: left;
    }

    .timeline-item:nth-child(even) {
      align-self: flex-end;
      justify-content: flex-start;
      padding-left: 50px;
      padding-right: 0;
      left: 50%;
      text-align: left;
    }

    .timeline-content {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 32px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      width: 100%;
      max-width: 400px;
      position: relative;
      transition: all 0.3s ease;
    }

    .timeline-content:hover {
      transform: translateY(-8px);
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .timeline-content::after {
      content: '';
      position: absolute;
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 15px solid transparent;
      border-bottom: 15px solid transparent;
      border-left: 15px solid rgba(255, 255, 255, 0.08);
    }

    .timeline-item:nth-child(even) .timeline-content::after {
      right: auto;
      left: -15px;
      border-left: none;
      border-right: 15px solid rgba(255, 255, 255, 0.08);
    }

    .timeline-item:nth-child(even) .timeline-content:hover::after {
      border-right-color: rgba(255, 255, 255, 0.12);
    }

    .timeline-content:hover::after {
      border-left-color: rgba(255, 255, 255, 0.12);
    }

    .timeline-icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: -80px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      border: 4px solid rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }

    .timeline-item:nth-child(even) .timeline-icon {
      right: auto;
      left: -80px;
    }

    .timeline-content:hover + .timeline-icon {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-50%) scale(1.1);
    }

    .timeline-icon svg {
      width: 24px;
      height: 24px;
      color: #ffffff;
    }

    .timeline-year {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timeline-content h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #ffffff;
      line-height: 1.3;
    }

    .timeline-content p {
      font-size: 1rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0;
    }

    /* Team Section */
    .team-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 40px;
      margin-top: 60px;
    }

    .team-card {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
    }

    .team-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.08);
    }

    .team-image {
      width: 100%;
      height: 280px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .team-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .team-image:hover img {
      transform: scale(1.05);
    }

    .team-info {
      padding: 32px;
    }

    .team-name {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #111827;
    }

    .team-role {
      font-size: 1rem;
      color: #666666;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .team-description {
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .team-social {
      display: flex;
      gap: 16px;
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #000000;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .social-link svg {
      width: 18px;
      height: 18px;
      color: #6b7280;
    }

    .social-link:hover svg {
      color: white;
    }

    /* Values Section */
    .values-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
      color: white;
      text-align: center;
    }

    .values-section .section-badge {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .values-section .section-header h2 {
      color: #ffffff;
    }

    .values-section .section-header p {
      color: #cbd5e1;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-top: 60px;
    }

    .value-card {
      padding: 40px 24px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
    }

    .value-icon {
      width: 70px;
      height: 70px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .value-icon svg {
      width: 32px;
      height: 32px;
      color: #ffffff;
    }

    .value-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #ffffff;
    }

    .value-card p {
      font-size: 1rem;
      color: #cbd5e1;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      padding: 120px 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
      text-align: center;
    }

    .cta-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: #111827;
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 24px;
    }

    .cta-content p {
      color: #4b5563;
      font-size: 1.2rem;
      margin-bottom: 40px;
    }

    .cta-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 40px;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #000000;
      border: 2px solid #000000;
      padding: 14px 32px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary:hover {
      background: #000000;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .about-hero {
        padding: 140px 0 80px;
        min-height: 50vh;
      }

      .hero-content h1 {
        font-size: 2.5rem;
      }

      .hero-content p {
        font-size: 1.1rem;
      }

      .mission-grid,
      .team-grid,
      .values-grid,
      .timeline {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary,
      .btn-secondary {
        width: 280px;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 20px;
      }

      .hero-content {
        padding: 0 20px;
      }

      .about-hero {
        padding: 120px 0 60px;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .mission-card,
      .team-card,
      .value-card,
      .timeline-item {
        padding: 24px;
      }
    }
  `;

  // Team data with placeholder for image sources
  const teamMembers = [
    {
      name: "Shreejal Khatri",
      role: "CEO & Founder",
      description: "Tech industry veteran with 15+ years of experience in consumer electronics and e-commerce.",
      image: "https://res.cloudinary.com/dzrfxgqb6/image/upload/v1758432165/Business1_b2vsrf.jpg" 
    },
    {
      name: "Mr. Hubbiverse",
      role: "CTO",
      description: "Former lead engineer at major tech company, specializing in scalable e-commerce platforms.",
      image: "https://res.cloudinary.com/dzrfxgqb6/image/upload/v1758432182/Business2_xsg8jh.jpg" 
    },
    {
      name: "Ryan Aryal",
      role: "Head of Design",
      description: "Award-winning designer focused on creating intuitive user experiences across all platforms.",
      image: "https://res.cloudinary.com/dzrfxgqb6/image/upload/v1758432232/Business4_lco8yn.jpg" 
    },
    {
      name: "Manish Basnet",
      role: "Operations Director",
      description: "Supply chain expert with a track record of optimizing logistics and reducing operational costs.",
      image: "https://res.cloudinary.com/dzrfxgqb6/image/upload/v1758432377/Business5_gyyraz.jpg" 
    }
  ];

  // Timeline data with icons
  const timelineData = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to make cutting-edge technology accessible to everyone.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      year: "2024",
      title: "First Product Launch",
      description: "Launched our flagship product line to critical acclaim and customer satisfaction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      year: "2025",
      title: "Series B Funding",
      description: "Secured $20M in funding to expand our product offerings and global reach.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded operations to Europe and Asia, serving customers in over 30 countries.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      year: "2025",
      title: "Sustainability Initiative",
      description: "Committed to carbon-neutral operations and eco-friendly product design.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="about-us">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-parallax">
            <div className="hero-content">
              <div className="hero-badge">● Our Story</div>
              <h1>Redefining Tech Commerce</h1>
              <p>
                We're on a mission to bring cutting-edge technology to everyone, with a focus on 
                quality, innovation, and exceptional customer experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">Our Purpose</div>
              <h2>Why We Exist</h2>
              <p>
                Founded in 2023, we've grown from a small startup to a leading tech retailer 
                by staying true to our core values and constantly pushing the boundaries of 
                what's possible in e-commerce.
              </p>
            </div>

            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3>Innovation</h3>
                <p>
                  We constantly explore emerging technologies to bring our customers the latest 
                  and most advanced products on the market.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3>Customer Focus</h3>
                <p>
                  Our customers are at the heart of everything we do. We strive to exceed 
                  expectations at every touchpoint.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3>Sustainability</h3>
                <p>
                  We're committed to reducing our environmental impact through responsible 
                  sourcing and eco-friendly practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">Our Journey</div>
              <h2>Milestones & Achievements</h2>
              <p>
                From our humble beginnings to becoming an industry leader, here are the key 
                moments that have shaped our company.
              </p>
            </div>

            <div className="timeline">
              {timelineData.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="timeline-icon">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">Leadership</div>
              <h2>Meet Our Team</h2>
              <p>
                Our diverse team of experts brings together decades of experience in technology, 
                design, and business to deliver exceptional products and service.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-image">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        Add Image URL
                      </div>
                    )}
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-description">{member.description}</p>
                    <div className="team-social">
                      <a href="#" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">Our Values</div>
              <h2>What Guides Us</h2>
              <p>
                These core principles shape our decisions, actions, and relationships with 
                customers, partners, and employees.
              </p>
            </div>

            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3>Excellence</h3>
                <p>
                  We pursue the highest standards in everything we do, from product selection 
                  to customer service.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3>Collaboration</h3>
                <p>
                  We believe that the best results come from working together, both within 
                  our team and with our partners.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3>Innovation</h3>
                <p>
                  We embrace change and continuously seek new ways to improve our products 
                  and services.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3>Integrity</h3>
                <p>
                  We conduct our business with honesty, transparency, and respect for all 
                  stakeholders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Join Us on Our Journey</h2>
              <p>
                Whether you're looking for the latest technology or want to be part of our story, 
                we'd love to connect with you.
              </p>
              <div className="cta-buttons">
                <Link to="/products" className="btn-primary">Explore Our Products</Link>
                <Link to="/contact" className="btn-secondary">Get In Touch</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}