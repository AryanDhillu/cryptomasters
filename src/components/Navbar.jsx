import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user);

  return (
    <nav>
      <div>App Name</div>
      <div>
        <span>User ID: {user.email_id || "--"}</span>
        <br />
        <span>Username: {user.name || "--"}</span>
        <br />
        <span>Coins Left: {user.coins || "--"}</span>
        <br />
        <span>Time Left: 1500</span>
      </div>
    </nav>
  );
};

export default Navbar;
