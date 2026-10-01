import * as api from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog, showConfirmDialog, firstFieldError } from "../../../helpers/toolsHelper";
import { lostFounds, lostFound, isLostFound } from "./reducer";

export const asyncGetLostFounds = (params) => async (dispatch) => {
  dispatch(isLostFound(true));
  try { const { data } = await api.getLostFounds(params); dispatch(lostFounds(data.lost_founds)); }
  catch (e) { showErrorDialog(e.message); }
  dispatch(isLostFound(false));
};

export const asyncGetLostFound = (id) => async (dispatch) => {
  dispatch(lostFound(null));
  try { const { data } = await api.getLostFound(id); dispatch(lostFound(data.lost_found)); return true; }
  catch (e) { showErrorDialog(e.message); return false; }
};

const mutate = (call, okMsg) => async () => {
  try { await call(); await showSuccessDialog(okMsg); return true; }
  catch (e) { showErrorDialog(firstFieldError(e)); return false; }
};

export const asyncAddLostFound = (form) => mutate(() => api.addLostFound(form), "Laporan ditambahkan.");
export const asyncChangeLostFound = (id, form) => mutate(() => api.changeLostFound(id, form), "Laporan diperbarui.");
export const asyncChangeCover = (id, file) => mutate(() => api.changeCover(id, file), "Cover diperbarui.");

export const asyncDeleteLostFound = (id) => async () => {
  if (!(await showConfirmDialog("Laporan ini akan dihapus permanen."))) return false;
  return mutate(() => api.deleteLostFound(id), "Laporan dihapus.")();
};
