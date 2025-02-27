import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../userSlice"; // Optional action to reset state

const TimeUpDisplay = () => {
  const timeLeft = useSelector((state) => state.user.time_left);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("Time’s up!");
      // You can trigger logout, show a modal, or navigate the user
      dispatch(logoutUser());
    }
  }, [timeLeft, dispatch]);

  return (
    <>
      {timeLeft <= 0 && (
        <div className="time-up-container">
          <h2>⏳ Time’s Up!</h2>
          <p>Your session has expired.</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Restart
          </button>
        </div>
      )}
    </>
  );
};

export default TimeUpDisplay;
