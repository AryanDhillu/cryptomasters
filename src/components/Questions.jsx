import React, { useState } from "react";
import QuestionPopup from "./QuestionPopup";

const Questions = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = Array.from({ length: 13 }, (_, index) => ({
    id: index,
    text: `Question ${index + 1}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
  }));

  return (
    <div>
      <h1>Questions Page</h1>
      <div>
        {questions.map((q) => (
          <div
            key={q.id}
            style={{ border: "1px solid black", padding: "10px", margin: "5px", cursor: "pointer" }}
            onClick={() => setSelectedQuestion(q)}
          >
            {q.text}
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <QuestionPopup
          question={selectedQuestion.text}
          options={selectedQuestion.options}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};

export default Questions;
