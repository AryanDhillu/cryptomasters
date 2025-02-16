import React, { useState, useEffect } from "react";
import QuestionPopup from "./QuestionPopup";
import { FaSpinner } from "react-icons/fa";


const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://crypto-master-3nth.onrender.com/questions", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "API_KEY": "thisisaryansapikeydontpushittogithub",
          },
          body: "",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <FaSpinner className="loading-icon" />
        <p>Loading Questions...</p>
      </div>
    );
  }

  return (
    <div className="questions-page">
      <h1 className="page-title">Crypto Challenge Questions</h1>
      <div className="difficulty-legend">
        <div className="legend-item">
          <span className="legend-dot easy"></span>
          Easy
        </div>
        <div className="legend-item">
          <span className="legend-dot medium"></span>
          Medium
        </div>
        <div className="legend-item">
          <span className="legend-dot hard"></span>
          Hard
        </div>
      </div>
      
      <div className="questions-grid">
        {questions.map((q) => (
          <div
            key={q._id}
            className={`question-card ${q.difficulty?.toLowerCase() || 'easy'}`}
            onClick={() => setSelectedQuestion(q)}
          >
            <div className="card-content">
              {q.question_type === "mcq_image" ? (
                <div className="image-container">
                  <img src={q.question} alt="MCQ Question" />
                </div>
              ) : (
                <p className="question-text">{q.question}</p>
              )}
              <div className="difficulty-badge">
                {q.difficulty || 'Easy'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <QuestionPopup
          question={selectedQuestion.question}
          options={selectedQuestion.options || []}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};

export default Questions;