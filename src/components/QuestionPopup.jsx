import React, { useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";


const QuestionPopup = ({ question, options, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-wrapper">
        <div className="popup-content">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>

          <div className="question-section">
            <h2>{question}</h2>
          </div>

          <div className="options-section">
            {options.map((option, index) => (
              <div 
                key={index}
                className={`option-item ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => setSelectedOption(index)}
              >
                <div className="option-number">{index + 1}</div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button 
              className="cancel-button" 
              onClick={onClose}
            >
              Exit
            </button>
            <button 
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
            >
              {isSubmitting ? <FaCheck /> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;