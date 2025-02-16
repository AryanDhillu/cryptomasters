import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaCoins, FaClock, FaBars, FaTimes } from "react-icons/fa";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <BootstrapNavbar.Brand className="brand-name">
          <span className="gradient-text">App Name</span>
        </BootstrapNavbar.Brand>
        
        <div className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`user-info-container ${isMenuOpen ? 'show' : ''}`}>
          <div className="info-item">
            <div className="icon-wrapper">
              <FaUser className="icon" />
            </div>
            <div className="info-content">
              <span className="info-label">User ID</span>
              <span className="info-value">{user.email_id || "--"}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-wrapper">
              <FaUser className="icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Username</span>
              <span className="info-value">{user.name || "--"}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-wrapper">
              <FaCoins className="icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Coins Left</span>
              <span className="info-value">{user.coins || "--"}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-wrapper">
              <FaClock className="icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Time Left</span>
              <span className="info-value">1500</span>
            </div>
          </div>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;