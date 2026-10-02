import { apiFetch } from "../../../helpers/apiHelper";

export const getLostFounds = (params) => apiFetch("/lost-founds", { params });
export const getLostFound = (id) => apiFetch(`/lost-founds/${id}`);
export const addLostFound = (body) => apiFetch("/lost-founds", { method: "POST", body });
export const changeLostFound = (id, body) => apiFetch(`/lost-founds/${id}`, { method: "PUT", body });
export const changeCover = (id, file) => {
  const form = new FormData();
  form.append("cover", file);
  return apiFetch(`/lost-founds/${id}/cover`, { method: "POST", form });
};
export const deleteLostFound = (id) => apiFetch(`/lost-founds/${id}`, { method: "DELETE" });
export const getStatsDaily = () => apiFetch("/lost-founds/stats/daily");
export const getStatsMonthly = () => apiFetch("/lost-founds/stats/monthly");