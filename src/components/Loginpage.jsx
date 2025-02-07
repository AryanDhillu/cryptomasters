import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../userSlice";

const Loginpage = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://crypto-master-3nth.onrender.com/login", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "API_KEY": "thisisaryansapikeydontpushittogithub",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setUser(data)); // Save user data to Redux
      navigate("/start");
      
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login. Try again.");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Loginpage;
