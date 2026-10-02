import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "lostFounds",
  initialState: { lostFounds: [], lostFound: null, isLostFound: false },
  reducers: {
    lostFounds: (s, { payload }) => { s.lostFounds = payload; },
    lostFound: (s, { payload }) => { s.lostFound = payload; },
    isLostFound: (s, { payload }) => { s.isLostFound = payload; },
  },
});
export const { lostFounds, lostFound, isLostFound } = slice.actions;
export default slice.reducer;