import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUser, FaCoins, FaClock, FaBars } from "react-icons/fa";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { setTimeLeft } from "../userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.user.time_left);
  const timerStarted = useSelector((state) => state.user.timerStarted);

  useEffect(() => {
    let timer;
    if (timerStarted && timeLeft > 0) {
      timer = setInterval(() => {
        dispatch(setTimeLeft(timeLeft - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerStarted, timeLeft, dispatch]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <BootstrapNavbar.Brand className="brand-name">
          <span className="gradient-text">App Name</span>
        </BootstrapNavbar.Brand>

        <div className="navbar-toggle">
          <FaBars />
        </div>

        <div className="user-info-container">
          <div className="info-item">
            <div className="icon-wrapper">
              <FaUser className="icon" />
            </div>
            <div className="info-content">
              <span className="info-label">User ID</span>
              <span className="info-value">{user.user_id || "--"}</span>
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
              <span className="info-value">
                {user.coins !== undefined ? user.coins.toFixed(2) : "--"}
              </span>
            </div>
          </div>

          {timerStarted && (
            <div className="info-item">
              <div className="icon-wrapper">
                <FaClock className="icon" />
              </div>
              <div className="info-content">
                <span className="info-label">Time Left</span>
                <span className="info-value">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
