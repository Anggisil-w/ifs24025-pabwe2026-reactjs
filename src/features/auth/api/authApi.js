import {apiFetch} from '../../../helpers/apiHelper';
export const registerApi=payload=>apiFetch('/auth/register',{method:'POST',body:payload,auth:false});
export const loginApi=payload=>apiFetch('/auth/login',{method:'POST',body:payload,auth:false});
export const logoutApi=()=>apiFetch('/auth/logout',{method:'POST'});
