import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { SplineSceneBasic } from "./ui/demo";
import { Spotlight } from "./ui/SpotlightCursor";

const LandingPage = () => {
  const features = [
    {
      icon: "📊",
      title: "Expense Tracking",
      description:
        "Track your daily expenses and income with an intuitive interface",
    },
    {
      icon: "🎯",
      title: "Budget Goals",
      description:
        "Set and monitor your financial goals with visual progress tracking",
    },
    {
      icon: "📈",
      title: "Analytics",
      description:
        "Get insights into your spending patterns with detailed analytics",
    },
    {
      icon: "🔄",
      title: "Recurring Transactions",
      description: "Easily manage your recurring bills and income",
    },
    {
      icon: "🏷️",
      title: "Smart Categories",
      description:
        "Organize transactions with customizable categories and tags",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description:
        "Access your finances on any device with our responsive design",
    },
  ];

  return (
    <div className="landing-page">
      <header
        className="hero-section"
        style={{
          padding: "60px 2rem 0 2rem",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="hero-flex-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1600,
            margin: "0 auto",
          }}
        >
          {/* Left: Hero Content */}
          <div
            className="hero-content"
            style={{
              flex: 1,
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <h1 className="hero-title">
              Take Control of Your <span className="highlight">Finances</span>
            </h1>
            <p className="hero-subtitle">
              Track expenses, set budgets, and achieve your financial goals with
              our intuitive expense tracking solution
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="cta-button">
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <a href="#features" className="secondary-button">
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
            </div>
          </div>
          {/* Center: Robot 3D Scene */}
          <div
            className="hero-robot"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 0,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                width: 700,
                height: 800,
                position: "relative",
                overflow: "hidden",
                pointerEvents: "auto",
              }}
            >
              <SplineSceneBasic />
              <Spotlight size={350} />
            </div>
          </div>
          {/* Right: Monthly Overview Card */}
          <div
            className="hero-image"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <div className="stats-card">
              <div className="stats-header">
                <h3>Monthly Overview</h3>
                <span className="stats-date">April 2024</span>
              </div>
              <div className="stats-body">
                <div className="stat-item">
                  <span className="stat-label">Income</span>
                  <span className="stat-value income">+$4,250.00</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Expenses</span>
                  <span className="stat-value expense">-$2,840.00</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Balance</span>
                  <span className="stat-value positive">$1,410.00</span>
                </div>
              </div>
              <div className="stats-chart">
                <div className="chart-bar">
                  <div className="bar-fill" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2 className="section-title">
          Everything you need to manage your finances
        </h2>
        <p className="section-subtitle">
          Our expense tracker comes packed with powerful features to help you
          stay on top of your financial game
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to start tracking?</h2>
          <p className="cta-description">
            Join thousands of users who are already managing their finances
            better with our expense tracker
          </p>
          <Link to="/dashboard" className="cta-button">
            Start For Free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Expense Tracker</h3>
            <p>Making finance management simple and effective</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#privacy">Privacy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
