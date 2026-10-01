import { createSlice } from "@reduxjs/toolkit";
import { getAccessToken } from "../../../helpers/apiHelper";

const slice = createSlice({
  name: "auth",
  initialState: { token: getAccessToken(), user: null },
  reducers: {
    isAuthLogin: (s, { payload }) => { s.token = payload.token; s.user = payload.user ?? s.user; },
    isAuthRegister: (s) => s,
    isAuthLogout: (s) => { s.token = null; s.user = null; },
    setProfile: (s, { payload }) => { s.user = payload; },
  },
});
export const { isAuthLogin, isAuthRegister, isAuthLogout, setProfile } = slice.actions;
export default slice.reducer;
