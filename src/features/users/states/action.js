import { getUsers, getMe } from "../api/userApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { users } from "./reducer";
import { setProfile } from "../../auth/states/reducer";

export const asyncGetUsers = () => async (dispatch) => {
  try { const { data } = await getUsers(); dispatch(users(data.users ?? [])); }
  catch (e) { showErrorDialog(e.message); }
};

export const asyncGetProfile = () => async (dispatch) => {
  try { const { data } = await getMe(); dispatch(setProfile(data.user ?? data)); return true; }
  catch { return false; }
};
