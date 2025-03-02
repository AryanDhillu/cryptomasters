import React, { useState, useEffect } from "react";
import QuestionPopup from "./QuestionPopup";
import { FaSpinner, FaCubes, FaLayerGroup, FaQuestion, FaLock, FaClock, FaCoins, FaCheck } from "react-icons/fa";
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

  // Function to fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://crypto-master-3nth.onrender.com/questions", {
        method: "POST",
        headers: {
          accept: "application/json",
          "API_KEY": "thisisaryansapikeydontpushittogithub",
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
      const userResponse = await fetch("https://crypto-master-3nth.onrender.com/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          API_KEY: "thisisaryansapikeydontpushittogithub",
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
      const response = await fetch("https://crypto-master-3nth.onrender.com/questionStart", {
        method: "POST",
        headers: {
          accept: "application/json",
          "API_KEY": "thisisaryansapikeydontpushittogithub",
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
        {questions.map((q, index) => (
          <div
            key={q._id || index}
            className={`question-card ${q.status || "locked"}`}
            onClick={() => handleQuestionClick(q)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {q.status === "locked" && (
              <div className="lock-overlay">
                <FaLock className="lock-icon" />
              </div>
            )}
            <div className="card-content">
              <h3 className="card-topic">
                <FaCubes className="topic-icon" />{q.topic}
              </h3>
              
              <div className="card-info-row">
                <div className="info-item">
                  <FaLayerGroup className="info-icon" />{q.difficulty}
                </div>
                <div className="info-item">
                  <FaQuestion className="info-icon" />{q.question_type}
                </div>
              </div>
              
              <div className="status-badge">
                {q.status === "locked" ? 
                  <FaLock className="status-icon" /> : 
                  q.status === "attempting" ? 
                    <FaClock className="status-icon" /> : 
                    <FaCheck className="status-icon" />
                }
                Status: {q.status}
              </div>
              
              <div className="profit-multiplier">
                <FaCoins className="multiplier-icon" />
                Profit Multiplier: {q.multiplier}x
              </div>
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