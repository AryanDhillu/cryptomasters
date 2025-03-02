import React, { useState, useEffect } from "react";
import QuestionPopup from "./QuestionPopup";
import { FaSpinner } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Slider } from "antd";
import { setUser } from "../userSlice";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [questionToOpen, setQuestionToOpen] = useState(null);

  const user = useSelector((state) => state.user);
  const timeLeft = user.time_left; 
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Function to fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "API_KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, [user.user_id]);

  const handleQuestionClick = (question) => {
    if (question.status === "locked") {
      if (user.coins < (question.minimum_spend || 10)) {
        alert(`You need at least ${question.minimum_spend || 10} coins to unlock this question.`);
        return; // Stop execution and prevent the modal from opening
      }
      setQuestionToOpen(question);
      setBetAmount(question.minimum_spend || 10);
      setIsModalOpen(true);
    } else if (question.status === "attempting") {
      setSelectedQuestion(question);
    }
  };

  const fetchUpdatedUser = async () => {
    try {
      const userResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          API_KEY: API_KEY,
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        dispatch(setUser(updatedUserData));
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  };

  const handleModalConfirm = async () => {
    if (!questionToOpen) return;

    const requestData = {
      user_id: user.user_id,
      question_id: questionToOpen.question_id,
      bet_amt: betAmount,
      time_left: timeLeft,
    };

    try {
      const response = await fetch(`${API_URL}/questionStart`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "API_KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.success) {
        dispatch(setUser({ ...user, coins: responseData.coins }));
        fetchUpdatedUser();
      }

      setIsModalOpen(false);
      setSelectedQuestion(questionToOpen);
      fetchQuestions(); // Refresh questions after unlocking
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };


  const generateMarks = (min, max) => {
    const stepSize = (max - min) / 4; // Divide into 5 points (including min and max)
    let marks = {};
  
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(min + i * stepSize);
      marks[value] = `${value}`; // Assign labels to marks
    }
  
    return marks;
  };
  

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
      <div className="questions-grid">
        {questions.map((q) => (
          <div
            key={q._id}
            className={`question-card ${q.difficulty?.toLowerCase() || "easy"}`}
            onClick={() => handleQuestionClick(q)}
          >
            <div className="card-content">
              <p className="question-text">Topic: {q.topic}</p>
              <p className="question-text">Difficulty: {q.difficulty}</p>
              <p className="question-text">Type: {q.question_type}</p>
              <p className="question-text">Status: {q.status}</p>
              <p className="question-text">Profit Multiplier: {q.multiplier}x</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Confirm and Place Your Bet!"
        open={isModalOpen}
        onOk={handleModalConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Confirm & Bet"
        cancelText="Cancel"
      >
        <p>This question is locked. Confirm to continue and place your bet!</p>
        <p>Select the amount of coins you want to bet:</p>
        {questionToOpen && (
          <>
            <Slider 
              min={questionToOpen.minimum_spend || 10} 
              max={user.coins} 
              value={betAmount}
              onChange={(value) => setBetAmount(value)} 
              marks={generateMarks(questionToOpen.minimum_spend || 10, user.coins)}
              step={null} // This ensures only stop points can be selected
            />

            <p>Bet Amount: <strong>{betAmount} coins</strong></p>
            <p>
              Potential Earnings:{" "}
              <strong>{(betAmount * (questionToOpen.multiplier || 1)).toFixed(2)} coins</strong>
            </p>
          </>
        )}
      </Modal>

      {selectedQuestion && (
        <QuestionPopup
          question={selectedQuestion}
          onClose={() => {
            setSelectedQuestion(null);
            fetchQuestions(); // Refresh questions when exiting
          }}
          userId={user.user_id}
          timeLeft={timeLeft}  
          betAmount={betAmount}
          fetchQuestions={fetchQuestions} // Pass function to refresh questions
        />
      )}
    </div>
  );
};

export default Questions;
