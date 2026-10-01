import { loginApi, registerApi, logoutApi } from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog, firstFieldError } from "../../../helpers/toolsHelper";
import { isAuthLogin, isAuthRegister, isAuthLogout } from "./reducer";

export const asyncLogin = (form) => async (dispatch) => {
  try {
    const { data } = await loginApi(form);
    putAccessToken(data.token);
    dispatch(isAuthLogin({ token: data.token, user: data.user }));
    return true;
  } catch (e) { showErrorDialog(firstFieldError(e)); return false; }
};

export const asyncRegister = (form) => async (dispatch) => {
  try {
    await registerApi(form);
    dispatch(isAuthRegister());
    await showSuccessDialog("Akun dibuat, silakan masuk.");
    return true;
  } catch (e) { showErrorDialog(firstFieldError(e)); return false; }
};

export const asyncLogout = () => async (dispatch) => {
  try { await logoutApi(); } catch { /* token mungkin sudah kedaluwarsa */ }
  removeAccessToken();
  dispatch(isAuthLogout());
};