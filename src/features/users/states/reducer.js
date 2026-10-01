import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "users",
  initialState: { users: [] },
  reducers: { users: (s, { payload }) => { s.users = payload; } },
});
export const { users } = slice.actions;
export default slice.reducer;
