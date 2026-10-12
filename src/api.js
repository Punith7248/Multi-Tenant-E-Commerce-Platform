const API_BASE = import.meta.env.VITE_API_URL || '/api';
export function getToken(){return localStorage.getItem('novacart-token');}
export function setAuth(data){if(data?.token)localStorage.setItem('novacart-token',data.token);if(data?.user)localStorage.setItem('novacart-user',JSON.stringify(data.user));}
export function clearAuth(){localStorage.removeItem('novacart-token');localStorage.removeItem('novacart-user');sessionStorage.removeItem('novacart-super-admin');}
export async function api(path,options={}){const headers={'Content-Type':'application/json',...(options.headers||{})};const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;const res=await fetch(`${API_BASE}${path}`,{...options,headers});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||'Request failed');return data;}
