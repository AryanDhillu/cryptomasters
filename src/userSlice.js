import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email_id: "",
  coins: 0,
  time_left: 0,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...action.payload, isLoggedIn: true };
    },
    logoutUser: () => initialState,
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
