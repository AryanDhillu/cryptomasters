import React from "react";

const QuestionPopup = ({ question, options, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>{question}</h2>
        {options.map((option, index) => (
          <div key={index}>
            <input type="radio" id={`option${index}`} name="questionOption" />
            <label htmlFor={`option${index}`}>{option}</label>
          </div>
        ))}
        <div style={{ marginTop: "20px" }}>
          <button onClick={onClose} style={styles.button}>Exit</button>
          <button onClick={onClose} style={styles.button}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "center",
  },
  button: {
    margin: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default QuestionPopup;
