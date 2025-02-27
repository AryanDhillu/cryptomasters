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

  useEffect(() => {
    const fetchQuestions = async () => {
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

    fetchQuestions();
  }, [user.user_id]);

  const handleQuestionClick = async (question) => {
    if (question.status === "locked" || question.status === "attempting") {
      setQuestionToOpen(question);
      setIsModalOpen(true);
    } else {
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
        dispatch(setUser(updatedUserData)); // 🔥 Force UI update (Navbar updates too)
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
      spent_amt: betAmount,
      multiplier: questionToOpen.multiplier,
      time_left: timeLeft,
      solved: false,
    };

    try {
      const response = await fetch("https://crypto-master-3nth.onrender.com/update", {
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
      
      if (responseData.success) {
        // 🔥 Update Redux store with new coins & fetch updated data
        dispatch(setUser({ ...user, coins: responseData.coins }));
        fetchUpdatedUser(); // Ensure Navbar updates
      }

      console.log(responseData)
      console.log(`Bet placed: ${betAmount} coins. Updated coins: ${responseData.coins}`);
      setIsModalOpen(false);
      setSelectedQuestion(questionToOpen);
    } catch (error) {
      console.error("Error updating question status:", error);
    }
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
              <p className="question-text">Profit: {q.multiplier}</p>
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
        <Slider 
          min={questionToOpen ? questionToOpen.minimum_spend : 10} 
          max={user.coins} 
          defaultValue={betAmount} 
          onChange={(value) => setBetAmount(value)} 
        />

        <p>Bet Amount: {betAmount} coins</p>
      </Modal>

      {selectedQuestion && (
        <QuestionPopup
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          userId={user.user_id}
          timeLeft={timeLeft}  
          betAmount={betAmount}
        />
      )}
    </div>
  );
};

export default Questions;
