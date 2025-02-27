import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRocket } from "react-icons/fa";
import { setTimeLeft, startTimer } from "../userSlice";

const Start = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timerStarted = useSelector((state) => state.user.timerStarted);
  const timeLeft = useSelector((state) => state.user.time_left);

  useEffect(() => {
    let timer;
    if (timerStarted && timeLeft > 0) {
      timer = setInterval(() => {
        dispatch(setTimeLeft(timeLeft - 1));
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerStarted, timeLeft, dispatch]);

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(startTimer()); // Start the timer
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
