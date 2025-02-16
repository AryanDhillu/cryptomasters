import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRocket } from 'react-icons/fa';


const Start = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/questions");
  };

  return (
    <div className="start-container">
      <div className="start-content">
        <div className="title-section">
          <h1 className="start-title">
            <FaRocket className="title-icon" />
            Crypto Masters Challenge
          </h1>
          <p className="start-subtitle">Ready to test your knowledge?</p>
        </div>

        <div className="start-card">
          <div className="card-content">
            <h2>Welcome to the Challenge</h2>
            <p>Test your crypto knowledge and compete with others!</p>
            
            <div className="info-points">
              <div className="info-item">
                <span className="info-circle">?</span>
                <span>Multiple Questions</span>
              </div>
              <div className="info-item">
                <span className="info-circle">⏱</span>
                <span>Timed Challenges</span>
              </div>
              <div className="info-item">
                <span className="info-circle">🏆</span>
                <span>Win Rewards</span>
              </div>
            </div>

            <button onClick={handleClick} className="start-button">
              Start Challenge
              <FaPlay className="button-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;