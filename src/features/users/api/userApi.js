import { apiFetch } from "../../../helpers/apiHelper";

export const getUsers = () => apiFetch("/users");
export const getMe = () => apiFetch("/users/me");