import axios from "axios";
import { getToken } from "./tokenService";

const BOOKS_BASE = import.meta.env.VITE_BOOKS_API_URL;
const USERS_BASE = import.meta.env.VITE_USERS_API_URL;

function withAuth(instance: ReturnType<typeof axios.create>) {
  instance.interceptors.request.use((cfg) => {
    const token = getToken() ?? localStorage.getItem("token") ?? "";
    const t = token.trim();
    if (t) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${t}`;
      (cfg.headers as any)["x-auth-token"] = t; 
    }
    return cfg;
  });
  return instance;
}

export const apiBooks = withAuth(axios.create({
  baseURL: BOOKS_BASE,
  timeout: 15000,
}));

export const apiUsers = withAuth(axios.create({
  baseURL: USERS_BASE,
  timeout: 15000,
}));
