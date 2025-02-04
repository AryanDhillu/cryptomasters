import React from 'react'
import { useNavigate } from "react-router-dom";

const Start = () => {
    const navigate = useNavigate();

    const handleClick = (e) => {
      e.preventDefault();
      navigate("/questions");
    };
  
    return (
      <div>
        <h1>Start Page</h1>
        <button onClick={handleClick}>Start</button>
      </div>
    );
  };
  
  export default Start;
