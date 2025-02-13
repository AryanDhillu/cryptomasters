import React, { useState, useEffect } from "react";
import QuestionPopup from "./QuestionPopup";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://crypto-master-3nth.onrender.com/questions", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "API_KEY": "thisisaryansapikeydontpushittogithub",
          },
          body: "", // Empty body for POST request
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Questions Page</h1>
      <div>
        {questions.map((q) => (
          <div
            key={q._id}
            style={{ border: "1px solid black", padding: "10px", margin: "5px", cursor: "pointer" }}
            onClick={() => setSelectedQuestion(q)}
          >
            {q.question_type === "mcq_image" ? (
              <img src={q.question} alt="MCQ Question" style={{ width: "200px" }} />
            ) : (
              <p>{q.question}</p>
            )}
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
